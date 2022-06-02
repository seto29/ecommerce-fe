import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { getDiscountPrice } from "../../helpers/product";
import {insert} from "../../services/Carts"
import ProductModal from "./ProductModal"
import NumberFormat from 'react-number-format';

function ProductGridSingleSeven({
  product,
  currency,
  addToCart,
  addToWishlist,
  addToCompare,
  cartItem,
  wishlistItem,
  compareItem,
  sliderClassName,
  spaceBottomClass,
  colorClass,
  deleteFromWishlist,
  decreaseQuantity
}){
  const [modalShow, setModalShow] = useState(false);
  const { addToast } = useToasts();
  const discountedPrice = getDiscountPrice(product.price, product.discount);
  const finalProductPrice = +product.price;
  const finalDiscountedPrice = +(
    discountedPrice 
  );
  
  async function handleAddToCart(product, addToast){
    await insert(product.id, 1,"").then((data)=>{
    })
    addToCart(product, addToast)
  }
  return (
    <Fragment>
      <div
        className={`col-xl-3 col-md-6 col-lg-4 col-sm-6 col-6 ${
          sliderClassName ? sliderClassName : ""
        }`}
      >
        <div
          className={`product-wrap-7 ${
            spaceBottomClass ? spaceBottomClass : ""
          } ${colorClass ? colorClass : ""} `}
        >
          <div className="product-img">
            <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
              <img
                className="default-img"
                src={process.env.PUBLIC_URL + product.images[0]}
                alt=""
              />
              {product.image.length > 1 ? (
                <img
                  className="hover-img"
                  src={process.env.PUBLIC_URL + product.images[1]}
                  alt=""
                />
              ) : (
                ""
              )}
            </Link>
            {product.discount || product.new ? (
              <div className="product-img-badges">
                {product.discount ? (
                  <span className="pink">-{product.discount}%</span>
                ) : (
                  ""
                )}
                {product.new ? <span className="purple">New</span> : ""}
              </div>
            ) : (
              ""
            )}

            <div className="product-action-2">
              {/* {product.affiliateLink ? (
                <a
                  href={product.affiliateLink}
                  rel="noopener noreferrer"
                  target="_blank"
                  title="Buy now"
                >
                  {" "}
                  <i className="fa fa-shopping-cart"></i>{" "}
                </a>
              ) : product.variation && product.variation.length >= 1 ? (
                <Link
                  to={`${process.env.PUBLIC_URL}/product/${product.slug}`}
                  title="Select options"
                >
                  <i className="fa fa-cog"></i>
                </Link>
              ) : product.stock && product.stock > 0 ? (
                <button
                  onClick={() => handleAddToCart(product, addToast)}
                  className={
                    cartItem !== undefined && cartItem.qty > 0
                      ? "active"
                      : ""
                  }
                  disabled={cartItem !== undefined && cartItem.qty > 0}
                  title={
                    cartItem !== undefined ? "Added to cart" : "Add to cart"
                  }
                >
                  <i className="fa fa-shopping-cart"></i>
                </button>
              ) : (
                <button disabled className="active" title="Out of stock">
                  <i className="fa fa-shopping-cart"></i>
                </button>
              )} */}

              {/* <button onClick={() => setModalShow(true)} title="Quick View">
                <i className="fa fa-eye"></i>
              </button> */}

              {/* <button
                className={compareItem !== undefined ? "active" : ""}
                disabled={compareItem !== undefined}
                title={
                  compareItem !== undefined
                    ? "Added to compare"
                    : "Add to compare"
                }
                onClick={() => addToCompare(product, addToast)}
              >
                <i className="fa fa-retweet"></i>
              </button> */}
            </div>
            <div className="pro-wishlist-2">
              <button
                className={wishlistItem !== undefined ? "active" : ""}
                // disabled={wishlistItem !== undefined}
                title={
                  wishlistItem !== undefined
                    ? "Hapus dari Wishlist"
                    : "Tambahkan ke Wishlist"
                }
                onClick={() => wishlistItem !== undefined?deleteFromWishlist(product, addToast):addToWishlist(product, addToast)}
              >
                <i className="fa fa-heart-o" />
              </button>
            </div>
          </div>
          <div className="product-content-2">
            <div className="title-price-wrap-2">
              <h3>
                <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
                  {product.name}
                </Link>
              </h3>
              <div className="price-2">
                {
                  product.redeemable && product.redeemable==="1"?
                  <>
                      <span><NumberFormat displayType="text" thousandSeparator="." value={finalProductPrice || 0} decimalSeparator="," suffix=" Poin"/></span>
                  </>
                  :
                  <>
                  {discountedPrice !== null ? (
                    <Fragment>
                      <span className="old">
                        {"Rp" + finalProductPrice}
                      </span>{" "}
                      <span>
                        {"Rp" + finalDiscountedPrice}
                      </span>
                    </Fragment>
                  ) : (
                    <span>{"Rp" }<NumberFormat displayType="text" thousandSeparator="." value={finalProductPrice || 0} decimalSeparator="," /> </span>
                  )}
                  </>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        currency={currency}
        discountedprice={discountedPrice}
        finalproductprice={finalProductPrice}
        finaldiscountedprice={finalDiscountedPrice}
        cartitem={cartItem}
        wishlistitem={wishlistItem}
        compareitem={compareItem}
        addtocart={addToCart}
        addtowishlist={addToWishlist}
        addtocompare={addToCompare}
        addtoast={addToast}
        decreaseQuantity={decreaseQuantity}
        deleteFromWishlist={deleteFromWishlist}
      />
    </Fragment>
  );
};

ProductGridSingleSeven.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  cartItem: PropTypes.object,
  compareItem: PropTypes.object,
  currency: PropTypes.object,
  product: PropTypes.object,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  wishlistItem: PropTypes.object,
  decreaseQuantity: PropTypes.func,
  deleteFromWishlist: PropTypes.func,
};

export default ProductGridSingleSeven;
