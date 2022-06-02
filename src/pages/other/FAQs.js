import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { getDiscountPrice } from "../../helpers/product";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ChooseAddressModal from "./ChooseAddressModal"
import PDFViewer from 'pdf-viewer-reactjs'
import {getAll} from "../../services/Addresses"
import {GetDetailByID, updatePP, updateStatus} from "../../services/Transaction"
import {fUpload} from "../../services/FManager"
import {
  deleteAllFromCart
} from "../../redux/actions/cartActions";
import NumberFormat from 'react-number-format';
import ls from 'local-storage'
import { parse } from "uuid";
import { Button } from "react-scroll";
import { Document, Page } from 'react-pdf';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond/dist/filepond.min.css'
import { FilePond, File, registerPlugin } from 'react-filepond'
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

const Checkout = ({ location, cartItems, currency, deleteAllFromCart }) => {
  ////console.log(typeof location.state.data.iid)
  const { pathname } = location;
  let cartTotalPrice = 0;
  const [modalShow, setModalShow] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [details, setDetails] = useState([]);
  const [trx, setTrx] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [files, setFiles] = useState([])
  const [showFP, setShowFP] = useState(false)
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }


  return (
    <Fragment>
      <ChooseAddressModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product = {[]}
        addresses={addresses}
        setDetails={setDetails}
      />
      <MetaTags>
        <title>Hiji Official Store | Frequently Asked Questions</title>
        <meta
          name="Hiji Official Store"
          content="Frequently Asked Questions Hiji Official Store."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Beranda</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Frequently Asked Questions
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
          <div style={{margin:"25px", paddingRight:"5%", paddingLeft:"5%"}}>
              <div align="center">
                <h3>Frequently Asked Questions</h3>
              </div>
            <p><b>A. Bagaimana cara melakukan pemesanan ?</b></p>
            <p>Anda bisa langsung klik menu product dan pilih barang yang dibutuhkan , lalu masukan ke trolli belanja kamu.</p>
            <p><b>B. Saya telah memesan dan konfirmasi pembayaran. Apa yang harus saya lakukan selanjutnya?</b></p>
            <p>Kami melakukan konfirmasi pesanan diproses, dan kami akan konfirmasi alamat kirim saat akan melakukan pengantaran.</p>
            <p><b>C. Apakah saya akan menerima konfirmasi pesanan setelah selesai melakukan pemesanan?</b></p>
            <p>Konfirmasi dengan ringkasan pesanan akan dikirimkan melalui whatsapp sesaat setelah anda selesai melakukan pemesanan. Kami juga akan mengirimkan informasi melalui Whatsapp untuk memberikan informasi terbaru tentang status pesanan anda.</p>
            <p><b>D. Bagaimana cara membatalkan pesanan saya?</b></p>
            <p>Pembatalan pesanan tergantung dari status pesanan. Apabila pesanan belum diproduksi digudang kami, maka kami dapat membantu membatalkan pesanan tersebut, silahkan hubungi admin kami.</p>
            <p><b>E. Bagaimana cara mengubah alamat pengiriman penerima untuk pesanan saya?</b></p>
            <p>Selama tidak mengubah besar ongkos kirim yang ditetapkan diawal pemesanan, maka perubahan alamat tujuan kirim bisa langsung menghubungi admin kami. Dengan catatan kami belum melakukan pengiriman. Apabila ada perubahan alamat silahkan tambahkan alamat baru di kolom shipping Address, lalu pilih change address dan add new address. Jangan lupa untuk memilih Kembali alamat yang benar.</p>
            <p><b>F. Bisakah saya mengubah produk dari pesanan saya setelah pesanan saya diproses? Perubahan produk pesanan tidak dapat dilakukan</b></p>
            <p>Perubahan produk pesanan tidak dapat dilakukan.</p>
            <p><b>G. Saya tidak sengaja memesan produk yang sama, dapatkah saya batalkan salah satunya?</b></p>
            <p>Anda bisa segera menghubungi admin, pemesanan hanya dapat dibatalkan apabila produk belum diproduksi dan anda belum melakukan transfer. Sekali lagi kesalahan yang terjadi karena customer, kita tidak terima retur dalam bentuk apapun.</p>
            <p><b>H. Bagaimana mengubah metode pembayaran untuk pesanan saya?</b></p>
            <p>Perubahan metode pembayaran tidak dapat dilakukan karena kami hanya menerima pembayaran melalui transfer.</p>
            <p><b>I. Saya menerima pesanan saya tidak lengkap, apa yang harus saya lakukan?</b></p>
            <p>Harap konsumen menghubungi admin kami.</p>
            <p><b>J. Bagaimana saya mengecek status pesanan?</b></p>
            <p>Anda dapat melakukan konfirmasi ke admin.</p>
            <p><b>K. Berapa besar biaya untuk ongkos kirim?</b></p>
            <p>Untuk jarak tempuh dalam kota radius … km, ongkos kirim Rp10.000 . Bila jarak tempuh melebihi … km, ongkos kirim akan diinformasikan pada saat melakukan pemesanan.</p>
            <p><b>L. Kapan saya menerima pesanan saya?</b></p>
            <p>Untuk jarak tempuh … km, estimasi pengiriman tergantung alamat yang dituju. Admin akan konfirmasi 1x24 jam kepada costumer.</p>
            <p><b>M. Bisakah saya menjadwalkan pengiriman?</b></p>
            <p>Bisa asalkan masih di jam operational kami yaitu Pkl 09.00-15.00 Hari Senin sampe Jumat , dan Pkl 09.00-14.000 Hari Sabtu. Pesanan atau konfirmasi pembayaran yang masuk di Hari Minggu akan di proses di Hari Senin. </p>
            <p><b>N. Apakah pengiriman bisa dilakukan pada hari Sabtu & Minggu serta hari libur nasional?</b></p>
            <p>Pengiriman bisa dilakukan hanya pada jam operational kantor.</p>
            <p><b>O. Apakah pengiriman pesanan saya bisa dipercepat?</b></p>
            <p>Untuk pengiriman menggunakan kurir umum seperti JNE, JNT, SICEPAT, dll tidak bisa dipastikan karena sudah masuk system otomatis dari gerai ekspedisi. Untuk kurir tim kami perlu dilihat seberapa jauh alamat pengiriman. Bisa konfirmasi admin untuk lebih lanjut.</p>
            <p><b>P. Apakah bisa melakukan pengiriman luar kota?</b></p>
            <p>Bisa. Gunakan layanan pengiriman umum , JNE, JNT, SICEPAT, dll.</p>
            <p><b>Q.	Metode pembayaran apa saja yang tersedia?</b></p>
            <p>Kami hanya melayani via transfer BCA No. Rek 085-66-11111 a/n Sugianto soendjaja.</p>
          </div>
      </LayoutOne>
    </Fragment>
  );
};

Checkout.propTypes = {
  cartItems: PropTypes.array,
  currency: PropTypes.object,
  location: PropTypes.object,
  deleteAllFromCart: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    cartItems: state.cartData,
    currency: state.currencyData,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteAllFromCart: addToast => {
      dispatch(deleteAllFromCart(addToast));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
