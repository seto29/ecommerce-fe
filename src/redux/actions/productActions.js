import instance from '../../axios'
export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";

// fetch products
export const fetchProducts = () => {
  return function(dispatch) {
    return instance.get('products/GetAll.php').then(result => {
        // dispatch
        if(result===undefined|| typeof result==='undefined'){
          fetchProducts()
        }else{
          dispatch({
              type: FETCH_PRODUCTS_SUCCESS,
              payload: result.data.products
          });
        }
    });
  };
};
