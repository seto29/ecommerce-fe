import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import ls from 'local-storage'
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getProductCartQuantity } from "../../helpers/product";
import { addToCart, decreaseQuantity } from "../../redux/actions/cartActions";
import { addToWishlist, deleteFromWishlist } from "../../redux/actions/wishlistActions";
import { addToCompare } from "../../redux/actions/compareActions";
import Rating from "./sub-components/ProductRating";
import NumberFormat from 'react-number-format';
import {insert,minQty,getAll1} from "../../services/Carts"
import rootReducer from "../../redux/reducers/rootReducer";
import { save, load } from "redux-localstorage-simple";
import { composeWithDevTools } from "redux-devtools-extension";
import { fetchProducts } from "../../redux/actions/productActions";
import { fetchCarts } from "../../redux/actions/cartActions";
import {
  CInputRadio,
  CFormGroup,
  CLabel,
  CCol
} from '@coreui/react'
import { parse } from "uuid";

const store = createStore(
  rootReducer,
  load(),
  composeWithDevTools(applyMiddleware(thunk, save()))
);

// fetch products from json file

const ProductDescriptionInfo = ({
  product,
  discountedPrice,
  currency,
  finalDiscountedPrice,
  finalProductPrice,
  cartItems1,
  wishlistItem,
  compareItem,
  addToCart,
  addToWishlist,
  addToCompare, 
  decreaseQuantity,
  deleteFromWishlist
}) => {
  
  const { addToast } = useToasts();
  const [selectedProductColor, setSelectedProductColor] = useState(
    product.variation ? product.variation[0].color : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState([]);
  const [selectedProductSize1, setSelectedProductSize1] = useState([]);
  const [cartItems, setCartItems] = useState(cartItems1);
  const [unit_metric, setUnit_metric] = useState(0);
  const [price, setPrice] = useState(product.price);
  const [productStock, setProductStock] = useState(product.stock);
  let disabled = 0
  const [quantityCount, setQuantityCount] = useState(1);

  async function handleAddToCart(){
    if(quantityCount < productStock ){
      await insert(product.id, 1,"", selectedProductSize, unit_metric).then((data)=>{
      })
    }
    
      setQuantityCount(
      quantityCount < productStock 
      ? quantityCount + 1
      : quantityCount
    )

    addToCart(
      product,
      addToast,
      quantityCount,
      unit_metric,
      selectedProductSize
    )
    reFetch()
    ls.remove('redux_localstorage_simple')
    store.dispatch(fetchProducts());
    store.dispatch(fetchCarts());
  }
  async function handleAddToCartPO(){
      await insert(product.id, 1,"", selectedProductSize, unit_metric).then((data)=>{
      })
    
    
      setQuantityCount(quantityCount + 1)

    addToCart(
      product,
      addToast,
      quantityCount,
      unit_metric,
      selectedProductSize
    )
    reFetch()
    ls.remove('redux_localstorage_simple')
    store.dispatch(fetchProducts());
    store.dispatch(fetchCarts());
  }

  async function reFetch(){
    await getAll1().then((data)=>{
      if(data.success===1){
        setCartItems(data.orders)
      }
    })
  }

  async function handleMinCart(){
    await minQty(product.id, 1,"", selectedProductSize, unit_metric).then((data)=>{
    })
      
    setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)

    decreaseQuantity(
      product,
      addToast
    )
  }

  const handleChangeStock=(e)=>{
    let stock = 999999999999
    selectedProductSize.forEach(element => {
      if(e===0){
        if(stock>element.stock){
          stock=element.stock
        }
      }else if(e===1){
        if(stock>element.box_stock){
          stock=element.box_stock
        }
      }else{
        if(stock>element.ball_stock){
          stock=element.ball_stock
        }
      }
    });
    setQuantityCount(parseInt(getProductCartQuantity(
      cartItems,
      product,
      e,
      selectedProductSize1)))
    setProductStock(stock)
    reFetch()

  }

  const handleChangeStockVariant=(list)=>{
    
    let stock = 999999999999
    list.forEach(element => {
      if(unit_metric===0){
        if(stock>element.stock){
          stock=element.stock
        }
      }else if(unit_metric===1){
        if(stock>element.box_stock){
          stock=element.box_stock
        }
      }else if(unit_metric===2){
        if(stock>element.ball_stock){
          stock=element.ball_stock
        }
      }else{
        if(stock>element.pack_stock){
          stock=element.pack_stock
        }
      }
    });
    setQuantityCount(parseInt(getProductCartQuantity(
      cartItems,
      product,
      unit_metric,
      selectedProductSize1)))

    setProductStock(stock)
    reFetch()

  }

  const handleInputChange = (e, index, name, stock,  box_stock,  ball_stock, pack_stock) => {
    const { value } = e.target;
    const list = [...selectedProductSize];
    const list1 = [...selectedProductSize1];
    list1[index]["id"] = value;
    list1[index]["name"] = name;
    list[index]["id"] = value;
    list[index]["name"] = name;
    list[index]["stock"] = stock;
    list[index]["box_stock"] = box_stock;
    list[index]["ball_stock"] = ball_stock;
    list[index]["pack_stock"] = pack_stock;
    handleChangeStockVariant(list)
    setSelectedProductSize(list);
    setQuantityCount(parseInt(getProductCartQuantity(
      cartItems,
      product,
      unit_metric,
      list1,
    )));
  };
  let i =0

  useEffect(() => {
    reFetch()
    setProductStock(product.stock)
    const list = [...selectedProductSize];
    const list1 = [...selectedProductSize];
    product.variant_groups && product.variant_groups.forEach((element,key )=> {
      setProductStock(element.variants[0].stock)
      list[key] = {id:element.variants[0].id, name:element.variants[0].name, stock:element.variants[0].stock, box_stock:element.variants[0].box_stock, ball_stock:element.variants[0].ball_stock, pack_stock:element.variants[0].pack_stock};
      list1[key] = {id:element.variants[0].id, name:element.variants[0].name};
    });
    setSelectedProductSize(list);
    setSelectedProductSize1(list1);
    setPrice(product.price)
    setQuantityCount(parseInt(getProductCartQuantity(
      cartItems,
      product,
      unit_metric,
      list1,
    )))
    
    if(product.is_wholesale==='1'){
      product.product_wholesales && product.product_wholesales.map((x, i)=>{
        parseInt(getProductCartQuantity(
          cartItems,
          product,
          unit_metric,
          list1,
        ))>=parseInt(x.minimum_qty)?setPrice(x.price):setPrice(product.price)
      })
    }

  }, [product])

  return (
    <div className="product-details-content ml-70">
      <h2>{product.name}</h2>
      <div className="product-details-price">
        {
          product.redeemable && product.redeemable==="0"?
            <span>{"Rp"}<NumberFormat displayType="text" thousandSeparator="." value={price} decimalSeparator="," /></span>
            :
            <span><NumberFormat displayType="text" thousandSeparator="." value={price} decimalSeparator="," suffix=' Poin'/></span>
        }
        
      </div>
      {product.rating && product.rating > 0 ? (
        <div className="pro-details-rating-wrap">
          <div className="pro-details-rating">
            <Rating ratingValue={parseInt(product.rating)} />
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="pro-details-list">
        {
          product.preorder===null?
          <p>Stok Tersedia: {productStock}</p>
          :
          <p>Pre Order ({product.preorder} Hari)</p>
        }
        <br/>
        <p>{product.shortDescription}</p>
        {
          product.is_wholesale==='1'?
          <>
          <hr/>
          <h4>Harga Grosir</h4>
          <br/>
          </>
          :
          <>
          </>
        }
        {
          product.is_wholesale==='1'?
          product.product_wholesales && product.product_wholesales.map((x, i)=>{
            return(
              <div key={i} style={{paddingLeft:'5%'}}>
              <p>
               <NumberFormat value={x.price} displayType="text" prefix="Rp" thousandSeparator={"."} decimalSeparator={","}/>
              </p>
              {/* <br/> */}
              <p style={{color:"lightgray"}}>
                Setiap pembelian lebih dari {x.minimum_qty}
              </p>
              </div>
            )
          })
          :
          <>
          </>
        }
      </div>
      {product.variant_groups && selectedProductSize.length!==0? (
        
        <div>
          {product.variant_groups.map((single, key) => {
            
            if(selectedProductSize[key].id===0){
              disabled=1
            }
            return (
              <div key={key} className="row">
                <h4>{single.name}</h4>
                  {single.variants.map((single1, key1) => {
                    return (
                      <CCol xs="12" key={key1}>
                      <CCol xs="5">
                      </CCol>
                      <CCol xs="7">
                        <CFormGroup variant="custom-radio" inline >
                          <CInputRadio custom id={"isRecipeThirdInsert"+single1.id} name={"id"+key} value={single1.id} onChange={(e) => {
                              handleInputChange(e, key, single1.name, single1.stock, single1.box_stock, single1.ball_stock, single1.pack_stock)
                                // if(unit_metric===0){
                                //   setProductStock(parseInt(single1.stock))
                                // }else if(unit_metric===1){
                                //   setProductStock(parseInt(single1.box_stock))
                                // }else{
                                //   setProductStock(parseInt(single1.ball_stock))
                                // }
                              }}
                              checked={
                                single1.id === selectedProductSize[key].id
                                  ? true
                                  : false
                              }/>
                          <CLabel variant="custom-checkbox" htmlFor={"isRecipeThirdInsert"+single1.id}>{single1.name}</CLabel>
                        </CFormGroup>
                      </CCol>
                      </CCol>
                    );
                  })}
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
      {product.affiliateLink ? (
        <div className="pro-details-quality">
          <div className="pro-details-cart btn-hover ml-0">
            <a
              href={product.affiliateLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              Buy Now
            </a>
          </div>
        </div>
      ) : (
        <div className="pro-details-quality">
          <div className="cart-plus-minus">
            <button
              onClick={() =>{

                handleMinCart()
                
                if(product.is_wholesale==='1'){
                  product.product_wholesales && product.product_wholesales.map((x, i)=>{
                    quantityCount-1>=parseInt(x.minimum_qty)?setPrice(x.price):setPrice(product.price)
                  })
                }
              }
              }
              disabled={quantityCount==1 || quantityCount==0?true:false}
              className="dec qtybutton"
            >
              -
            </button>
            <input
              className="cart-plus-minus-box"
              type="text"
              value={quantityCount}
              readOnly
            />
            <button
              onClick={(e) =>{

                {product.preorder===null?handleAddToCart():handleAddToCartPO()}
                if(product.is_wholesale==='1'){
                    product.product_wholesales && product.product_wholesales.map((x, i)=>{
                      quantityCount+1>=parseInt(x.minimum_qty)?setPrice(x.price):setPrice(product.price)
                    })
                  }
                
              }
              }
              disabled={quantityCount >= productStock && product.preorder===null?true:false}
              className="inc qtybutton"
            >
              +
            </button>
          </div>
          <div className="pro-details-cart btn-hover" >
            {
              (product.category_id==="6" && product.redeemable==='0' && product.sample==='1') || product.sample==='1'?
              // <Link to={process.env.PUBLIC_URL + "/custom-order"}>
                <Link to={{ pathname: process.env.PUBLIC_URL + "/custom-order",state: { data :product.name}}}>
                        Pesan Sekarang
                      </Link>
              :
              product.preorder===null?
                disabled===0?
                productStock && productStock > 0 ? (
                  <>
                <button
                  onClick={() =>{

                    handleAddToCart()
                    if(product.is_wholesale==='1'){
                      product.product_wholesales && product.product_wholesales.map((x, i)=>{
                        quantityCount+1>=parseInt(x.minimum_qty)?setPrice(x.price):setPrice(product.price)
                      })
                    }
                  }
                  }
                  disabled={quantityCount >= productStock ?true:false}
                >
                  {quantityCount >= productStock?
                  " Stok Maksimal":" + Keranjang  "}
                </button>
                </>
              ) : (
                <button disabled>Stok Habis</button>
              )
              :
              <button disabled>Varian Wajib Dipilih</button>
            :
            <button
                  onClick={() =>{

                    handleAddToCartPO()
                    if(product.is_wholesale==='1'){
                      product.product_wholesales && product.product_wholesales.map((x, i)=>{
                        quantityCount+1>=parseInt(x.minimum_qty)?setPrice(x.price):setPrice(product.price)
                      })
                    }
                  }
                  }
                >
                  Pre Order 
                </button>

          }
          </div>
          {
            product.preorder===null?
            ""
            :
            
            <div className="pro-details-cart btn-hover">
            
            <button
                  onClick={() =>{

                    handleAddToCartPO()
                    if(product.is_wholesale==='1'){
                      product.product_wholesales && product.product_wholesales.map((x, i)=>{
                        quantityCount+1>=parseInt(x.minimum_qty)?setPrice(x.price):setPrice(product.price)
                      })
                    }
                  }
                  }
                >
                  + Keranjang
                </button>
                </div>
          }
          <div className="pro-details-wishlist">
            <button
              style={wishlistItem !== undefined?{borderRadius:'50%', backgroundColor:'#fed700'}:{borderRadius:'50%'}}
              className={wishlistItem !== undefined ? "active" : ""}
              // disabled={wishlistItem !== undefined}
              title={
                wishlistItem !== undefined
                  ? "Hapus Dari Wishlist"
                  : "Tambahkan ke Wishlist"
              }
              onClick={() => wishlistItem !== undefined? deleteFromWishlist(product, addToast):addToWishlist(product, addToast)}
            >
              <i className="fa fa-heart-o" />
            </button>
          </div>
          {/* <div className="pro-details-compare">
            <button
              className={compareItem !== undefined ? "active" : ""}
              disabled={compareItem !== undefined}
              title={
                compareItem !== undefined
                  ? "Added to compare"
                  : "Add to compare"
              }
              onClick={() => addToCompare(product, addToast)}
            >
              <i className="pe-7s-shuffle" />
            </button>
          </div> */}
        </div>
      )}
      {product.category ? (
        <div className="pro-details-meta">
          <span>Categories :</span>
          <ul>
            {product.category.map((single, key) => {
              return (
                <li key={key}>
                  <Link to={process.env.PUBLIC_URL + "/shop"}>
                    {single}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        ""
      )}
      {product.tag ? (
        <div className="pro-details-meta">
          <span>Tags :</span>
          <ul>
            {product.tag.map((single, key) => {
              return (
                <li key={key}>
                  <Link to={process.env.PUBLIC_URL + "/shop"}>
                    {single}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

ProductDescriptionInfo.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  addToast: PropTypes.func,
  cartItems1: PropTypes.array,
  compareItem: PropTypes.array,
  currency: PropTypes.object,
  discountedPrice: PropTypes.number,
  finalDiscountedPrice: PropTypes.number,
  finalProductPrice: PropTypes.number,
  product: PropTypes.object,
  wishlistItem: PropTypes.object,
  decreaseQuantity: PropTypes.func,
  deleteFromWishlist: PropTypes.func,
};

const mapDispatchToProps = dispatch => {
  return {
    addToCart: (
      item,
      addToast,
      quantityCount,
      selectedProductColor,
      selectedProductSize
    ) => {
      dispatch(
        addToCart(
          item,
          addToast,
          quantityCount,
          selectedProductColor,
          selectedProductSize
        )
      );
    },
    addToWishlist: (item, addToast) => {
      dispatch(addToWishlist(item, addToast));
    },
    addToCompare: (item, addToast) => {
      dispatch(addToCompare(item, addToast));
    },
    decreaseQuantity: (
      item,
      addToast
    ) => {
      dispatch(
        decreaseQuantity(
          item,
          addToast
        )
      );
    },
    
    deleteFromWishlist: (item, addToast) => {
      dispatch(deleteFromWishlist(item, addToast));
    },
  };
};

export default connect(null, mapDispatchToProps)(ProductDescriptionInfo);
