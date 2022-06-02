import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import ProductGridSingleSeven from "../../components/product/ProductGridSingleSeven";
import { addToCart, decreaseQuantity } from "../../redux/actions/cartActions";
import { addToWishlist, deleteFromWishlist } from "../../redux/actions/wishlistActions";
import { addToCompare } from "../../redux/actions/compareActions";

function ProductGridSeven  (
 props
){
  const [products, setProducts] = useState(props.products)
  useEffect(() => {
    setProducts(props.products)
  },[props]);
  return (
    <>
    <Fragment>
      {products && products.map((product) => {
        return (
          <ProductGridSingleSeven
            sliderClassName={props.sliderClassName}
            spaceBottomClass={props.spaceBottomClass}
            colorClass={props.colorClass}
            product={product}
            currency={props.currency}
            addToCart={props.addToCart}
            addToWishlist={props.addToWishlist}
            addToCompare={props.addToCompare}
            cartItem={
              props.cartItems.filter((cartItem) => cartItem.product_id === product.product_id)[0]
            }
            wishlistItem={
              props.wishlistItems.filter(
                (wishlistItem) => wishlistItem.id === product.id
              )[0]
            }
            // compareItem={
            //   props.compareItems.filter(
            //     (compareItem) => compareItem.id === product.id
            //   )[0]
            // }
            key={product.id}
            
            decreaseQuantity={props.decreaseQuantity}
            deleteFromWishlist={props.deleteFromWishlist}
          />
        );
      })}
    </Fragment>
    <div></div>
  </>
  );
};

ProductGridSeven.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  cartItems: PropTypes.array,
  compareItems: PropTypes.array,
  currency: PropTypes.object,
  products: PropTypes.array,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  wishlistItems: PropTypes.array,
  decreaseQuantity: PropTypes.func,
  deleteFromWishlist: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
  return {
    products: ownProps.products,
    category: ownProps.category,
    currency: state.currencyData,
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    compareItems: state.compareData
  };
};

const mapDispatchToProps = (dispatch) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductGridSeven);
