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
import {GetDiscountBalances} from "../../services/Transaction"
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
    let saldo = 0
  
  const { addToast } = useToasts();
  async function fetchAddress(){
    await getAll().then((response)=>{
      //console.log(response)
      setAddresses(response.addresses)
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
    await GetDiscountBalances().then((response)=>{
      //console.log(response)
      setAddress(response.discountBalance.reverse())
      setLoading(false)
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
        Saldo Diskon
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        
        <button
              style={{width:'33.33%',
              border: '1px solid #24446c',
              backgroundColor: '#24446c',
              borderTopColor: '#24446c',
              borderLeftColor: '#24446c',
              color: '#e3ca09',
              height:'7vh',
              cursor: 'pointer'}}>
              <u>Saldo Diskon</u>
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
          <div className="container">
            {address && address.length >= 1 ? (
              <div >

                <div >
                  <div className="your-order-area">
                        <div>
                            <h3>
                                Saldo Diskon
                            </h3>
                        <div className="your-order-wrap gray-bg-4" >
                            <div className="your-order-product-info">
                            {address.map((addrs, key) => {
                                    if(addrs.type=='0'){
                                        saldo+=parseInt(addrs.amount)
                                    }else{
                                        saldo-=parseInt(addrs.amount)
                                    }
                                    // return(
                                    //     )
                                    })}
                                     <div className="your-order-middle" >
                                         <ul>
                                        <li >
                                                
                                        <span className="order-middle-left">

                                                <h4>{"Rp"}<NumberFormat displayType="text" thousandSeparator="." value={saldo || 0} decimalSeparator="," /></h4>
                                        </span>
                                        <Link to={{ pathname: process.env.PUBLIC_URL + "/shop"}}>  
                                        <span className="order-price" style={{backgroundColor:"blue", color:'white', padding:'10px', borderRadius:'15px'}}>
                                            Gunakan Sekarang</span></Link>
                                        </li>
                                </ul>
                                    </div>
                            </div>
                        </div>
                        </div>
                        <br/>
                    <h3>Riwayat Saldo</h3>
                    <div className="your-order-wrap gray-bg-4" >
                      <div className="your-order-product-info">
                            {address.map((addrs, key) => {
                              return (
                                // <Link to={{ pathname: process.env.PUBLIC_URL + "/payment",state: { data :addrs.id}}}>
                        <div className="your-order-middle" >
                          <ul>
                                <li key={key}>
                                  <span className="order-middle-left">
                                    <h4 >
                                    {
                                        addrs.description
                                    }
                                    <p style={addrs.type==='1'?{color:'red'}:{color:'greenyellow'}}>{addrs.type==='1'?"Digunakan":"Diterima"} {Intl.DateTimeFormat("id-ID", {
                                        year: "numeric",
                                        month: "long",
                                        day:"numeric"
                                    }).format(Date.parse(addrs.created_at))}</p>
                                    </h4>
                                  </span>{" "}
                                  <span className="order-price">
                                      <>{"Rp"}<NumberFormat displayType="text" thousandSeparator="." value={addrs.amount || 0} decimalSeparator="," /></>
                                  </span>
                                </li>
                          </ul>
                        </div>
                            //   </Link>
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
                      Anda Tidak Memiliki Saldo Diskon <br />{" "}
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
