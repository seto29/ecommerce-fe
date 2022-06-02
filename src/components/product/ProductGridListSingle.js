import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { getDiscountPrice } from "../../helpers/product";
import Rating from "./sub-components/ProductRating";
import ProductModal from "./ProductModal";
import {insert} from "../../services/Carts"
import NumberFormat from 'react-number-format';
const ProductGridListSingle = ({
  layout,
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
        className={`col-xl-4 col-sm-6 ${
          sliderClassName ? sliderClassName : ""
        }`}
      >
        <div
          className={`product-wrap ${spaceBottomClass ? spaceBottomClass : ""}`}
        >
          <div className="product-img">
            {
              layout==="list"?
              <>
                <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
                  <img
                    className="default-img"
                    src={process.env.PUBLIC_URL + product.images[0]}
                    alt=""
                    />
                </Link>
              </>
              :
              <>
                <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
                  <img
                    className="default-img"
                    src={process.env.PUBLIC_URL + product.images[0]}
                    alt=""
                  />

                  {product.images.length > 1 ? (
                    <img
                      className="hover-img"
                      src={process.env.PUBLIC_URL + product.images[1]}
                      alt=""
                    />
                  ) : (
                    ""
                  )}
                </Link>
              </>
            }
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

            <div className="product-action">
              <div className="pro-same-action pro-wishlist">
                <button
                  className={wishlistItem !== undefined ? "active" : ""}
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
              {/* <div className="pro-same-action pro-cart">
              </div> */}
              {/* <div className="pro-same-action pro-quickview">
                <button onClick={() => setModalShow(true)} title="Quick View">
                  <i className="pe-7s-look" />
                </button>
              </div> */}
            </div>
          </div>
          <div className="product-content text-center">
            <h3>
              <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
                {product.name}
              </Link>
            </h3>
            {product.rating && product.rating > 0 ? (
              <div className="product-rating">
                <Rating ratingValue={product.rating} />
              </div>
            ) : (
              ""
            )}
            <div className="product-price">
              {discountedPrice !== null ? (
                <Fragment>
                  <span>{"Rp" + finalDiscountedPrice}</span>{" "}
                  <span className="old">
                    {"Rp" + finalProductPrice}
                  </span>
                </Fragment>
              ) : (
                <span>{"Rp"}<NumberFormat displayType="text" thousandSeparator="." value={finalProductPrice || 0} decimalSeparator="," /> </span>
              )}
            </div>
          </div>
        </div>
        <div className="shop-list-wrap mb-30">
          <div className="row">
            <div className="col-xl-4 col-md-5 col-sm-6">
              <div className="product-list-images-wrap">
                <div className="product-img">
                {
                  layout==="list"?
                  <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
                    <img
                      className="default-img img-fluid"
                      src={process.env.PUBLIC_URL + product.images[0]}
                      alt=""
                    />
                  </Link>
                  :
                  <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
                    <img
                      className="default-img img-fluid"
                      src={process.env.PUBLIC_URL + product.images[0]}
                      alt=""
                    />
                    {product.images.length > 1 ? (
                      <img
                        className="hover-img img-fluid"
                        src={process.env.PUBLIC_URL + product.images[1]}
                        alt=""
                      />
                    ) : (
                      ""
                    )}
                  </Link>
                }
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
              </div>
            </div>
            <div className="col-xl-8 col-md-7 col-sm-6">
              <div className="shop-list-content">
                <h3>
                  <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
                    {product.name}
                  </Link>
                </h3>
                <div className="product-list-price">
                  {discountedPrice !== null ? (
                    <Fragment>
                      <span>
                        {"Rp" + finalDiscountedPrice}
                      </span>{" "}
                      <span className="old">
                        {"Rp" + finalProductPrice}
                      </span>
                    </Fragment>
                  ) : (
                    <span>{"Rp" + finalProductPrice} </span>
                  )}
                </div>
                {product.rating && product.rating > 0 ? (
                  <div className="rating-review">
                    <div className="product-list-rating">
                      <Rating ratingValue={product.rating} />
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {product.shortDescription ? (
                  <p>{product.shortDescription}</p>
                ) : (
                  ""
                )}

                <div className="shop-list-actions d-flex align-items-center">
                  <div className="shop-list-btn btn-hover">
                    {product.affiliateLink ? (
                      <a
                        href={product.affiliateLink}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {" "}
                        Buy now{" "}
                      </a>
                    ) : product.variation && product.variation.length >= 1 ? (
                      <Link
                        to={`${process.env.PUBLIC_URL}/product/${product.slug}`}
                      >
                        Select Option
                      </Link>
                    ) : product.stock && product.stock > 0 ? (
                      <button
                        onClick={() => handleAddToCart(product, addToast)}
                        className={
                          cartItem !== undefined && cartItem.qty > 0
                            ? "active"
                            : ""
                        }
                        disabled={
                          cartItem !== undefined && cartItem.qty > 0
                        }
                        title={
                          cartItem !== undefined
                            ? "Added to cart"
                            : "Add to cart"
                        }
                      >
                        {" "}
                        <i className="pe-7s-cart"></i>{" "}
                        {cartItem !== undefined && cartItem.qty > 0
                          ? "Added"
                          : "Add to cart"}
                      </button>
                    ) : (
                      <button disabled className="active">
                        Out of Stock
                      </button>
                    )}
                  </div>

                  <div className="shop-list-wishlist ml-10">
                    <button
                      className={wishlistItem !== undefined ? "active" : ""}
                      title={
                        wishlistItem !== undefined
                          ? "Added to wishlist"
                          : "Add to wishlist"
                      }
                      onClick={() => wishlistItem !== undefined?deleteFromWishlist(product, addToast):addToWishlist(product, addToast)}
                    >
                      <i className="pe-7s-like" />
                    </button>
                  </div>
                  <div className="shop-list-compare ml-10">
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
                  </div>
                </div>
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

ProductGridListSingle.propTypes = {
  layout: PropTypes.string,
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

export default ProductGridListSingle;
