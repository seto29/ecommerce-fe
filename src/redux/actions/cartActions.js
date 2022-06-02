import instance from '../../axios'
import ls from 'local-storage'
export const ADD_TO_CART = "ADD_TO_CART";
export const DECREASE_QUANTITY = "DECREASE_QUANTITY";
export const DELETE_FROM_CART = "DELETE_FROM_CART";
export const DELETE_ALL_FROM_CART = "DELETE_ALL_FROM_CART";
export const FETCH_CARTS_SUCCESS = "FETCH_CARTS_SUCCESS";

// fetch products
export const fetchCarts = () => {
  return function(dispatch) {
    return instance.get('carts/GetByUserID.php').then(result => {
      if(result===undefined|| typeof result==='undefined'){
        fetchCarts()
      }else{
        // dispatch
        dispatch({
            type: FETCH_CARTS_SUCCESS,
            payload: result.data.orders
        });
      }
    });
  };
};

// fetch products
export const fetchCarts1 = () => {
  return function(dispatch) {
    return instance.get('carts/GetByUserID1.php',{headers:"Bearer "+ls.get('token')}).then(result => {
        // dispatch
        dispatch({
            type: FETCH_CARTS_SUCCESS,
            payload: result.data.orders
        });
    });
  };
};

//add to cart
export const addToCart = (
  item,
  addToast,
  quantityCount,
  unit_metric,
  selectedProductSize
) => {
  return dispatch => {
    if (addToast) {
      addToast("Added To Cart", { appearance: "success", autoDismiss: true });
    }
    dispatch({
      type: ADD_TO_CART,
      payload: {
        ...item,
        qty: 1,
        unit_metric:unit_metric,
        // selectedProductColor: selectedProductColor
        //   ? selectedProductColor
        //   : item.selectedProductColor
        //   ? item.selectedProductColor
        //   : null,
        selectedProductSize: selectedProductSize
          ? selectedProductSize
          : item.selectedProductSize
          ? item.selectedProductSize
          : null,
        variants: 
        selectedProductSize? 
          selectedProductSize
          : item.variants
          ? item.variants
        : null,
      }
    });
  };
};
//decrease from cart
export const decreaseQuantity = (item, addToast) => {
  return dispatch => {
    if (addToast) {
      addToast("Item Decremented From Cart", {
        appearance: "warning",
        autoDismiss: true
      });
    }
    dispatch({ type: DECREASE_QUANTITY, payload: item });
  };
};
//delete from cart
export const deleteFromCart = (item, addToast) => {
  return dispatch => {
    if (addToast) {
      addToast("Removed From Cart", { appearance: "error", autoDismiss: true });
    }
    dispatch({ type: DELETE_FROM_CART, payload: item });
  };
};
//delete all from cart
export const deleteAllFromCart = addToast => {
  return dispatch => {
    if (addToast) {
      addToast("Removed All From Cart", {
        appearance: "error",
        autoDismiss: true
      });
    }
    dispatch({ type: DELETE_ALL_FROM_CART });
  };
};

// get stock of cart item
export const cartItemStock = (item, color, size) => {
  if (item.stock) {
    return item.stock;
  } else {
    return item.variation
      // .filter(single => single.color === color)[0]
      .size.filter(single => single.name === size)[0].stock;
  }
};
