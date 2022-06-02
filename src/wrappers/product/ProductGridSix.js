import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { GetSortByRating } from "../../services/Products";
import ProductGridSingleSix from "../../components/product/ProductGridSingleSix";
import { addToCart, decreaseQuantity } from "../../redux/actions/cartActions";
import { addToWishlist, deleteFromWishlist } from "../../redux/actions/wishlistActions";
import { addToCompare } from "../../redux/actions/compareActions";

const ProductGridSix = ({
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
  const [products, setProducts] = useState([])
  
  async function getProducts(){
    await GetSortByRating().then(({products})=>{
      if(products!==null && products.length>0){
        setProducts(products)
      }else{
        getProducts()
      }
    })
  }
  
  useEffect(() => {
    getProducts()
  },[]);
  return (
    <Fragment>
      {products && products.map((product) => {
        return (
          <ProductGridSingleSix
            sliderClassName={sliderClassName}
            spaceBottomClass={spaceBottomClass}
            product={product}
            currency={currency}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
            addToCompare={addToCompare}
            cartItem={
              cartItems.filter((cartItem) => cartItem.product_id === product.product_id)[0]
            }
            wishlistItem={
              wishlistItems.filter(
                (wishlistItem) => wishlistItem.product_id === product.product_id
              )[0]
            }
            compareItem={
              compareItems.filter(
                (compareItem) => compareItem.product_id === product.product_id
              )[0]
            }
            key={product.id}
            decreaseQuantity={decreaseQuantity}
            deleteFromWishlist={deleteFromWishlist}
          />
        );
      })}
    </Fragment>
  );
};

ProductGridSix.propTypes = {
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

const mapStateToProps = (state, ownProps) => {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductGridSix);
