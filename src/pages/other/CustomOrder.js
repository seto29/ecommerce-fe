import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import {GetByID, Update, UpdatePassword} from "../../services/User"
import {insertCO} from "../../services/Transaction"
import ls from "local-storage"
const init = {name:"", phone:"", shop:"", address:"", necessity:"", details:""}
const MyAccount = ({ location, history }) => {
  console.log(location)
  const { pathname } = location;
  const [profile, setProfile] = useState(init)
  
  useEffect(()=>{
      async function fetchVouchers(){
        const res = await GetByID()
        setProfile({name: res.detail.name, phone: res.detail.phone, email :res.detail.email, shop:"", address:"", necessity:"", details:""})
        if(location.state && location.state.data){
          setProfile(prevState => ({ ...prevState, [ 'necessity' ]: location.state.data }));
        }
      }
      fetchVouchers()
  },[])

  const handleUserInput = ({ target }) => {
    let name = target.name;
    let value = "";
    if(target.name === "phone"){
        if(isNaN(target.value)===false){
            value = target.value;
        }else{
            value = target.value.slice(0, -1) 
        }
    }else{
        value = target.value;
    }
    setProfile(prevState => ({ ...prevState, [ name ]: value }));
}
  
async function handleInsert(){
  await insertCO(profile.necessity, profile.address, profile.shop).then((data)=>{
    if(data.status===200){
      alert('Berhasil')
      window.location.href = ("https://api.whatsapp.com/send?phone=6282320907970&text=Nama: "+encodeURI(profile.name)+"%0ANo. HP: "+encodeURI(profile.phone)+"%0AEmail: "+encodeURI(profile.email?profile.email:"-")+"%0AToko: "+encodeURI(profile.shop)+"%0AAlamat: "+encodeURI(profile.address)+"%0APertanyaan: "+encodeURI(profile.necessity))
    }else{
      alert('Gagal Silahkan Coba Lagi')
    }
  })
}

  return (
    <Fragment>
      <MetaTags>
        <title>Hiji Official Store | Pesan Custom</title>
        <meta
          name="Akun Hiji Official Store"
          content="Pesan Custom"
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Beranda</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Pesan Custom
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        
        <button 
              style={{width:'33.33%',
              border: '1px solid #24446c',
              borderTopColor: '#24446c',
              backgroundColor: '#24446c',
              color: '#e3ca09',
              height:'7vh',
              cursor: 'pointer'}}>
              <u>Form</u>
            </button>
            <button 
              onClick={()=>history.push('/sample')}
            style={{width:'33.33%',
              border: '1px solid #24446c',
              borderTopColor: '#24446c',
              borderRightColor: '#24446c',
              backgroundColor: '#24446c',
              color: '#fff',
              height:'7vh',
              cursor: 'pointer'}}>
              Sample
            </button>
            
            
            <button
              onClick={()=>history.push({pathname: process.env.PUBLIC_URL + "/shop",state: { data :"Custom Order", data1 : ""}})}
              style={{width:'33.33%',
              border: '1px solid #24446c',
              backgroundColor: '#24446c',
              borderTopColor: '#24446c',
              borderLeftColor: '#24446c',
              color: '#fff',
              height:'7vh',
              cursor: 'pointer'}}>
              Pesanan
            </button>
        <Breadcrumb />
        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="ml-auto mr-auto col-lg-9">
                <div className="myaccount-wrapper">
                    <Card className="single-my-account mb-20">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>Detail Pesan Custom</h4>
                            </div>
                            <div className="row">
                              <div className="col-sm-12">
                                <div className="billing-info">
                                  <label>Nama (Wajib)</label>
                                  <input type="text" name="name" value={profile.name} onChange={(e)=>handleUserInput(e)}/>
                                </div>
                              </div>
                              <div className="col-sm-12">
                                <div className="billing-info">
                                  <label>No. Telepon (Wajib)</label>
                                  <input type="text" name="phone" value={profile.phone} onChange={(e)=>handleUserInput(e)}/>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Email</label>
                                  <input type="email" name="email" value={profile.email} onChange={(e)=>handleUserInput(e)}/>
                                </div>
                              </div>
                              <div className="col-sm-12">
                                <div className="billing-info">
                                  <label>Nama Toko (Wajib)</label>
                                  <input type="text" name="shop" value={profile.shop} onChange={(e)=>handleUserInput(e)}/>
                                </div>
                              </div>
                              <div className="col-sm-12">
                                <div className="billing-info">
                                  <label>Alamat Toko (Wajib)</label>
                                  <input type="text" name="address" value={profile.address} onChange={(e)=>handleUserInput(e)}/>
                                </div>
                              </div>
                              <div className="col-sm-12">
                                <div className="billing-info">
                                  <label>Pertanyaan (Wajib)</label>
                                  <textarea  type="text" name="necessity" value={profile.necessity} onChange={(e)=>handleUserInput(e)}/>
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              {
                                profile.name.length>0 && profile.phone.length>0 && profile.address.length>0 && profile.shop.length>0 && profile.necessity.length>0?
                              <div className="billing-btn">
                                <button type="submit" disabled={profile.name.length>0 && profile.phone.length>0 && profile.address.length>0 && profile.shop.length>0 && profile.necessity.length>0?false:true} onClick={()=>handleInsert()}>
                                {/* <a href={"https://api.whatsapp.com/send?phone=6282320907970&text=Nama: "+encodeURI(profile.name)+"%0ANo. HP: "+encodeURI(profile.phone)+"%0AEmail: "+encodeURI(profile.email?profile.email:"-")+"%0AToko: "+encodeURI(profile.shop)+"%0AAlamat: "+encodeURI(profile.address)+"%0APertanyaan: "+encodeURI(profile.necessity)} target="_blank" style={{textDecoration:'none'}}> */}
                              {/* <button  className="btn-hover"> */}
                                Pesan Sekarang
                              {/* </button> */}
                            {/* </a> */}
                                </button>
                              </div>
                                :
                              <div className="billing-btn"  >
                                <button style={{backgroundColor:'orange'}} type="submit" disabled={true}>
                                Lengkapi Data Wajib
                                </button>
                              </div>
                              }
                            </div>
                          </div>
                        </Card.Body>
                    </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

MyAccount.propTypes = {
  location: PropTypes.object
};

export default MyAccount;
