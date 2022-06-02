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
        Member Card
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
              cursor: 'pointer',
              height:'7vh'
              }}>
              Saldo Diskon
            </button>
            <button 
              onClick={()=>history.push('/point-redeem')}
              style={{width:'33.33%',
              border: '1px solid #24446c',
              borderTopColor: '#24446c',
              backgroundColor: '#24446c',
              color: '#fff',
              height:'7vh',
              cursor: 'pointer'}}>
              Poin
            </button>
            <button 
            style={{width:'33.33%',
            border: '1px solid #24446c',
            borderTopColor: '#24446c',
            borderRightColor: '#24446c',
            backgroundColor: '#24446c',
            color: '#e3ca09',
            height:'7vh',
              cursor: 'pointer'}}>
                  <u>Member Card</u>
              
            </button>
        <Breadcrumb />
        <div >
          <br/>
          <div className="container">
              <div >

                <div >
                  {
                    width && width<850?
                    <>
                  <center>

                    <div style={{width:'60vw', height:'35vw', backgroundImage: "url('http://cdn.hijiofficial.com/home-web/card%20a.png')", backgroundRepeat:"no-repeat", backgroundSize:"cover", backgroundPosition:"center", padding:'10%'}}>
                      <div style={{width:'100%',textAlign:'right', padding:'2%', marginBottom:'10%'}}>
                        {/* <img width='25%' src='https://cdn.hijiofficial.com/logo/logo-text.png'/> */}

                      </div>
                      <div style={{width:'100%', textAlign:'left', padding:'2%'}}>
                        <p style={{color:"#fff", fontSize:'4vw'}}>{data.code?data.code:''}</p>
                        {/* <p style={{color:"#fff", fontSize:'4vw'}}>000000001</p> */}
                      </div>
                      <div style={{width:'100%', textAlign:'left', padding:'2%'}}>
                        <p style={{color:"#fff", fontSize:'3vw'}}>{data.name?data.name:''}</p>
                        {/* <p style={{color:"#fff", fontSize:'3vw'}}>Pratama Wijaya Batara Batoarung</p> */}
                      </div>
                    </div>
                    
                  </center>
                    </>
                    :
                  <center>

                    <div style={{width:'32vw', height:'19vw',backgroundImage: "url('http://cdn.hijiofficial.com/home-web/card%20a.png')", backgroundRepeat:"no-repeat", backgroundSize:"cover", backgroundPosition:"center", padding:'5%'}}>
                        {/* <img width='18%' src='https://cdn.hijiofficial.com/logo/logo-text.png'/> */}
                      <div style={{width:'100%', textAlign:'left', padding:'2%', marginTop:'7vh'}}>
                        <p style={{color:"#fff", fontSize:'2vw'}}>{data.code?data.code:''}</p>
                      </div>
                      <div style={{width:'100%', textAlign:'left', padding:'2%'}}>
                        <p style={{color:"#fff", fontSize:'2vw'}}>{data.name?data.name:''}</p>
                      </div>
                    </div>
                    
                  </center>
                  }
                  <div className="your-order-area">
                  <div >
                    <div align="center">
                        <h3>Syarat dan Ketentuan Member Card</h3>
                    </div>
                    <p>Member card adalah program loyalty untuk pengguna yang setia belanja kepada kami. Berbelanja dengan nyaman, aman dan mendapatkan reward adalah komitmen kami untuk memberikan pelayanan terbaik bagi setiap pelanggan setia kami.</p>
                    <b>Keuntungan menjadi Member Hiji Official Store : </b>
                    <p>1. Mendapatkan point disetiap pembelanjaan dan bisa ditukarkan hadiah menarik.</p>
                    <p>2. Meraih kesempatan untuk mendapatkan promo dan hadiah yang sewaktu-waktu diadakan. </p>
                    <p>3. Diskon/promo khusus dibeberapa tempat yang bekerjasama dengan kami.</p>
                    <p>4. Update info mengenai event dan promo yang berlangsung. </p>
                    <b>Syarat & Ketentuan : </b>
                    <p>1. Member card adalah kartu anggota Hiji Official Store & tidak dapat dipindahtangankan ke pihak lain.</p>
                    <p>2. kartu ini bersifat permanen dan dapat diperoleh dengan menjadi member Hiji Official Store </p>
                    <p>3. kartu ini hanya berlaku di Hiji Official Store. </p>
                    <p>4. Kartu ini tidak dapat diuangkan & hanya dapat digunakan oleh orang yang namanya tercantum dikartu ini. </p>
                    <p>5. Kartu ini berfungsi sebagai kartu keanggotaan, bukan sebagai kartu kredit atau sejenisnya. </p>
                    <p>6. Pemegang kartu ini terikat oleh syarat & ketentuan dari perjanjian keanggotaan dari Hiji Official Store.</p>
                    <p>7. Kartu ini milik Hiji Official Store. Beranda Belanjaan Keranjang</p>
                    <br/>
                </div>
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
