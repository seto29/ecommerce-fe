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
import {Tracking} from "../../services/Transaction"
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

  
  const { addToast } = useToasts();
  async function fetchAddress(){
    await getAll().then((response)=>{
      //console.log(response)
      setAddresses(response.addresses)
    })
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
    await Tracking(typeof location.state.data.iid!=="undefined"?location.state.data.iid:location.state.data).then((response)=>{
      setAddress(response.sicepat.result.track_history.reverse())
    })
  }
  
  
  useEffect(() => {
    setCartData(ls.get("redux_localstorage_simple").cartData)
    fetchAddress1()
  }, [])

  const handleUserInput = ({ target }) => {
    let name = target.name;
    let value = "";
    if(target.name === "phone"){
        if(isNaN(target.value)===false){
            value = target.value;
        }else{
            value = target.value.slice(0, -1) 
        }
    }else{
        value = target.value;
    }
    setProfile(prevState => ({ ...prevState, [ name ]: value }));
}

  return (
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
          name="Hiji Official Store Checkout Page"
          content="Halaman Tracking Hiji Official Store"
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
                                  <>
                        <div className="your-order-middle" >
                          <ul>
                                <li key={key}>
                                  <span className="order-middle-left">
                                    {addrs.date_time} 
                                  </span>{" "}
                                  <span className="order-price">
                                      {addrs.city?addrs.city:addrs.receiver_name}
                                  </span>
                                </li>
                          </ul>
                        </div>
                        </>
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
