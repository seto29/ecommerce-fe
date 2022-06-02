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
        className={`col-4 ${
          sliderClassName ? sliderClassName : ""
        }`}
      >
        <div
          className={`${
            spaceBottomClass ? spaceBottomClass : ""
          }`}
        >
          <div className="product-img">
          {product.id==="6"?
              <Link to={process.env.PUBLIC_URL + "/custom-order"}>
                        <img
                className="default-img img-fluid"
                src={process.env.PUBLIC_URL + product.image}
                alt=""
                width="100%"
                height="100%"
              />
                      </Link>
                      :
            <Link to={product.sub.length===0?{ pathname: process.env.PUBLIC_URL + "/shop",state: { data :product.name}}:{ pathname: process.env.PUBLIC_URL + "/sub-categories",state: { data :product.name, sub: product.sub, default_image:product.image_subcategory_all}}}>
              <img
                className="default-img img-fluid"
                src={process.env.PUBLIC_URL + product.image}
                alt={product.image}
                width="100%"
                height="100%"
              />
            </Link>
}
          </div>
        </div>
      </div>
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
