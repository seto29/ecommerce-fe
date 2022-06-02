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
import {insert} from "../../services/Transaction"
import {updateGuestToUser} from "../../services/User"
import {GetDetailByUserID} from "../../services/Transaction"
import {
  deleteAllFromCart
} from "../../redux/actions/cartActions";
import NumberFormat from 'react-number-format';
import ls from 'local-storage'

const initProfile = ({name:"", email:"", phone:"", password:"" })

const Checkout = ({ location, cartItems, currency, deleteAllFromCart, history }) => {
  ////console.log(location)
  ////console.log(history)
  const { pathname } = location;
  let cartTotalPrice = 0;
  const [modalShow, setModalShow] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [profile, setProfile] = useState(initProfile);
  const [register, setRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  
  const { addToast } = useToasts();
  async function fetchAddress(){
    console.log("done1")
    await getAll().then((response)=>{
      //console.log(response)
      console.log("done")
      setAddresses(response.addresses)
    })
    console.log("done2")
  }
  async function handleBuy(total){
    ////console.log(total)
    if(register===true){
      await updateGuestToUser(profile.name, profile.phone, profile.email, profile.password).then((data)=>{
        if(data.status===200){
          ls.remove('token')
          ls.set('token',data.token)
          ls.set('user',data.token)
        }
        handleInsert(address.id, total, 1, cartData, location.state.discount)
      })
    }else{
      handleInsert(address.id, total, 1, cartData, location.state.discount)
    }


  }
  
  async function handleInsert(id, total, num, cartData, discount){
    await insert(id, total, num, cartData, discount).then((data)=>{
      deleteAllFromCart(
        // addToast
      )
      history.push({ pathname: process.env.PUBLIC_URL + "/payment",state: { data :data}})
    })
  }

  async function fetchAddress1(){
    await GetDetailByUserID().then((response)=>{
      
      setLoading(false)
      setAddress(response.transaction)
    })
  }
  
  useEffect(() => {
    setCartData(ls.get("redux_localstorage_simple").cartData)
    fetchAddress1()
  }, [])

  return (
    <>
    {console.log(loading)}
    {
      loading===false?

    <Fragment>
      <ChooseAddressModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product = {[]}
        addresses={addresses}
        setAddress={setAddress}
        fetchAddress={fetchAddress}
      />
      <MetaTags>
        <title>Hiji Official Store | Transaksi</title>
        <meta
          name="Desc"
          content="Halaman Transaksi Hiji Official Store"
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Beranda</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Transaksi
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {address && address.length >= 1 ? (
              <div className="row">

                <div className="col-xs-12">
                  <div className="your-order-area">
                    <h3>Transaksi Anda</h3>
                    <div className="your-order-wrap gray-bg-4" style={{width:'75vw'}}>
                      <div className="your-order-product-info">
                            {address.map((addrs, key) => {
                              return (
                                <Link to={{ pathname: process.env.PUBLIC_URL + "/payment",state: { data :addrs.id}}}>
                        <div className="your-order-middle" >
                          <ul>
                                <li key={key}>
                                  <span className="order-middle-left">
                                    {addrs.code} 
                                    <h4 style={addrs.status==="0"?{backgroundColor:'tomato', color:'white', borderRadius:'50px', padding:'10px'}:addrs.status==="1"?{backgroundColor:'blue', color:'white', borderRadius:'50px'}:addrs.status==="2"?{backgroundColor:'greenyellow', color:'white', borderRadius:'50px'}:addrs.status==="3" || addrs.status==="4"?{backgroundColor:'green', color:'white', borderRadius:'50px'}:{backgroundColor:'red', color:'white', borderRadius:'50px'}}>
                        {addrs.status==="0"?"Belum Dibayar":addrs.status==="1"?"Diproses":addrs.status==="2"?"Dikirim":addrs.status==="3"?"Diterima":addrs.status==="4"?"Selesai":addrs.status==="5"?"Dibatalkan Customer":"Dibatalakan Admin"}
                                    </h4>
                                  </span>{" "}
                                  <span className="order-price">
                                      <>{"Rp"} <NumberFormat displayType="text" thousandSeparator="." value={addrs.total || 0} decimalSeparator="," /></>
                                      <br/>
                                      <div hidden={addrs.point_payment==="0"?true:false}> <NumberFormat displayType="text" thousandSeparator="." value={addrs.point_payment || 0} suffix={" Poin"} decimalSeparator="," /></div>
                                  </span>
                                </li>
                          </ul>
                        </div>
                              </Link>
                              );
                            })}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cash"></i>
                    </div>
                    <div className="item-empty-area__text">
                      Anda Tidak Memiliki Transaksi <br />{" "}
                      {/* <Link to={process.env.PUBLIC_URL + "/shop"}>
                        Shop Now
                      </Link> */}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
    :<div className="flone-preloader-wrapper">
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
