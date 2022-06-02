import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import Swiper from "react-id-swiper";
import { getProductCartQuantity } from "../../helpers/product";
import { Modal } from "react-bootstrap";
import Rating from "../../components/product/sub-components/ProductRating";
import { connect } from "react-redux";
import NumberFormat from 'react-number-format';
import {insert,minQty} from "../../services/Carts"
import AddAddressModal from "./AddAddressModal"
import { addToCart, decreaseQuantity } from "../../redux/actions/cartActions";
function ProductModal(props) {
  const { product } = props;
////console.log(props)
  const [modalShow, setModalShow] = useState(false);
  // const { currency } = props;
  const { discountedprice } = props;
  const { finalproductprice } = props;
  const { finaldiscountedprice } = props;

  const [gallerySwiper, getGallerySwiper] = useState(null);
  const [thumbnailSwiper, getThumbnailSwiper] = useState(null);
  const [selectedProductColor, setSelectedProductColor] = useState(
    product.variation ? product.variation[0].color : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variation ? product.variation[0].size[0].name : ""
  );
  const [productStock, setProductStock] = useState(
    product.variation ? product.variation[0].size[0].stock : product.stock
  );
  const [quantityCount, setQuantityCount] = useState(1);

  const wishlistItem = props.wishlistitem;
  // const compareItem = props.compareitem;

  const addToCart = props.addtocart;
  const addToWishlist = props.addtowishlist;
  // const addToCompare = props.addtocompare;

  const addToast = props.addtoast;
  const cartItems = props.cartitems;

  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  useEffect(() => {
    setQuantityCount(parseInt(getProductCartQuantity(
      cartItems,
      product,
      selectedProductColor,
      selectedProductSize,
      )))
    }, [product])

  useEffect(() => {
    if (
      gallerySwiper !== null &&
      gallerySwiper.controller &&
      thumbnailSwiper !== null &&
      thumbnailSwiper.controller
    ) {
      gallerySwiper.controller.control = thumbnailSwiper;
      thumbnailSwiper.controller.control = gallerySwiper;
    }
  }, [gallerySwiper, thumbnailSwiper]);

  function handleChooseVoucher(id,code, start, end, remaining,description, discount, min_transaction, max_discount){
    props.setVoucher({id:id,code:code,start:start,end:end, remaining:remaining, description:description, discount:discount, min_transaction:min_transaction, max_discount:max_discount})
    props.onHide()
  }

  function handleShowAddModal(){
    setModalShow(true)
    props.onHide()
  }

  return (
    <Fragment>
        <AddAddressModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            product = {[]}
            fetchAddress={props.fetchAddress}
            setChooseAddress = {props.setAddress}
        />
      <Modal
        show={props.show}
        onHide={props.onHide}
        backdrop="static"
        className="product-quickview-modal-wrapper"
      >
        <Modal.Header closeButton> <h4>Voucher Anda</h4></Modal.Header>

        <div className="modal-body">
            <ul style={{overflowY:'scroll', height:'70vh'}}>
            {
                props.vouchers && props.vouchers.map(({id,code, start, end, remaining,description, discount, min_transaction, max_discount})=>{
                    return (
                        <div className="row" style={{backgroundColor:"#efefef", padding:'10px', borderRadius:'15px', margin:'10px'}}>
                            <div className="col-sm-6">
                                <li key={id} >  
                                    <ul>
                                        <h3>{code}</h3>
                                        <br/>
                                        <h4>{description}</h4>
                                        <p>Maksimal diskon {discount}% sampai dengan Rp <NumberFormat displayType="text" thousandSeparator="." value={max_discount} decimalSeparator="," />, dengan minimal transaksi Rp <NumberFormat displayType="text" thousandSeparator="." value={min_transaction} decimalSeparator="," />, berlaku mulai tanggal {Intl.DateTimeFormat("id-ID", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }).format(Date.parse(start))} sampai dengan tanggal {Intl.DateTimeFormat("id-ID", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }).format(Date.parse(end))} </p>
                                        <p> sisa penggunaan {remaining} x</p>
                                    </ul> 
                                </li>
                            </div>

                            <div className="col-sm-6">
                                <button style={{marginTop:"5vh", width:'100%', backgroundColor:'#24446c',color:'white',borderRadius:'15px'}} onClick={()=>handleChooseVoucher(id,code, start, end, remaining,description, discount, min_transaction, max_discount)}> Pakai Voucher </button>
                            </div>
                        </div>
                    )
                })
            }
            </ul>
        </div>
      </Modal>
    </Fragment>
  );
}

ProductModal.propTypes = {
  addtoast: PropTypes.func,
  addtocart: PropTypes.func,
  addtocompare: PropTypes.func,
  addtowishlist: PropTypes.func,
  cartitems: PropTypes.array,
  compareitem: PropTypes.object,
  currency: PropTypes.object,
  discountedprice: PropTypes.number,
  finaldiscountedprice: PropTypes.number,
  finalproductprice: PropTypes.number,
  onHide: PropTypes.func,
  product: PropTypes.object,
  show: PropTypes.bool,
  wishlistitem: PropTypes.object
};

const mapStateToProps = state => {
  return {
    cartitems: state.cartData
  };
};

export default connect(mapStateToProps)(ProductModal);
