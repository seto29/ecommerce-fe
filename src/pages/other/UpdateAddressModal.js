import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import {update, siCepatDestination} from "../../services/Addresses"

import Select from 'react-select';
function ProductModal(props) {
  const [districts, setDistricts] = useState([])
  const [district, setDistrict] = useState({})
  const [village, setVillage] = useState({})
  const [name, setName] = useState(props.addressUpdate.name)
  const [recipientName, setRecipientName] = useState(props.addressUpdate.recipient_name)
  const [recipientPhone, setRecipientPhone] = useState(props.addressUpdate.recipient_phone)
  const [address, setAddress] = useState(props.addressUpdate.address)
  const [notes, setNotes] = useState(props.addressUpdate.detail)
  const [postalCode, setPostalCode] = useState(props.addressUpdate.postal_code)

  async function insertAddress() {
      const res = await update(address, name, notes, recipientName, recipientPhone, postalCode, district.value, props.addressUpdate.id)
      props.fetchAddress()
      if(props.isDefault==='1'){
        props.handleChangeDistrict1(district.value, props.weight)
      }
      // props.setChooseAddress({id:res.msg,recipient_name:recipientName,name:name,recipient_phone:recipientPhone, address:address, v_name:village.label, d_name:district.label, c_name:regency.label, p_name:province.label,village_id:village.value, postal_code: postalCode})
      props.onHide()
      setDistrict({})
      setName("")
      setRecipientName("")
      setAddress("")
      setPostalCode("")
      setNotes("")
  }

    async function handleFetch(){
      const res1 = await siCepatDestination()
        setDistricts(res1)
    }

    async function handleChangeDistrict(e){
        setDistrict(e.target)
    }

  useEffect(() => {
    console.log(props.addressUpdate)
    setName(props.addressUpdate.name)
    setRecipientName(props.addressUpdate.recipient_name)
    setRecipientPhone(props.addressUpdate.recipient_phone)
    setPostalCode(props.addressUpdate.postal_code)
    setAddress(props.addressUpdate.address)
    setNotes(props.addressUpdate.detail)
    setDistrict({id:props.addressUpdate.v_name,value:props.addressUpdate.v_name, label: props.addressUpdate.d_name+', '+props.addressUpdate.c_name+', '+props.addressUpdate.p_name,
    target: { type: 'select', name: 'list', value: props.addressUpdate.v_name, label: props.addressUpdate.d_name+', '+props.addressUpdate.c_name+', '+props.addressUpdate.p_name}})
    handleFetch()
  }, [props]);


  return (
    <Fragment>
      <Modal
        show={props.show}
        backdrop="static"
        onHide={props.onHide}
        
        className="product-quickview-modal-wrapper"
      >
        <Modal.Header closeButton></Modal.Header>

        <div className="modal-body" style={{overflowY:'scroll', height:'70vh'}}>
            <div className="row">
                <div className="col-lg-12">
                  <div className="billing-info-wrap">
                    <h3>Ubah Alamat</h3>
                    <div className="row">

                      <div className="col-lg-12 col-md-12">
                        <div className="billing-info mb-20">
                          <label>Nama</label>
                          <input type="text" placeholder="Rumah" name="name" value={name} onChange={(e)=>setName(e.target.value)}/>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Nama Penerima</label>
                          <input type="text" placeholder="Kevin" name="recipientName" value={recipientName} onChange={(e)=>setRecipientName(e.target.value)}/>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Nomor Telepon</label>
                          <input type="text" placeholder="08123456789" name="recipientPhone" value={recipientPhone} onChange={(e)=>setRecipientPhone(e.target.value)}/>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-12">
                        <div className="billing-info mb-20">
                            <label>Kecamatan</label>
                            <Select
                                value={district}
                                onChange={(e)=>handleChangeDistrict(e)}
                                options={districts}
                                placeholder="Pilih Kecamatan"
                            />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Kode Pos</label>
                          <input type="text"  name="postalCode" value={postalCode} onChange={(e)=>setPostalCode(e.target.value)}/>
                        </div>
                      </div>
                    </div>

                    <div className="additional-info-wrap">
                      <div className="additional-info">
                        <label>Alamat</label>
                        <textarea
                          placeholder="Isi dengan nama jalan, nomor rumah, nomor kompleks, nama gedung, lantai atau nomor unit. "
                          name="address" value={address} onChange={(e)=>setAddress(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="additional-info-wrap">
                      <div className="additional-info">
                        <label>Catatan</label>
                        <textarea
                          placeholder="Samping Pos Ronda "
                          name="notes" value={notes} onChange={(e)=>setNotes(e.target.value)}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
        </div>
        <Modal.Footer>
            <button 
                align="right" 
                style={name===''||recipientName===''||recipientPhone===''|| postalCode===''||address===''?{width:'25%', backgroundColor:'red',color:'white',borderRadius:'15px'}:{width:'25%', backgroundColor:'#24446c',color:'white',borderRadius:'15px'}} 
                disabled={name===''||recipientName===''||recipientPhone===''|| postalCode===''||address===''?true:false} 
                onClick={()=>insertAddress()}> {name===''||recipientName===''||recipientPhone===''|| postalCode===''||address===''?"Data Belum Lengkap":"Simpan"} 
            </button>
        </Modal.Footer>
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
