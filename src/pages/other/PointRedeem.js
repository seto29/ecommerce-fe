import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect, useLayoutEffect } from "react";
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
import {updateGuestToUser, GetByID} from "../../services/User"

import ProductGridSeven from "../../wrappers/product/ProductGridSeven";
import {GetPoint} from "../../services/Transaction"
import { getAllR } from "../../services/Products";
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
  const [products, setProducts] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [profile, setProfile] = useState(initProfile);
  const [register, setRegister] = useState(false);
  const [point, setPoint] = useState(0);
  const [data, setData] = useState({});
  const [width, setWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  
    let saldo = 0
  
  const { addToast } = useToasts();
  async function fetchAddress(){
    await getAll().then((response)=>{
      //console.log(response)
      setAddresses(response.addresses)
    })
  }

  async function getProducts(){
    await getAllR().then(({products, success})=>{
      if(success===1 || success==='1'){
        console.log(products)
        setProducts(products)
      }else{
        getProducts()
      }
      setLoading(false)
    })
  }

  async function getUser(){
    await GetByID().then((response)=>{
      console.log(response)
      if(response.success===1 || response.success==='1'){
        setData(response.detail)
      }else{
        getUser()
      }
    })
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
    await GetPoint().then((response)=>{
      if(response.success===1){
        console.log(response)
        setPoint(response.point)
      }
    })
  }
  
  useEffect(() => {
    // setCartData(ls.get("redux_localstorage_simple").cartData)
    fetchAddress1()
    getProducts()
    getUser()
  }, [])

  useEffect(() => {
    window.addEventListener("resize", updateWidthAndHeight);
    return () => window.removeEventListener("resize", updateWidthAndHeight);
  }, [])
  
  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth);
  };

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
    <>
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
        <title>Hiji Official Store | Saldo Diskon</title>
        <meta
          name="Desc"
          content="Halaman Saldo Diskon Hiji Official Store"
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Beranda</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Tukar Poin
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
            <button
              onClick={()=>history.push('/discount-balances')}
              style={{width:'33.33%',
              border: '1px solid #24446c',
              backgroundColor: '#24446c',
              borderTopColor: '#24446c',
              borderLeftColor: '#24446c',
              color: '#fff',
              height:'7vh',
              cursor: 'pointer'}}>
              Saldo Diskon
            </button>
            <button 
              style={{width:'33.33%',
              border: '1px solid #24446c',
              borderTopColor: '#24446c',
              backgroundColor: '#24446c',
              color: '#e3ca09',
              height:'7vh',
              cursor: 'pointer'}}>
              <u>Poin</u>
            </button>
            <button 
              onClick={()=>history.push('/member-card')}
            style={{width:'33.33%',
              border: '1px solid #24446c',
              borderTopColor: '#24446c',
              borderRightColor: '#24446c',
              backgroundColor: '#24446c',
              color: '#fff',
              height:'7vh',
              cursor: 'pointer'}}>
              Member Card
            </button>
        <Breadcrumb />
        <div >
          <br/>
          <div className="container">
              <div >

                <div >
                  <div className="your-order-area">
                        <div>
                            <h3>
                                Poin Saat Ini
                            </h3>
                            {address.map((addrs, key) => {
                              if(addrs.type=='0'){
                                saldo+=parseInt(addrs.amount)
                              }else{
                                saldo-=parseInt(addrs.amount)
                              }
                              // return(
                                //     )
                              })}
                              <h4><NumberFormat displayType="text" thousandSeparator="." value={point || 0} decimalSeparator="," suffix=" Poin"/></h4>
                            <h4 style={{color:'blue'}}>
                              Dapat kamu gunakan untuk ditukar menjadi produk berikut
                            </h4>
                        </div>
                        <br/>
                    <div className="your-order-wrap gray-bg-4">
                        <div className="row">
                            <ProductGridSeven
                            products={products}
                            type="new"
                            spaceBottomClass="mb-25"
                            />
                        </div>
                      
                    </div>
                    <br/>
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
