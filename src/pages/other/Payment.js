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
  let cartTotalPointPrice = 0;
  const [modalShow, setModalShow] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [details, setDetails] = useState([]);
  const [trx, setTrx] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [files, setFiles] = useState([])
  const [showFP, setShowFP] = useState(false)
  const [loading, setLoading] = useState(true);

  
  const { addToast } = useToasts();
  async function fetchAddress(){
    await getAll().then((response)=>{
      setAddresses(response.addresses)
    })
  }
  
  async function fetchAddress1(){
    await GetDetailByID(typeof location.state.data.iid!=="undefined"?location.state.data.iid:location.state.data).then((response)=>{
      ////console.log(response.details)
      //console.log(response.tr[0])
      setDetails(response.details)
      setTrx(response.tr[0])
      setLoading(false)
    })
  }
  
  useEffect(() => {
    setCartData(ls.get("redux_localstorage_simple").cartData)
    fetchAddress1()
  }, [])

  async function handleUpdatePP(pp){
        await updatePP(pp, typeof location.state.data.iid!=="undefined"?location.state.data.iid:location.state.data).then(({success}) =>{
          if(success===1){
            window.location.reload()
          }
                })
}

  async function handleUpdateStatus(){
        await updateStatus(4, typeof location.state.data.iid!=="undefined"?location.state.data.iid:location.state.data).then(({success}) =>{
          if(success===1){
            window.location.reload()
          }
                })
}

  async function handleInsert(){
        await fUpload(files[0].file, '../../../cdn/payment-proofs/').then(({status, url}) =>{
        
                    if(status===200){
                        setFiles([])
                        handleUpdatePP(url)
                    }
                })
}

  return (
    
    <>
      {
          loading===false?
    <Fragment>
      <ChooseAddressModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product = {[]}
        addresses={addresses}
        setDetails={setDetails}
        fetchAddress={fetchAddress}
      />
      <MetaTags>
        <title>Hiji Official Store | Transaksi Detail</title>
        <meta
          name="Hiji Official Store"
          content="Transaksi Detail Hiji Official Store."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Beranda</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Pembayaran
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />

                <div className="col-lg-12" style={{marginTop:'10px', padding:'10px', marginBottom:'10vh'}}>
                  <div className="your-order-area">
                    <h3>Pesanan</h3>
                    <div className="your-order-wrap gray-bg-4">
                      <center>
                      <h4 style={trx.status==="0"?{backgroundColor:'tomato', color:'white', borderRadius:'50px'}:trx.status==="1"?{backgroundColor:'blue', color:'white', borderRadius:'50px'}:trx.status==="2"?{backgroundColor:'greenyellow', color:'white', borderRadius:'50px'}:trx.status==="3" || trx.status==="4"?{backgroundColor:'green', color:'white', borderRadius:'50px'}:{backgroundColor:'red', color:'white', borderRadius:'50px'}}>
                        {trx.status==="0"?"Belum Dibayar":trx.status==="1"?"Diproses":trx.status==="2"?"Dikirim":trx.status==="3"?"Diterima":trx.status==="4"?"Selesai":trx.status==="5"?"Dibatalkan Customer":"Dibatalakan Admin"}
                      </h4>
                      

                      </center>
                      <div className="your-order-product-info">
                        <div className="your-order-top">
                          <ul>
                            <li>Kode</li>
                            <li style={{width:'50vw', textAlign:'right'}}>{trx.code}</li>
                          </ul>
                        </div>
                        <hr/>
                        <div className="your-order-top">
                          <ul>
                            <li>Tujuan</li>
                            <li style={{width:'50vw', textAlign:'right'}}>Dikirm ke {trx.a_name}, {trx.address}, {trx.d_name}, {trx.c_name}, {trx.recipient_name} ({trx.recipient_phone})</li>
                          </ul>
                        </div>
                        <hr/>
                        <div className="your-order-top">
                          <ul>
                            <li>Produk</li>
                            <li>Total</li>
                          </ul>
                        </div>
                        <div className="your-order-middle">
                          <ul>
                            {details && details.map((detail, key) => {
                              console.log(details)
                              const discountedPrice = getDiscountPrice(
                                detail.price,
                                detail.discount
                              );
                              const finalProductPrice = (
                                detail.price * currency.currencyRate
                              ).toFixed(0);
                              const finalDiscountedPrice = (
                                discountedPrice * currency.currencyRate
                              ).toFixed(0);
                              cartTotalPointPrice+=parseInt(detail.point_price)*parseInt(detail.qty)
                              discountedPrice != null
                                ? (cartTotalPrice +=
                                    finalDiscountedPrice * detail.qty)
                                : (cartTotalPrice +=
                                    finalProductPrice * detail.qty);
                              return (
                                <li key={key}>
                                  <span className="order-middle-left">
                                    {detail.name} X {detail.qty} <br/>
                                    Varian: <br/>{
                                            detail.variants && detail.variants.map((x,j)=>{
                                                return(
                                                        <b id={j} style={{marginLeft:'10px'}}>{x!==null?x.name:""}<br/></b> 
                                                )
                                            })
                                            }
                                  </span>{" "}
                                  <span className="order-price">
                                    {
                                      detail.point_price==="0"?
                                      <>
                                      {discountedPrice !== null
                                        ? currency.currencySymbol + 
                                          (
                                            finalDiscountedPrice *
                                            detail.qty
                                          ).toFixed(0)
                                        : <>{"Rp"}<NumberFormat displayType="text" thousandSeparator="." value={parseInt(finalProductPrice * detail.qty) || 0} decimalSeparator="," /></>
                                        }
                                      </>
                                      :
                                      <>
                                      <NumberFormat displayType="text" thousandSeparator="." value={parseInt(detail.point_price * detail.qty) || 0} decimalSeparator="," suffix=" Poin" />
                                      </>
                                    }
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="your-order-bottom">
                          <ul>
                            <li className="your-order-shipping">Pengiriman ({trx.delivery_id.includes("AAja")? trx.delivery_id.replace("AAja", "Anter Aja") :trx.delivery_id==="REG"?"SICEPAT Regular":trx.delivery_id==="BEST"?"SICEPAT Besok Sampai Tujuan":trx.delivery_id==="GOKIL"?"SICEPAT Cargo Kilat":trx.delivery_id==="SDS"?"SiCepat Same Day Service":trx.delivery_id==="SIUNT"?"SICEPAT SiUntung":"Kurir Hiji"})</li>
                            <li>{"Rp"}<NumberFormat displayType="text" thousandSeparator="." value={parseInt(trx.delivery_fee) || 0} decimalSeparator="," /></li>
                          </ul>
                        </div>
                        
                        <div className="your-order-bottom" hidden={trx.awb===" " || trx.awb===""?true:false}>
                          <ul>
                            <li className="your-order-shipping">Nomor Resi </li>
                            <li>{trx.awb}</li>
                          </ul>
                        </div>
                        <div className="your-order-bottom">
                          <ul>
                            <li className="your-order-shipping">Diskon</li>
                            <li>{"Rp"}<NumberFormat displayType="text" thousandSeparator="." value={parseInt(trx.discount) || 0} decimalSeparator="," /></li>
                          </ul>
                        </div>
                        <div className="your-order-total">
                          {
                            cartTotalPointPrice==="0"?
                            ""
                            :
                            <ul>
                              <li className="order-total">Total Poin</li>
                              <li>
                                <><NumberFormat displayType="text" thousandSeparator="." value={cartTotalPointPrice || 0} suffix=" Poin" decimalSeparator="," /></>
                              </li>
                            </ul>
                          }
                          <ul>
                            <li className="order-total">Total</li>
                            <li>
                              <>{"Rp"}<NumberFormat displayType="text" thousandSeparator="." value={parseInt(cartTotalPrice)+parseInt(trx.delivery_fee)-parseInt(trx.discount) || 0} decimalSeparator="," /></>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {
                        isNaN(trx.delivery_id) && trx.status==="2"?
                          <div align="center">
                            <div align="center" className="place-order mt-25" style={{width:'70vw'}}>
                              
                            <Link to={{ pathname: process.env.PUBLIC_URL + "/tracking",state: { data : trx.awb}}}>Lacak</Link>
                            </div>
                          </div>
                          :
                          ""
                      }
                      {
                        trx.status==="3"?
                          <div align="center">
                            <div align="center" className="place-order mt-25" style={{width:'70vw'}}>
                              
                              <button  className="btn-hover" onClick={(e)=>handleUpdateStatus()}>
                                Selesai
                              </button>
                            </div>
                          </div>
                          :
                          ""
                      }
                      {
                        trx.status==="0"?
                        trx.payment_proof===""?
                        showFP===false?
                        <>
                        <div align="center">

                          <div className="payment-method" textAlign="justify">
                                <h4>Transfer Bank BCA</h4>
                          </div>
                        </div>
                        <div align="center">
                        <div align="center" style={{width:'70vw'}}>
                        <div className="payment-method">
                              <p >Silahkan Transfer Ke:</p>
                        </div>
                        <div className="payment-method">
                              <p>Nomor Rekening : 0856611111</p>
                        </div>
                        <div className="payment-method">
                              <p>Nama Rekening : Sugianto Soendjaja</p>
                        </div>
                        <div className="payment-method">
                              <p>Berita : {trx.code}</p>
                        </div>
                        <div className="payment-method" style={{backgroundColor:'orange'}}>
                              <p>PENTING, mohon isi berita transfer dengan {trx.code} untuk mempermudah verifikasi</p>
                        </div>
                        </div>
                        </div>
                        <div align="center">
                          <div align="center" className="place-order mt-25" style={{width:'70vw'}}>
                            
                            <button  className="btn-hover" onClick={(e)=>setShowFP(true)}>
                              Upload Bukti Transfer
                            </button>
                          </div>
                        </div>
                        </>
                        :
                        <>
                        <div align="center">
                          <div align="center" className="place-order mt-25" style={{width:'70vw'}}>
                        <FilePond
                            instantUpload={false}
                            files={files}
                            onupdatefiles={setFiles}
                            allowMultiple={true}
                            maxFiles={1}
                            // server="/api"
                            name="files"
                            labelIdle='Drag & Drop gambar atau <span class="filepond--label-action">Browse</span>'
                        />
                          <label>Format gambar .jpg .jpeg .png .webp</label>
                          <br/>
                            {
                              files.length>0?
                                <button  className="btn-hover" onClick={(e)=>handleInsert()}>
                                  Upload
                                </button>
                              :
                                <button  style={{backgroundColor:'#e0e0e0'}} disabled>
                                  Upload
                                </button>
                            }
                                <br/>
                            <button style={{backgroundColor:'#e02500'}} onClick={(e)=>setShowFP(false)}  >{'Batalkan Upload'}</button>
                          </div>
                        </div>
                        </>
                        :
                        <>
                        <div align="center">
                          Bukti Transfer
                        </div>
                        <div align="center">
                        <img src={trx.payment_proof} style={{width:"25vw"}}/>
                        </div>
                        </>
                        :""

                      }
                          <div align="center">
                            <div align="center" className="place-order mt-25" style={{width:'70vw'}}>
                            <a href="https://api.whatsapp.com/send?phone=6282320907970" target="_blank" style={{textDecoration:'none'}}>
                              {/* <button  className="btn-hover"> */}
                                Tanya Toko
                              {/* </button> */}
                            </a>
                            </div>
                          </div>
                    </div>
                  </div>
            
        </div>
      </LayoutOne>
    </Fragment>:<div className="flone-preloader-wrapper">
      <div className="flone-preloader">
      <span></span>
      <span></span>
      </div>
  </div>
      }
  </>
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
