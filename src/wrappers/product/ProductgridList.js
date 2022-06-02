import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { addToCart, decreaseQuantity } from "../../redux/actions/cartActions";
import { addToWishlist, deleteFromWishlist } from "../../redux/actions/wishlistActions";
import { addToCompare } from "../../redux/actions/compareActions";
import ProductGridListSingle from "../../components/product/ProductGridListSingle";

const ProductGrid = ({
  layout,
  products,
  currency,
  addToCart,
  addToWishlist,
  addToCompare,
  cartItems,
  wishlistItems,
  compareItems,
  sliderClassName,
  spaceBottomClass,
  decreaseQuantity,
  deleteFromWishlist
}) => {
  return (
    <Fragment>
      {products.map(product => {
        return (
          <ProductGridListSingle
            sliderClassName={sliderClassName}
            spaceBottomClass={spaceBottomClass}
            product={product}
            currency={currency}
            layout={layout}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
            addToCompare={addToCompare}
            cartItem={
              cartItems.filter(cartItem => cartItem.product_id === product.product_id)[0]
            }
            wishlistItem={
              wishlistItems.filter(
                wishlistItem => wishlistItem.product_id === product.product_id
              )[0]
            }
            compareItem={
              compareItems.filter(
                compareItem => compareItem.product_id === product.product_id
              )[0]
            }
            key={product.product_id}
            decreaseQuantity={
              decreaseQuantity}
              
            deleteFromWishlist={deleteFromWishlist}
          />
        );
      })}
    </Fragment>
  );
};

ProductGrid.propTypes = {
  layout: PropTypes.string,
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  cartItems: PropTypes.array,
  compareItems: PropTypes.array,
  currency: PropTypes.object,
  products: PropTypes.array,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  wishlistItems: PropTypes.array,
  decreaseQuantity: PropTypes.func,
  deleteFromWishlist: PropTypes.func,
  
};

const mapStateToProps = state => {
  return {
    currency: state.currencyData,
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    compareItems: state.compareData
  };
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductGrid);
