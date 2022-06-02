import uuid from "uuid/v4";
import {
  ADD_TO_CART,
  DECREASE_QUANTITY,
  DELETE_FROM_CART,
  DELETE_ALL_FROM_CART,
  FETCH_CARTS_SUCCESS
} from "../actions/cartActions";

const initState = [];

const cartReducer = (state = initState, action) => {
  // ////console.log(state)
  const cartItems = state;
  const  product = action.payload;

  if (action.type === ADD_TO_CART) {
    // for non variant products
    if (product.variants === undefined) {
      const cartItem = cartItems.filter(item => item.product_id === product.product_id && item.unit_metric===product.unit_metric)[0];
      if (cartItem === undefined) {
        return [
          ...cartItems,
          {
            ...product,
            qty: product.qty ? product.qty : 1,
            cartItemId: uuid(),
            unit_metric:product.unit_metric
          }
        ];
      } else {
        return cartItems.map(item =>
          item.id === cartItem.id && item.unit_metric===cartItem.unit_metric
            ? {
                ...item,
                qty: product.qty
                  ? parseInt(item.qty) + parseInt(product.qty)
                  : parseInt(item.qty) + 1,
                  
            unit_metric:product.unit_metric
              }
            : item
        );
      }
      // for variant products
    } else {
      const cartItem = cartItems.filter(
        item =>
          item.product_id === product.product_id &&
          // product.selectedProductColor &&
          // product.selectedProductColor === item.selectedProductColor &&
          product.variants &&
          JSON.stringify(product.variants) ===JSON.stringify(item.variants)
      )[0];
      if (cartItem === undefined) {
        return [
          ...cartItems,
          {
            ...product,
            qty: product.qty ? product.qty : 1,
            cartItemId: uuid()
          }
        ];
      } else if (
        cartItem !== undefined &&
        (
          // cartItem.selectedProductColor !== product.selectedProductColor ||
          JSON.stringify(cartItem.variants) !==  JSON.stringify(product.variants))
      ) {
        return [
          ...cartItems,
          {
            ...product,
            qty: product.qty ? product.qty : 1,
            cartItemId: uuid()
          }
        ];
      } else {
        return cartItems.map(item =>
          item.product_id === cartItem.product_id
          &&
          (
            // cartItem.selectedProductColor !== product.selectedProductColor ||
            JSON.stringify(cartItem.variants) ===  JSON.stringify(item.variants))
            ? {
                ...item,
                qty: parseInt(product.qty)
                  ? parseInt(item.qty) + parseInt(product.qty)
                  : parseInt(item.qty) + 1,
                // selectedProductColor: product.selectedProductColor,
                // selectedProductSize: product.selectedProductSize,
                variants: product.variants
              }
            : item
        );
      }
    }
  }

  if (action.type === DECREASE_QUANTITY) {
    if (parseInt(product.qty) === 1) {
      const remainingItems = (cartItems, product) =>
        cartItems.filter(
          cartItem => cartItem.product_id!==product.id && product.variants &&
          JSON.stringify(product.variants) !==JSON.stringify(cartItem.variants)
        );
      return remainingItems(cartItems, product);
    } else {
      return cartItems.map(item =>
        item.product_id === product.product_id && 
        (JSON.stringify(item.variants) ===  JSON.stringify(product.variants))
          ? { ...item, qty: item.qty - 1 }
          : item
      );
    }
  }

  if (action.type === DELETE_FROM_CART) {
    const remainingItems = (cartItems, product) =>
      cartItems.filter(cartItem => cartItem.product_id!==product.id && product.variants &&
        JSON.stringify(product.variants) !==JSON.stringify(cartItem.variants) );
    return remainingItems(cartItems, product);
  }

  if (action.type === DELETE_ALL_FROM_CART) {
    return cartItems.filter(item => {
      return false;
    });
  }

  if (action.type === FETCH_CARTS_SUCCESS) {
    return (
      action.payload
    );
  }

  return state;
};

export default cartReducer;
