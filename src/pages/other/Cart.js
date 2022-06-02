import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ls from 'local-storage'
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "../../redux/reducers/rootReducer";
import { save, load } from "redux-localstorage-simple";
import { composeWithDevTools } from "redux-devtools-extension";
import { useToasts } from "react-toast-notifications";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { connect } from "react-redux";
import { getDiscountPrice } from "../../helpers/product";
import {
  addToCart,
  decreaseQuantity,
  deleteFromCart,
  cartItemStock,
  deleteAllFromCart,
  fetchCarts1,
  fetchCarts
} from "../../redux/actions/cartActions";
import ChooseVouchersModal from "./ChooseVouchersModal"
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import NumberFormat from 'react-number-format';
import {getAll} from "../../services/Vouchers"
import {GetByID} from "../../services/User"
import {insert,minQty,Delete,DeleteByUserID, getAll1} from "../../services/Carts"

const store = createStore(
  rootReducer,
  load(),
  composeWithDevTools(applyMiddleware(thunk, save()))
);


const Cart = ({
  location,
  cartItems1,
  currency,
  decreaseQuantity,
  addToCart,
  deleteFromCart,
  deleteAllFromCart
}) => {
  const [quantityCount] = useState(1);
  const { addToast } = useToasts();
  const { pathname } = location;
  const [modalShow, setModalShow] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [user, setUser] = useState([]);
  const [discountB, setDiscountB] = useState(0);
  const [cartItems, setCartItems] = useState(cartItems1);
  const [voucher, setVoucher] = useState({discount:0, min_transaction:0, max_discount:0});
  const [loading, setLoading] = useState(true);
  let discount = 0
  let cartTotalPrice = 0;
  let cartTotalPointPrice = 0;
  let cartTotalPriceWD = 0;

  async function fetchVouchers(){
    const res = await getAll()
    if(typeof res!=="undefined"){
      setVouchers(res.vouchers)
    }
  }

  async function fetchUser(){
    const res = await GetByID()
    setDiscountB(res.detail.discount_balance)
  }
  async function reFetch(){
    await getAll1().then((data)=>{
      console.log(data)
      console.log(data.orders)
      setLoading(false)
      if(data.success===1){
        setCartItems(data.orders)
        console.log(data.orders)
      }
    })
  }
  
  useEffect(() => {
    fetchVouchers()
    fetchUser()
    reFetch()
  }, [cartItems1])

  async function handleAddToCart(product){
      await insert(product.product_id, 1,"",product.variants, product.unit_metric).then((data)=>{
        ////console.log(data.success)
      })
    // }
    // setQuantityCount(
    //   quantityCount < product.stock 
    //     ? quantityCount + 1
    //     : quantityCount
    // )
    addToCart(
      product,
      addToast,
      parseInt(product.qty)+1,
      product.unit_metric,
      product.variants
      )
      reFetch()
      ls.remove('redux_localstorage_simple')
      store.dispatch(fetchCarts());
  }

  async function handleDeleteOne(product){
    
    await Delete(product.product_id, 1,"",product.variants, product.unit_metric).then((data)=>{
      ////console.log(data.success)
    })
    reFetch()
    deleteFromCart(product, addToast)
    window.location.reload()
  }

  async function handleMinCart(product){
    if(parseInt(product.qty)===1){
      await Delete(product.product_id, 1,"", product.variants, product.unit_metric).then((data)=>{
        ////console.log(data.success)
        window.location.reload()
      })
    }else{
      await minQty(product.product_id, 1,"", product.variants, product.unit_metric).then((data)=>{
        ////console.log(data.success)
      })
    }
    
    reFetch()
    
    // setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)

    decreaseQuantity(
      product,
      addToast
    )
  }

  async function handleDeleteAll(){
      await DeleteByUserID(1, 1,"").then((data)=>{
        ////console.log(data.success)
        window.location.reload()
      })
    
    // setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)

    reFetch()
    deleteAllFromCart(
      addToast
    )
  }
  return (
    <>
    {
      loading===false?
    <Fragment>
      <MetaTags>
        <title>Hiji Official Store | Cart</title>
        <meta
          name="description"
          content="Cart page of flone ."
        />
      </MetaTags>
      <ChooseVouchersModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product = {[]}
        vouchers={vouchers}
        setVoucher={setVoucher}
        fetchVouchers={fetchVouchers}
      />

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Beranda</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Keranjang
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">Keranjang</h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Gambar</th>
                            <th>Nama</th>
                            <th>Harga</th>
                            <th>Jumlah</th>
                            {/* <th>Satuan</th> */}
                            <th>Subtotal</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((cartItem, key) => {
                            const discountedPrice = getDiscountPrice(
                              cartItem.price,
                              cartItem.discount
                            );
                            const finalProductPrice = (
                              cartItem.price * currency.currencyRate
                            ).toFixed(2);
                            const finalDiscountedPrice = (
                              discountedPrice * currency.currencyRate
                            ).toFixed(2);
                            
                            if(cartItem.redeemable && cartItem.redeemable==="1"){

                              (cartTotalPointPrice += finalProductPrice * cartItem.qty);
                            }else{
                              discountedPrice != null ? 
                                (cartTotalPrice += finalDiscountedPrice * cartItem.qty)
                                : 
                                (cartTotalPrice += finalProductPrice * cartItem.qty);
                                  
                              voucher.min_transaction>cartTotalPrice?
                                discount = 0: (discount = (cartTotalPrice*voucher.discount)/100)
  
                              voucher.max_discount<discount? discount = voucher.max_discount: discount=discount
  
                              cartItem.unit_metric!==0 ? 
                                cartItem.wholesale_discount==="1"?
                                  cartTotalPriceWD+=cartItem.price*cartItem.qty
                                  : 
                                  console.log("nope")
                                :
                                cartTotalPriceWD+=cartItem.price*cartItem.qty

                            }
                            
                            return (
                              <tr key={key}>
                                <td className="product-thumbnail">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      cartItem.slug
                                    }
                                  >
                                    <img
                                      className="img-fluid"
                                      src={typeof cartItem.images==='undefined'?cartItem.image:cartItem.images[0]}
                                      alt=""
                                    />
                                  </Link>
                                </td>

                                <td className="product-name">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      cartItem.slug
                                    }
                                  >
                                    <p style={{color:'blue',margin:'0px', padding:'0px'}} hidden={cartItem.preorder===null?true:false}>Pre Order {cartItem.preorder} Hari</p>
                                    {/* <br/> */}
                                    {cartItem.name}
                                  </Link>
                                  {
                                  // cartItem.selectedProductColor &&
                                  cartItem.variants && cartItem.variants[0]!=null ? 
                                    // console.log(cartItem.variants)
                                    <div className="cart-item-variation">
                                      <span>Varian: </span>
                                    {cartItem.variants.map((x, i)=>{
                                      return(
                                          <span>
                                            {x.name}
                                          </span>
                                        
                                        )
                                      })}
                                      </div>
                                   : (
                                    ""
                                  )}
                                </td>

                                <td className="product-price-cart">
                                  {
                                    cartItem.redeemable && cartItem.redeemable==="1"?
                                    <NumberFormat displayType="text" thousandSeparator="." value={parseInt(finalProductPrice) || 0} suffix=" Poin" decimalSeparator="," />
                                    :
                                    <>
                                    {discountedPrice !== null ? (
                                      <Fragment>
                                        <span className="amount old">
                                          {"Rp" +
                                            finalProductPrice}
                                        </span>
                                        <span className="amount">
                                          {"Rp" +
                                            finalDiscountedPrice}
                                        </span>
                                      </Fragment>
                                    ) : (
                                      <span className="amount">
                                        {"Rp"}<NumberFormat displayType="text" thousandSeparator="." value={parseInt(finalProductPrice) || 0} decimalSeparator="," />
                                      </span>
                                    )}
                                    </>
                                  }
                                </td>

                                <td className="product-quantity">
                                  <div className="cart-plus-minus">
                                    <button
                                      className="dec qtybutton"
                                      onClick={() =>
                                        handleMinCart(cartItem)
                                      }
                                    >
                                      -
                                    </button>
                                    <input
                                      className="cart-plus-minus-box"
                                      type="text"
                                      value={cartItem.qty}
                                      readOnly
                                    />
                                    <button
                                      className="inc qtybutton"
                                      onClick={() =>{
                                        handleAddToCart(cartItem)

                                      }
                                      }
                                      disabled={
                                        cartItem !== undefined &&
                                        cartItem.qty &&
                                        parseInt(cartItem.qty) >=
                                          parseInt(cartItemStock(
                                            cartItem,
                                            cartItem.selectedProductColor,
                                            cartItem.selectedProductSize
                                          ))
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                                {/* <td className="product-quantity">
                                  <div className="cart-plus-minus">
                                    {cartItem.unit_metric===0?"Pcs":cartItem.unit_metric===1?"Dus":cartItem.unit_metric===2?"Ball":"Pack"}
                                  </div>
                                </td> */}
                                <td className="product-subtotal">
                                  {
                                    cartItem.redeemable && cartItem.redeemable==="1"?
                                    <NumberFormat displayType="text" thousandSeparator="." value={finalProductPrice * cartItem.qty || 0} suffix=" Poin" decimalSeparator="," />
                                    :
                                    <>
                                    {discountedPrice !== null
                                      ? currency.currencySymbol +
                                        (
                                          finalDiscountedPrice * cartItem.qty
                                        ).toFixed(2)
                                      :
                                      <>
                                      {"Rp"}<NumberFormat displayType="text" thousandSeparator="." value={finalProductPrice * cartItem.qty || 0} decimalSeparator="," />
                                      </>
                                    }
                                    </>
                                  }
                                </td>

                                <td className="product-remove">
                                  <button
                                    onClick={() =>
                                      handleDeleteOne(cartItem, addToast)
                                    }
                                    title="Hapus Dari Keranjang"
                                  >
                                    <i style={{color:'red'}} className="fa fa-times"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link
                          to={process.env.PUBLIC_URL + "/shop"}
                        >
                          Lanjut Belanja
                        </Link>
                      </div>
                      <div className="cart-clear">
                        <button onClick={() => handleDeleteAll()}>
                          Hapus Keranjang
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  {/* <div className="col-lg-4 col-md-6">
                    <div className="cart-tax">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gray">
                          Estimate Shipping And Tax
                        </h4>
                      </div>
                      <div className="tax-wrapper">
                        <p>
                          Enter your destination to get a shipping estimate.
                        </p>
                        <div className="tax-select-wrapper">
                          <div className="tax-select">
                            <label>* Country</label>
                            <select className="email s-email s-wid">
                              <option>Bangladesh</option>
                              <option>Albania</option>
                              <option>Åland Islands</option>
                              <option>Afghanistan</option>
                              <option>Belgium</option>
                            </select>
                          </div>
                          <div className="tax-select">
                            <label>* Region / State</label>
                            <select className="email s-email s-wid">
                              <option>Bangladesh</option>
                              <option>Albania</option>
                              <option>Åland Islands</option>
                              <option>Afghanistan</option>
                              <option>Belgium</option>
                            </select>
                          </div>
                          <div className="tax-select">
                            <label>* Zip/Postal Code</label>
                            <input type="text" />
                          </div>
                          <button className="cart-btn-2" type="submit">
                            Get A Quote
                          </button>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="col-lg-6 col-md-12">
                    <div className="discount-code-wrapper">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gray">
                          Promo
                        </h4>
                      </div>
                      <div className="discount-code">
                        <p>Lebih hemat pakai promo.</p>

                              <input type="text" hidden={typeof voucher.code==="undefined"?true:false} disabled name="name" value={voucher.code}/>
                              <button className="cart-btn-2" onClick={()=>setModalShow(true)}>
                                {typeof voucher.code==="undefined"?"Pilih Promo":"Ganti Promo"}
                              </button>
                      </div>
                    </div>
                  </div> */}

                  <div className="col-sm-12">
                  {/* <div className="col-lg-6 col-md-12"> */}
                    <div className="grand-totall">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gary-cart">
                          Total
                        </h4>
                      </div>
                      <h5>
                        Total Harga{" "}
                        <span>
                          {"Rp"}<NumberFormat displayType="text" thousandSeparator="." value={cartTotalPrice || 0} decimalSeparator="," />
                        </span>
                      </h5>
                      <h5>
                        Diskon Pengguna{" "}
                        <span>
                          {"Rp"}<NumberFormat displayType="text" thousandSeparator="." value={Math.ceil(cartTotalPriceWD*5/100>parseInt(discountB)?parseInt(discountB):cartTotalPriceWD*5/100)} decimalSeparator="," />
                        </span>
                      </h5>
                      {/* <h5>
                        Diskon{" "}
                        <span>
                          {"Rp"+" " } <NumberFormat displayType="text" thousandSeparator="." value={discount} decimalSeparator="," />
                        </span>
                      </h5> */}

                      <h4 className="grand-totall-title">
                        Total Poin{" "}
                        <span>
                          <NumberFormat displayType="text" thousandSeparator="." value={cartTotalPointPrice || 0} suffix=" Poin" decimalSeparator="," />
                        </span>
                      </h4>
                      <h4 className="grand-totall-title">
                        Total{" "}
                        <span>
                          {"Rp"}<NumberFormat displayType="text" thousandSeparator="." value={cartTotalPrice-(Math.ceil(cartTotalPriceWD*5/100>parseInt(discountB)?parseInt(discountB):cartTotalPriceWD*5/100)) || 0} decimalSeparator="," />
                        </span>
                      </h4>
                      <Link to={{ pathname: process.env.PUBLIC_URL + "/checkout", state: { cartTotalPrice: cartTotalPrice, discount:discount, cartItems1:cartItems, cartTotalPointPrice:cartTotalPointPrice }}}>
                        Beli
                      </Link>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cart"></i>
                    </div>
                    <div className="item-empty-area__text">
                      Keranjang Kosong <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop"}>
                        Lanjut Belanja
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
    :
    <div className="flone-preloader-wrapper">
      <div className="flone-preloader">
        <span></span>
        <span></span>
      </div>
    </div>
    }
  </>
  );
};

Cart.propTypes = {
  addToCart: PropTypes.func,
  cartItems: PropTypes.array,
  currency: PropTypes.object,
  decreaseQuantity: PropTypes.func,
  location: PropTypes.object,
  deleteAllFromCart: PropTypes.func,
  deleteFromCart: PropTypes.func
};

const mapStateToProps = state => {
  return {
    cartItems: state.cartData,
    currency: state.currencyData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addToCart: (item, addToast, quantityCount) => {
      dispatch(addToCart(item, addToast, quantityCount));
    },
    decreaseQuantity: (item, addToast) => {
      dispatch(decreaseQuantity(item, addToast));
    },
    deleteFromCart: (item, addToast) => {
      dispatch(deleteFromCart(item, addToast));
    },
    deleteAllFromCart: addToast => {
      dispatch(deleteAllFromCart(addToast));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
