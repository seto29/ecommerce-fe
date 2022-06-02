import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import Swiper from "react-id-swiper";
import { getProductCartQuantity } from "../../helpers/product";
import { Modal } from "react-bootstrap";
import Rating from "./sub-components/ProductRating";
import { connect } from "react-redux";
import NumberFormat from 'react-number-format';
import {insert,minQty} from "../../services/Carts"

import { addToCart, decreaseQuantity } from "../../redux/actions/cartActions";
function ProductModal(props) {
  //console.log(props)
  const { product } = props;
  // const { currency } = props;
  const { discountedprice } = props;
  const { finalproductprice } = props;
  const { finaldiscountedprice } = props;

  const [gallerySwiper, getGallerySwiper] = useState(null);
  const [thumbnailSwiper, getThumbnailSwiper] = useState(null);
  const [selectedProductColor, setSelectedProductColor] = useState(
    product.variation ? product.variation[0].color : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variation ? product.variation[0].size[0].name : ""
  );
  const [productStock, setProductStock] = useState(
    product.variation ? product.variation[0].size[0].stock : product.stock
  );
  const [quantityCount, setQuantityCount] = useState(1);

  const wishlistItem = props.wishlistitem;
  // const compareItem = props.compareitem;
    let i =0;
  const addToCart = props.addtocart;
  const decreaseQuantity = props.decreaseQuantity;
  const addToWishlist = props.addtowishlist;
  const deleteFromWishlist = props.deleteFromWishlist;
  // const addToCompare = props.addtocompare;

  const addToast = props.addtoast;
  const cartItems = props.cartitems;

  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  useEffect(() => {
    setQuantityCount(parseInt(getProductCartQuantity(
      cartItems,
      product,
      selectedProductColor,
      selectedProductSize,
      )))
    }, [product])

  useEffect(() => {
    if (
      gallerySwiper !== null &&
      gallerySwiper.controller &&
      thumbnailSwiper !== null &&
      thumbnailSwiper.controller
    ) {
      gallerySwiper.controller.control = thumbnailSwiper;
      thumbnailSwiper.controller.control = gallerySwiper;
    }
  }, [gallerySwiper, thumbnailSwiper]);

  const gallerySwiperParams = {
    getSwiper: getGallerySwiper,
    spaceBetween: 10,
    loopedSlides: 4,
    loop: true,
  };

  const thumbnailSwiperParams = {
    getSwiper: getThumbnailSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    loopedSlides: 4,
    touchRatio: 0.2,
    freeMode: true,
    loop: true,
    slideToClickedSlide: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    renderPrevButton: () => (
      <button className="swiper-button-prev ht-swiper-button-nav">
        <i className="pe-7s-angle-left" />
      </button>
    ),
    renderNextButton: () => (
      <button className="swiper-button-next ht-swiper-button-nav">
        <i className="pe-7s-angle-right" />
      </button>
    )
  };

  async function handleAddToCart(){
    if(quantityCount < product.stock ){
      await insert(product.id, 1,"").then((data)=>{
      })
    }
    setQuantityCount(
      quantityCount < product.stock 
        ? quantityCount + 1
        : quantityCount
    )
    if(quantityCount < product.stock ){
      addToCart(
        product,
        addToast,
        quantityCount
      )
    }
  }

  async function handleMinCart(){
    await minQty(product.id, 1,"").then((data)=>{
    })
    
    setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)

    decreaseQuantity(
      product,
      addToast
    )
  }

  return (
    <Fragment>
      <Modal
        show={props.show}
        onHide={props.onHide}
        className="product-quickview-modal-wrapper"
      >
        <Modal.Header closeButton></Modal.Header>

        <div className="modal-body">
          <div className="row">
            <div className="col-md-5 col-sm-12 col-xs-12">
              <div className="product-large-image-wrapper">
                <Swiper {...gallerySwiperParams}>
                  {product.images &&
                    product.images.map((single, key) => {
                      return (
                        <div key={key}>
                          <div className="single-image">
                            <img
                              src={single}
                              className="img-fluid"
                              alt="as"
                            />
                          </div>
                        </div>
                      );
                    })}
                </Swiper>
              </div>
              <div className="product-small-image-wrapper mt-15">
              {props.product.images.length<3?
                <Swiper {...thumbnailSwiperParams}>
                  {
                  product.images &&
                    product.images.map((single, key) => {
                      return (
                        <div key={key}>
                          <div className="single-image">
                            <img
                              src={single}
                              className="img-fluid"
                              alt="thum"
                            />
                          </div>
                        </div>
                      );
                    })
                  }
                  {
                  product.images &&
                    product.images.map((single, key) => {
                      return (
                        <div key={key}>
                          <div className="single-image">
                            <img
                              src={single}
                              className="img-fluid"
                              alt="thum"
                            />
                          </div>
                        </div>
                      );
                    })
                  }
                </Swiper>
                :
                <Swiper {...thumbnailSwiperParams}>
                  {
                  product.images &&
                    product.images.map((single, key) => {
                      return (
                        <div key={key}>
                          <div className="single-image">
                            <img
                              src={single}
                              className="img-fluid"
                              alt="thum"
                            />
                          </div>
                        </div>
                      );
                    })
                  }
                </Swiper>
                }
              </div>
            </div>
            <div className="col-md-7 col-sm-12 col-xs-12">
              <div className="product-details-content quickview-content">
                <h2>{product.name}</h2>
                <div className="product-details-price">
                  {discountedprice !== null ? (
                    <Fragment>
                      <span>
                        {"Rp" + finaldiscountedprice}
                      </span>{" "}
                      <span className="old">
                        {"Rp" + finalproductprice}
                      </span>
                    </Fragment>
                  ) : (
                    <span>{"Rp"} <NumberFormat displayType="text" thousandSeparator="." value={finalproductprice || 0} decimalSeparator="," /></span>
                  )}
                </div>
                {parseInt(product.rating) && parseInt(product.rating) > 0 ? (
                  <div className="pro-details-rating-wrap">
                    <div className="pro-details-rating">
                      <Rating ratingValue={parseInt(product.rating)} />
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="pro-details-list" style={{whiteSpace:'pre-wrap'}}>
                  {product.description}
                </div>

                {product.variation ? (
                  <div className="pro-details-size-color">
                    <div className="pro-details-color-wrap">
                      <span>Color</span>
                      <div className="pro-details-color-content">
                        {product.variation.map((single, key) => {
                          return (
                            <label
                              className={`pro-details-color-content--single ${single.color}`}
                              key={key}
                            >
                              <input
                                type="radio"
                                value={single.color}
                                name="product-color"
                                checked={
                                  single.color === selectedProductColor
                                    ? "checked"
                                    : ""
                                }
                                onChange={() => {
                                  setSelectedProductColor(single.color);
                                  setSelectedProductSize(single.size[0].name);
                                  setProductStock(single.size[0].stock);
                                  setQuantityCount(1);
                                }}
                              />
                              <span className="checkmark"></span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    <div className="pro-details-size">
                      <span>Size</span>
                      <div className="pro-details-size-content">
                        {product.variation &&
                          product.variation.map(single => {
                            return single.color === selectedProductColor
                              ? single.size.map((singleSize, key) => {
                                  return (
                                    <label
                                      className={`pro-details-size-content--single`}
                                      key={key}
                                    >
                                      <input
                                        type="radio"
                                        value={singleSize.name}
                                        checked={
                                          singleSize.name ===
                                          selectedProductSize
                                            ? "checked"
                                            : ""
                                        }
                                        onChange={() => {
                                          setSelectedProductSize(
                                            singleSize.name
                                          );
                                          setProductStock(singleSize.stock);
                                          setQuantityCount(1);
                                        }}
                                      />
                                      <span className="size-name">
                                        {singleSize.name}
                                      </span>
                                    </label>
                                  );
                                })
                              : "";
                          })}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {product.affiliateLink ? (
                  <div className="pro-details-quality">
                    <div className="pro-details-cart btn-hover">
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
                        onClick={() =>
                          handleMinCart()
                        }
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
                        onClick={() =>
                          handleAddToCart()
                        }
                        className="inc qtybutton"
                      >
                        +
                      </button>
                    </div>
                    <div className="pro-details-cart btn-hover">
                      {productStock && productStock > 0 ? (
                        <button
                          onClick={() =>
                            handleAddToCart()
                          }
                          disabled={productCartQty >= productStock}
                        >
                          {" "}
                          Add To Cart{" "}
                        </button>
                      ) : (
                        <button disabled>Out of Stock</button>
                      )}
                    </div>
                    <div className="pro-details-wishlist">
                      <button
                        className={wishlistItem !== undefined ? "active" : ""}
                        style={wishlistItem !== undefined?{borderRadius:'50%', backgroundColor:'#fed700'}:{borderRadius:'50%'}}
                        title={
                          wishlistItem !== undefined
                            ? "Hapus dari Wishlist"
                            : "Tambahkan ke Wishlist"
                        }
                        onClick={() => wishlistItem !== undefined? deleteFromWishlist(product, addToast):addToWishlist(product, addToast)}
                      >
                        <i className="pe-7s-like" />
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
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}

ProductModal.propTypes = {
  addtoast: PropTypes.func,
  addtocart: PropTypes.func,
  addtocompare: PropTypes.func,
  addtowishlist: PropTypes.func,
  cartitems: PropTypes.array,
  compareitem: PropTypes.object,
  currency: PropTypes.object,
  discountedprice: PropTypes.number,
  finaldiscountedprice: PropTypes.number,
  finalproductprice: PropTypes.number,
  onHide: PropTypes.func,
  product: PropTypes.object,
  show: PropTypes.bool,
  wishlistitem: PropTypes.object
};

const mapStateToProps = state => {
  return {
    cartitems: state.cartData
  };
};

export default connect(mapStateToProps)(ProductModal);
