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
import {getAll, updateDefault} from "../../services/Addresses"
import {GetDetailByID1} from "../../services/Products"
import {insert} from "../../services/Transaction"
import {updateGuestToUser} from "../../services/User"

import {GetPoint} from "../../services/Transaction"
import Select from 'react-select';
import {
  deleteAllFromCart
} from "../../redux/actions/cartActions";
import {siCepatTarif, kurirHiji} from "../../services/Deliveries"
import NumberFormat from 'react-number-format';
import ls from 'local-storage'
import {GetByID} from "../../services/User"

const initProfile = ({name:"", email:"", phone:"", password:"" })

const Checkout = ({ location, currency, deleteAllFromCart, history }) => {
  const { pathname } = location;
  let cartTotalPrice = 0;
  // console.log(location.state.cartItems1)
  const [cartItems, setCartItems] = useState(location.state.cartItems1)
  const [modalShow, setModalShow] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [profile, setProfile] = useState(initProfile);
  const [register, setRegister] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [delivery, setDelivery] = useState();
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [weight, setWeight] = useState(0);
  const [discountB, setDiscountB] = useState(0);
  const [disB, setDisB]=useState(false)
  const [point, setPoint] = useState(0);
  let w1=0;
  let cartTotalPriceWD = 0;
  let cartTotalPointPrice = 0;

  async function fetchUser(){
    const res = await GetByID()
    setDiscountB(res.detail.discount_balance)
    if(res.detail.email===""){
      setRegister(true)
    }
  }
  useEffect(()=>{
    setWeight(w1)
    // console.log(w1)
  })

  async function fetchPoint(){
    await GetPoint().then((response)=>{
      if(response.success===1){
        // console.log(response)
        setPoint(parseInt(response.point))
      }
    })
  }

  async function fetchAddress(){
    await getAll().then((response)=>{
      setAddresses(response.addresses)
      // console.log(response.addresses)
    })
  }
  async function handleBuy(total){
    
    setDisB(true)
    if(register===true){
      await updateGuestToUser(profile.name, profile.phone, profile.email, profile.password).then((data)=>{
        if(data.status===200){
          ls.remove('token')
          ls.set('token',data.token)
          ls.set('user',data.token)
        }
        {
          location.state === undefined?
          handleInsert(address.id, total, 1, cartData, 0, deliveryFee)
          :
          handleInsert(address.id, total, 1, cartData, location.state.discount, deliveryFee)
        }
      })
    }else{
      {
        location.state === undefined?
        handleInsert(address.id, total, 1, cartData, 0, deliveryFee)
        :
        handleInsert(address.id, total, 1, cartData, location.state.discount, deliveryFee)
      }
    }


  }
  
  async function handleInsert(id, total, num, cartData, discount, deliveryFee){
    await insert(id, total, num, cartData, discount,deliveryFee, delivery.value, Math.ceil(cartTotalPriceWD*5/100>parseInt(discountB)?parseInt(discountB):cartTotalPriceWD*5/100), cartTotalPointPrice).then((data)=>{
      deleteAllFromCart(
        // addToast
      )
        setDisB(false)
      history.push({ pathname: process.env.PUBLIC_URL + "/payment",state: { data :data}})
    })
  }

  async function fetchAddress1(){
    await getAll().then((response)=>{
      setAddresses(response.addresses)
      setAddress(response.addresses[0])
      if(response.success===1){
        handleChangeDistrict(response.addresses[0].v_name, w1)
      }
    })
  }

  async function updateDefaultAd(id){
    await updateDefault(id).then((response)=>{
      fetchAddress()
    })
  }
  
  async function fetchDetailByID(id){
    let w = 0;
    await GetDetailByID1(id).then((response)=>{
      if(response.success===1){
       if(response.product[0].weight_metric_id==='1'){
         w = (response.product[0].weight/1000)
        }else{
         w = response.product[0].weight
       }
      }
    })
    return parseFloat(w)
  }
  
  // async function fetchWeight(product_id){
  //     await fetchDetailByID(product_id).then((w)=>{
  //       w1 += w
  //     })
  //     setWeight(Math.ceil(w1))
  //     return Math.ceil(w1)
  // }

  async function fetcherWeight(){
      handleChangeDistrict(address.v_name, w1)
  }

  async function handleChangeDistrict(e, w){
      handleTarif(e, w)
}

const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");
  async function handleTarif(destination_code, w){
    setDeliveries([])
    let list = []
    let i =0
      const res3 = await kurirHiji()
      if(res3.status===200){
        res3.delivery_method.map(value=>{
          let a = addCommas(removeNonNumeric(value.price)) 
          list[i] = {
            id: value.id, value: value.id, label: value.name+" - Rp"+ a,
            target: { type: 'select', name: 'delivery', value: value.id, label: value.name+" - Rp"+ a, service:value.id, description:value.name, minPrice:parseInt(value.price), tariff:parseInt(value.price), unitPrice:parseInt(value.price) }
          }
          i++;
          return i;
        })
      }
      const res2 = await siCepatTarif(destination_code, w)
      if(res2.status===200){
        res2.results.siCepat.map(value=>{
          let a = addCommas(removeNonNumeric(value.tariff)) 
          list[i] = {
            id: value.service, value: value.service, label: "SiCepat "+value.description+ " ("+value.etd+") - Rp"+ a,
            target: { type: 'select', name: 'delivery', value: value.service, label: "SiCepat"+value.description+ "("+value.etd+") - Rp"+a, service:value.service, description:value.description, etd:value.etd, minPrice:value.minPrice, tariff:value.tariff, unitPrice:value.unitPrice, provider:"SiCepat" }
          }
          i++;
          return i;
        })
        res2.results.anteraja.map(value=>{
          let a = addCommas(removeNonNumeric(value.rates)) 
          list[i] = {
            id: "AAja "+value.product_code, value: "AAja "+value.product_code, label: "Anteraja "+value.product_name+ " ("+value.etd.replace("Day", "Hari")+") - Rp"+ a,
            target: { type: 'select', name: 'delivery', value: "AAja "+value.product_code, label: "Anteraja"+value.product_name+ "("+value.etd+") - Rp"+a, product_code:value.product_code, product_name:value.product_name, etd:value.etd, tariff:value.rates, provider:"Anteraja" }
          }
          i++;
          return i;
        })
        setDeliveries(list)
      }
}

  useEffect(() => {
    fetchPoint()
    fetchUser()
    fetcherWeight()
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
  const handleChangeD = ({ target }) => {
    setDelivery(target)
    setDeliveryFee(target.tariff)
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
        fetchAddress1={fetchAddress1}
        setDeliveries={setDeliveries}
        setDelivery={setDelivery}
        fetcherWeight={fetcherWeight}
        weight={weight}
        updateDefaultAd={updateDefaultAd}
      />
      <MetaTags>
        <title>Hiji Official Store | Checkout</title>
        <meta
          name="Hiji Official Store Checkout Page"
          content="Halaman Checkout Hiji Offcial Store"
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Beranda</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Checkout
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <div className="row">
                <div className="col-lg-12">
                  <div className="billing-info-wrap">
                    <h3>Alamat Pengiriman</h3>
                    <div className="row">
                      
                      <div className="col-lg-12 col-md-12">
                        <div className="your-order-area">
                          <div className="billing-info mb-20">
                            {/* <label>Alamat</label> */}
                            {
                              address?
                              <>
                              <p>{address.recipient_name +" ("+address.name+") "}</p>
                              <p>{address.recipient_phone}</p>
                              <p>{address.address} ({address.detail})</p>
                              <p>{address.d_name+", "+address.c_name+", "+address.p_name +" ("+address.postal_code+")"}</p>
                              </>
                              :
                              <>
                              <p>Silahkan Daftarkan Alamat Pengiriman</p>
                              </>
                            }
                            <div className="place-order mt-25">
                              <button className="btn-hover" onClick={()=>{
                                setModalShow(true)}}>{address?"Ganti Alamat":"Daftarkan Alamat"}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {
                        ls.get('user')?
                        ""
                        :
                        <div className="place-order mt-20 col-lg-12">
                          {/* <input  type="checkbox" checked={register} onChange={()=>setRegister(!register)}/> */}
                          <label className="ml-10">Daftar Akun</label>
                          <div className="login-form-container">
                              <div className="login-register-form ml-20 mr-20">
                                <form>
                                  <label>Nama</label>
                                  <input
                                    type="text"
                                    name="name"
                                    placeholder="Kevin"
                                    value={profile.name}
                                    onChange={(e)=>handleUserInput(e)}
                                    />
                                  <label>No. Telepon</label>
                                  <input
                                    type="text"
                                    name="phone"
                                    placeholder="08123456789"
                                    value={profile.phone}
                                    onChange={(e)=>handleUserInput(e)}
                                    />
                                  <label>Email</label>
                                  <input
                                    name="email"
                                    placeholder="name@email.com"
                                    type="email"
                                    value={profile.email}
                                    onChange={(e)=>handleUserInput(e)}
                                    />
                                  <label>Password</label>
                                  <input
                                    type="password"
                                    name="password"
                                    placeholder=""
                                    value={profile.password}
                                    onChange={(e)=>handleUserInput(e)}
                                    />
                                </form>
                              </div>
                            </div>
                        </div>
                      }

                      {/* <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>First Name</label>
                          <input type="text" />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Last Name</label>
                          <input type="text" />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Company Name</label>
                          <input type="text" />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-select mb-20">
                          <label>Country</label>
                          <select>
                            <option>Select a country</option>
                            <option>Azerbaijan</option>
                            <option>Bahamas</option>
                            <option>Bahrain</option>
                            <option>Bangladesh</option>
                            <option>Barbados</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Street Address</label>
                          <input
                            className="billing-address"
                            placeholder="House number and street name"
                            type="text"
                          />
                          <input
                            placeholder="Apartment, suite, unit etc."
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Town / City</label>
                          <input type="text" />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>State / County</label>
                          <input type="text" />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Postcode / ZIP</label>
                          <input type="text" />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Phone</label>
                          <input type="text" />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Email Address</label>
                          <input type="text" />
                        </div>
                      </div> */}
                    </div>

                    {/* <div className="additional-info-wrap">
                      <h4>Additional information</h4>
                      <div className="additional-info">
                        <label>Order notes</label>
                        <textarea
                          placeholder="Notes about your order, e.g. special notes for delivery. "
                          name="message"
                          defaultValue={""}
                        />
                      </div>
                    </div> */}
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="your-order-area">
                    <h3>Pesanan</h3>
                    <div className="your-order-wrap gray-bg-4">
                      <div className="your-order-product-info">
                        <div className="your-order-top">
                          <ul>
                            <li>Produk</li>
                            <li>Total</li>
                          </ul>
                        </div>
                        <div className="your-order-middle">
                          <ul>
                            {cartItems.map((cartItem, key) => {
                              if(cartItem.weight_metric_id==="1"){
                                w1 += parseInt(cartItem.weight*cartItem.qty)/1000
                              }else{
                                w1 += parseInt(cartItem.weight*cartItem.qty)
                              }
                              const discountedPrice = getDiscountPrice(
                                cartItem.price,
                                cartItem.discount
                              );
                              const finalProductPrice = (
                                cartItem.price * currency.currencyRate
                              ).toFixed(0);
                              const finalDiscountedPrice = (
                                discountedPrice * currency.currencyRate
                              ).toFixed(0);
                              if(cartItem.redeemable && cartItem.redeemable==="1"){
                                (cartTotalPointPrice +=
                                  finalProductPrice * cartItem.qty);
                              }else{

                                discountedPrice != null
                                  ? (cartTotalPrice +=
                                      finalDiscountedPrice * cartItem.qty)
                                  : (cartTotalPrice +=
                                      finalProductPrice * cartItem.qty);

                                      cartItem.unit_metric!==0 ? 
                                cartItem.wholesale_discount==="1"?
                                  cartTotalPriceWD+=cartItem.price*cartItem.qty
                                  : 
                                  console.log("nope")
                                :
                                cartTotalPriceWD+=cartItem.price*cartItem.qty
                                  }
                              return (
                                <li key={key}>
                                  <span className="order-middle-left">
                                  <p style={{color:'blue', margin:'0px', padding:'0px'}} hidden={cartItem.preorder===null?true:false}>Pre Order {cartItem.preorder} Hari</p>
                                    {cartItem.name} X {cartItem.qty} - ({cartItem.weight*cartItem.qty} {cartItem.weight_metric_id==="1"?"g":"kg"})
                                    <br/>
                                    Varian: <br/>{
                                            cartItem.variants && cartItem.variants.map((x,j)=>{
                                                return(
                                                  <>
                                                        <b style={{marginLeft:'10px'}}>{x!==null?x.name:""}<br/></b> 
                                                  </>
                                                )
                                            })
                                            }
                                  </span>{" "}
                                  <span className="order-price">
                                    {
                                      cartItem.redeemable && cartItem.redeemable==="1"?
                                      <NumberFormat displayType="text" thousandSeparator="." value={parseInt(finalProductPrice * cartItem.qty) || 0} suffix=" Poin" decimalSeparator="," />
                                      :
                                      <>
                                      {discountedPrice !== null
                                        ? currency.currencySymbol + 
                                          (
                                            finalDiscountedPrice *
                                            cartItem.qty
                                          ).toFixed(0)
                                        : <>{"Rp"}<NumberFormat displayType="text" thousandSeparator="." value={parseInt(finalProductPrice * cartItem.qty) || 0} decimalSeparator="," /></>
                                        }
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
                            <li className="your-order-shipping">Diskon Pengguna</li>
                              <li>{"Rp"}<NumberFormat displayType="text" thousandSeparator="." value={Math.ceil(cartTotalPriceWD*5/100>parseInt(discountB)?parseInt(discountB):cartTotalPriceWD*5/100)} decimalSeparator="," /></li>
                          </ul>
                        </div>
                        {/* <div className="your-order-bottom">
                          <ul>
                            <li className="your-order-shipping">Diskon</li>
                            {
                              location.state === undefined?
                              <li>{"Rp"} <NumberFormat displayType="text" thousandSeparator="." value={0} decimalSeparator="," /></li>
                              :
                              <li>{"Rp"} <NumberFormat displayType="text" thousandSeparator="." value={location.state.discount || 0} decimalSeparator="," /></li>
                            }
                          </ul>
                        </div> */}
                          <br/>
                        <div className="your-order-bottom">
                          <ul>
                            <li className="your-order-shipping">Pengiriman</li>
                            {/* <li>Rp10.000</li> */}
                          </ul>
                              <Select 
                                options={deliveries}
                                onChange={(e)=> handleChangeD(e)}
                                value={delivery}
                                placeholder="Pilih Pengiriman"
                              />
                        </div>
                        <div className="your-order-total">
                          {
                            cartTotalPointPrice===0?
                            ''
                            :
                          <ul>
                            <li className="order-total">Total Poin</li>
                            <li>
                              
                                <><NumberFormat displayType="text" thousandSeparator="." value={cartTotalPointPrice || 0} decimalSeparator="," suffix=" Poin" /></>
                              
                            </li>
                          </ul>
                          }
                          <ul>
                            <li className="order-total">Total</li>
                            <li>
                              
                                <>{"Rp"}<NumberFormat displayType="text" thousandSeparator="." value={parseInt(cartTotalPrice+deliveryFee-Math.ceil(cartTotalPriceWD*5/100>parseInt(discountB)?parseInt(discountB):cartTotalPriceWD*5/100)) || 0} decimalSeparator="," /></>
                              
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="payment-method">
                            <h4>Transfer Bank BCA</h4>
                      </div>
                    </div>
                    <div className="place-order mt-25">
                      {
                        disB===true?
                        <button style={{backgroundColor:'lightgray'}} disabled={true} >{'Sedang Diproses'}</button>
                        :
                          cartTotalPointPrice>point?
                          <button style={{backgroundColor:'#e02500'}} disabled={true} >{'Poin Anda Tidak Mencukupi'}</button>
                          :
                            !address?
                            <button style={{backgroundColor:'#e02500'}} disabled={true} >{'Anda Belum Mengisi Alamat'}</button>
                            :
                            ls.get('user')?
                            typeof delivery==="undefined" || delivery.label===""?
                              <button style={{backgroundColor:'#e02500'}} disabled={true} >{'Anda Belum Pilih Pengiriman'}</button>
                              :
                              location.state === undefined?
                                    <button className="btn-hover" disabled={false} onClick={()=>handleBuy(cartTotalPrice)}>{register===true?"Beli":"Beli"}</button>
                                    :
                                    <button className="btn-hover" disabled={false} onClick={()=>handleBuy(cartTotalPrice)}>{register===true?"Beli":"Beli"}</button>
                          
                            :
                            profile.name==="" && register===true ||profile.phone==="" && register===true ||profile.email==="" && register===true||profile.password==="" && register===true?
                            <button style={{backgroundColor:'#e02500'}} disabled={true} >Data Register Belum Lengkap</button>
                            :
                            typeof delivery==="undefined" || delivery.label===""?
                              <button style={{backgroundColor:'#e02500'}} disabled={true} >{'Anda Belum Pilih Pengiriman'}</button>
                              :
                              location.state === undefined?
                              <button className="btn-hover" disabled={false} onClick={()=>handleBuy(cartTotalPrice)}>{register===true?"Beli":"Beli"}</button>
                              :
                              <button className="btn-hover" disabled={false} onClick={()=>handleBuy(cartTotalPrice)}>{register===true?"Beli":"Beli"}</button>
                      }
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
                      No items found in cart to checkout <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop"}>
                        Shop Now
                      </Link>
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
