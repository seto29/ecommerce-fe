import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { getDiscountPrice } from "../../helpers/product";
import Rating from "./sub-components/ProductRating";
import ProductModal from "./ProductModal";
import {insert} from "../../services/Carts"
import NumberFormat from 'react-number-format';
const ProductGridSingleSix = ({
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
  decreaseQuantity,
  deleteFromWishlist
}) => {
  const [modalShow, setModalShow] = useState(false);
  const { addToast } = useToasts();

  const discountedPrice = getDiscountPrice(product.price, product.discount);
  const finalProductPrice = +(product.price * currency.currencyRate).toFixed(2);
  const finalDiscountedPrice = +(
    discountedPrice * currency.currencyRate
  ).toFixed(2);

  async function handleAddToCart(product, addToast){
    await insert(product.id, 1,"").then((data)=>{
    })
    addToCart(product, addToast)
  }

  return (
    <Fragment>
      <div
        className={`col-xl-4 col-md-6 ${
          sliderClassName ? sliderClassName : ""
        }`}
      >
        <div
          className={`product-wrap-6 ${
            spaceBottomClass ? spaceBottomClass : ""
          }`}
        >
          <div className="product-img">
            <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
              <img
                className="default-img img-fluid"
                src={process.env.PUBLIC_URL + product.images[0]}
                alt=""
              />
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
          </div>
          <div className="product-content">
            <h3>
              <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
                {product.name}
              </Link>
            </h3>

            <div className="product-price">
              {discountedPrice !== null ? (
                <Fragment>
                  <span className="old">
                    {"Rp" + finalProductPrice}
                  </span>
                  <span>{"Rp" + finalDiscountedPrice}</span>
                </Fragment>
              ) : (
                <span>{"Rp"}<NumberFormat displayType="text" thousandSeparator="." value={finalProductPrice || 0} decimalSeparator="," /></span>
              )}
            </div>

            {parseInt(product.rating) && parseInt(product.rating) > 0 ? (
              <div className="product-rating">
                <Rating ratingValue={parseInt(product.rating)} />
              </div>
            ) : (
              ""
            )}

            <div className="product-action">
              <div className="pro-same-action pro-wishlist">
                <button
                  className={wishlistItem !== undefined ? "active" : ""}
                  // disabled={wishlistItem !== undefined}
                  title={
                    wishlistItem !== undefined
                      ? "Hapus dari wishlist"
                      : "Tambahkan ke wishlist"
                  }
                  onClick={() => wishlistItem !== undefined ?deleteFromWishlist(product, addToast):addToWishlist(product, addToast)}
                >
                  <i className="pe-7s-like" />
                </button>
              </div>
              {/* <div className="pro-same-action pro-cart">
                {product.affiliateLink ? (
                  <a
                    href={product.affiliateLink}
                    rel="noopener noreferrer"
                    target="_blank"
                    title="Buy now"
                  >
                    <i className="pe-7s-cart"></i>
                  </a>
                ) : product.variation && product.variation.length >= 1 ? (
                  <Link
                    to={`${process.env.PUBLIC_URL}/product/${product.slug}`}
                    title="Select option"
                  >
                    <i className="pe-7s-cart"></i>
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
                    <i className="pe-7s-cart"></i>
                  </button>
                ) : (
                  <button disabled className="active" title="Out of stock">
                    <i className="pe-7s-cart"></i>
                  </button>
                )}
              </div> */}
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

ProductGridSingleSix.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  cartItem: PropTypes.object,
  compareItem: PropTypes.object,
  currency: PropTypes.object,
  product: PropTypes.object,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  wishlistItem: PropTypes.object,
  decreaseQuantity: PropTypes.func,
  deleteFromWishlist: PropTypes.func,
};

export default ProductGridSingleSix;
