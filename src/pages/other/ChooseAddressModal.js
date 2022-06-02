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
import UpdateAddressModal from "./UpdateAddressModal"
import { addToCart, decreaseQuantity } from "../../redux/actions/cartActions";
import {siCepatTarif, kurirHiji} from "../../services/Deliveries"
function ProductModal(props) {
  const { product } = props;
  
  const [modalShow, setModalShow] = useState(false);
  const [modalShow1, setModalShow1] = useState(false);
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
  const [isDefault, setIsDefault] = useState("0");
  const [addressUpdate, setAddressUpdate] = useState({});

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

  const gallerySwiperParams = {
    getSwiper: getGallerySwiper,
    spaceBetween: 10,
    loopedSlides: 4,
    loop: true
  };

  const thumbnailSwiperParams = {
    getSwiper: getThumbnailSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    loopedSlides: 4,
    touchRatio: 0.2,
    freeMode: true,
    loop: true,
    slideToClickedSlide: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    renderPrevButton: () => (
      <button className="swiper-button-prev ht-swiper-button-nav">
        <i className="pe-7s-angle-left" />
      </button>
    ),
    renderNextButton: () => (
      <button className="swiper-button-next ht-swiper-button-nav">
        <i className="pe-7s-angle-right" />
      </button>
    )
  };

  async function handleAddToCart(){
    if(quantityCount < product.stock ){
      await insert(product.id, 1,"").then((data)=>{
        ////console.log(data.success)
      })
    }
    setQuantityCount(
      quantityCount < product.stock 
        ? quantityCount + 1
        : quantityCount
    )
    if(quantityCount < product.stock ){
      addToCart(
        product,
        addToast,
        quantityCount
      )
    }
  }

  async function handleMinCart(){
    await minQty(product.id, 1,"").then((data)=>{
      ////console.log(data.success)
    })
    
    setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)

    decreaseQuantity(
      product,
      addToast
    )
  }

  async function handleChangeDistrict(v_name){
      handleTarif(v_name, props.weight)
}

  async function handleChangeDistrictU(v_name,w){
      handleTarif(v_name, w)
}

const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");

  async function handleTarif(destination_code, weight){

    props.setDelivery({value:"",label:""})
    props.setDeliveries([])
    let list = []
    let i =0
    const res3 = await kurirHiji()
      if(res3.status===200){
        res3.delivery_method.map(value=>{
          let a = addCommas(removeNonNumeric(value.price)) 
          list[i] = {
            id: value.id, value: value.id, label: value.name+" - Rp"+ a,
            target: { type: 'select', name: 'delivery', value: value.id, label: value.name+" - Rp"+ a, service:value.id, description:value.name, minPrice:parseInt(value.price), tariff:parseInt(value.price), unitPrice:parseInt(value.price) }
          }
          i++;
          return i;
        })
      }
      const res2 = await siCepatTarif(destination_code, weight)
      if(res2.status.code===200){
        res2.results.map(value=>{
          
          let a = addCommas(removeNonNumeric(value.tariff)) 
          list[i] = {
            id: value.service, value: value.service, label: value.description+ "("+value.etd+") - Rp"+a,
            target: { type: 'select', name: 'delivery', value: value.service, label: value.description+ "("+value.etd+") - Rp"+a, service:value.service, description:value.description, etd:value.etd, minPrice:value.minPrice, tariff:value.tariff, unitPrice:value.unitPrice }
          }
          i++;
          return i;
        })
        props.setDeliveries(list)
      }
}

  function handleChooseAddress(id,recipient_name, name, recipient_phone, address, v_name, d_name, c_name, p_name,village_id,postal_code, detail){
    handleChangeDistrict(v_name)
    props.setAddress({id:id,recipient_name:recipient_name,name:name,recipient_phone:recipient_phone, address:address, v_name:v_name, d_name:d_name, c_name:c_name, p_name:p_name,village_id:village_id,postal_code:postal_code, detail:detail})
    props.onHide()
  }
  
  function handleSetDefault(id,recipient_name, name, recipient_phone, address, v_name, d_name, c_name, p_name,village_id,postal_code, detail){
    handleChangeDistrict(v_name)
    props.updateDefaultAd(id)
    props.setAddress({id:id,recipient_name:recipient_name,name:name,recipient_phone:recipient_phone, address:address, v_name:v_name, d_name:d_name, c_name:c_name, p_name:p_name,village_id:village_id,postal_code:postal_code, detail:detail})
    props.onHide()
  }
  
  function handleShowUpdateModal(id,recipient_name, name, recipient_phone, address, v_name, d_name, c_name, p_name,village_id,postal_code, detail, is_default){
    setIsDefault(is_default)
    setAddressUpdate({id:id,recipient_name:recipient_name,name:name,recipient_phone:recipient_phone, address:address, v_name:v_name, d_name:d_name, c_name:c_name, p_name:p_name,village_id:village_id,postal_code:postal_code, detail:detail})
    setModalShow1(true)
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
        <UpdateAddressModal
            show={modalShow1}
            onHide={() => setModalShow1(false)}
            product = {[]}
            addressUpdate={addressUpdate}
            isDefault={isDefault}
            fetchAddress={props.fetchAddress1}
            setAddress={props.setAddress}
            setChooseAddress = {props.setAddress}
            handleChangeDistrict1={handleChangeDistrictU}
            weight={props.weight}
        />
      <Modal
        show={props.show}
        onHide={props.onHide}
        backdrop="static"
        className="product-quickview-modal-wrapper"
      >
        <Modal.Header closeButton></Modal.Header>

        <div className="modal-body">
            <ul style={{overflowY:'scroll', height:'70vh'}}>
                        <div className="row" style={{backgroundColor:"#efefef", padding:'10px', borderRadius:'15px', margin:'10px'}}>
                        <button style={{margin:"5px", width:'100%', height: '50px',backgroundColor:'#24446c',color:'white',borderRadius:'15px'}} onClick={()=>handleShowAddModal()}> Tambah Alamat </button>
                        </div>
            {
                props.addresses && props.addresses.map(({id,recipient_name, name, recipient_phone, address, v_name, d_name, c_name, p_name,village_id,postal_code, is_default, detail})=>{
                    return (
                        <div className="row" style={{backgroundColor:"#efefef", padding:'10px', borderRadius:'15px', margin:'10px'}}>
                            <div className="col-sm-6">
                                <li key={name} >  
                                    <ul>
                                        <p>{recipient_name +" ("+name+") "}</p>
                                        <p>{recipient_phone}</p>
                                        <p>{address} ({detail})</p>
                                        <p>{v_name +", "+d_name+", "+c_name+", "+p_name+" ("+postal_code+")"}</p>
                                    </ul> 
                                </li>
                            </div>

                            <div className="col-sm-6">
                                {
                                  is_default==='1'?
                                  <>
                                  <button style={{ marginTop:"5vh", width:'50%', backgroundColor:'#24446c',color:'white',borderRadius:'15px', marginLeft:'50%'}} onClick={()=>handleShowUpdateModal(id,recipient_name, name, recipient_phone, address, v_name, d_name, c_name, p_name,village_id,postal_code, detail, is_default)}> Ubah Alamat </button>
                                  <button style={{marginTop:"1vh", width:'100%', backgroundColor:'#24446c',color:'white',borderRadius:'15px'}} onClick={()=>handleChooseAddress(id,recipient_name, name, recipient_phone, address, v_name, d_name, c_name, p_name,village_id,postal_code, detail)}> Pilih Alamat </button>
                                  </>
                                  :
                                  <>
                                  <button style={{ marginTop:"5vh", width:'50%', backgroundColor:'#24446c',color:'white',borderRadius:'15px'}} onClick={()=>handleShowUpdateModal(id,recipient_name, name, recipient_phone, address, v_name, d_name, c_name, p_name,village_id,postal_code, detail, is_default)}> Ubah Alamat </button>
                                  <button style={{ marginTop:"5vh", width:'50%', backgroundColor:'#24446c',color:'white',borderRadius:'15px'}} onClick={()=>handleSetDefault(id,recipient_name, name, recipient_phone, address, v_name, d_name, c_name, p_name,village_id,postal_code, detail)}> Jadikan Default </button>
                                  <button style={{marginTop:"1vh", width:'100%', backgroundColor:'#24446c',color:'white',borderRadius:'15px'}} onClick={()=>handleChooseAddress(id,recipient_name, name, recipient_phone, address, v_name, d_name, c_name, p_name,village_id,postal_code, detail)}> Pilih Alamat </button>
                                  </>
                                }
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
