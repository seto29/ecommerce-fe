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
        <title>Hiji Official Store | Terms And Condition</title>
        <meta
          name="Hiji Official Store"
          content="Terms And Condition Hiji Official Store."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Beranda</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Terms And Condition
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
          <div style={{margin:"25px", paddingRight:"5%", paddingLeft:"5%"}}>
              <div align="center">
                <h3>Terms and Condition</h3>
              </div>
            <p>Berikut adalah syarat dan ketentuan penggunaan aplikasi Hiji. Anda telah setuju untuk mematuhi semua syarat dan ketentuan ini.</p>
            <p>A. Mengenai Hiji</p>
            <p>Aplikasi Hiji adalah Online Shop yang bergerak dibidang retail. Jika anda sudah masuk dan bisa melihat fitur fitur aplikasi Hiji, berarti admin telah melakukan approval atas registrasi anda.</p>
            <p>B. Pemesanan Porduk</p>
            <p>Anda bisa berbelanja kebutuhan apapun di Menu Product dan pilih barang yang dibutuhkan, disarankan untuk melihat secara detail item dan deskripsi produk agar tidak terjadi kesalahan. Pastikan juga alamat pengiriman serta penerima sudah benar. Karena membeli artinya setuju dan Pihak Hiji tidak terima Retur. </p>
            <p>C. Harga dan Pembayaran</p>
            <p>Pihak Hiji memastikan bahwa deskripsi dan harga yang tertera adalah akurat, namun jika ada kesalahan yang mungkin terjadi dalam harga produk yang dipesan, maka Pihak Hiji berhak untuk membatalkan pesanan tersebut kemudian mengkonfirmasi kepada yang bersangkutan. </p>
            <p>Harga yang tertera belum termasuk biaya kirim. Disarankan untuk memilih ekspedisi yang disediakan untuk pengiriman luar kota, dan Pihak Hiji menyediakan pengiriman dalam kota radius ..... Meter dengan tarif Rp10.000 Flat Jarak dekat & Jauh dengan menambahkan item Special Delivery pada saat memesan barang. </p>
            <p>Pembayaran dilakukan setelah anda melakukan check out dan melanjutkan ke langkah pay now. Pembayaran baru bisa dilakukan dengan cara transfer manual di rekening pembeli, setelah melakukan pembayaran dimohon untuk melampirkan bukti pembayaran yang dilakukan di kolom take photo atau Choose Photo. Setelah itu pihak admin akan melakukan cek ulang 1×24 jam, jika sudah benar barang akan langsung dikirim kan dan akan menginformasikan nomor pemesanan. Jika pembayaran belum di lakukan dalam waktu 1×24 jam, admin akan membatalkan pesanan pembeli. </p>
            <p>D. Pembatalan Pembelian</p>
            <p>Pihak Hiji berhak membatalkan pesanan saat status pesanan masih dalam proses verifikasi pembayaran. Apabila pembayaran telah terverifikasi dan status pesanan sudah dalam proses produksi maka pembeli tidak dapat melakukan pembatalan.</p>
            <p>Pihak Hiji dapat membatalkan pesanan konsumen jika terdapat indikasi yang merugikan pihak Hiji maupun kejanggalan lainnya. </p>
            <p>E. Merk dan Logo</p>
            <p>Merk dan Logo Hiji Official Store sudah milik paten kami. Penyalahgunaan Merk dan Logo berarti menyalahi syarat dan ketentuan ini.</p>
            <p>F. Perubahan Syarat dan Ketentuan</p>
            <p>Kami berhak melakukan perubahan pada aplikasi ini sewaktu-waktu tanpa pemberitahuan terlebih dahulu demi kemajuan Hiji Official Store.</p>
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
