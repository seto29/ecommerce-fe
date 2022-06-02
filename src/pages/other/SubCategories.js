import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import {
    CRow,
    CCol
  } from '@coreui/react'
import Accordion from "react-bootstrap/Accordion";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import {GetByID, Update, UpdatePassword} from "../../services/User"
import {getDefaultImage} from "../../services/Categories";
import {insertCO} from "../../services/Transaction"
import ls from "local-storage"
const init = {name:"", phone:"", shop:"", address:"", necessity:"", details:""}
const MyAccount = ({ location, history }) => {
  console.log(location)
  const { pathname } = location;
  const [profile, setProfile] = useState(init)
  const [defaultI, setDefaultI] = useState("");
  
  async function getDef(){
    await getDefaultImage().then(({image})=>{
        setDefaultI(image)
        // setLoading(false)
    })
  }

  useEffect(()=>{
      async function fetchVouchers(){
        const res = await GetByID()
        setProfile({name: res.detail.name, phone: res.detail.phone, email :res.detail.email, shop:"", address:"", necessity:"", details:""})
      }
      fetchVouchers()
      if(location.state.default_image){
        setDefaultI(location.state.default_image)
      }else{
        getDef()
      }
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
        <title>Hiji Official Store | Sub Kategori</title>
        <meta
          name="Akun Hiji Official Store"
          content="Sub Kategori"
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Beranda</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Sub Kategori
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              {/* <div className="ml-auto mr-auto col-lg-9"> */}
                {/* <div className="myaccount-wrapper"> */}
                            <CCol xs="12" md="4">
                                <Card className="single-my-account mb-20" key={"0-0"}>
                                    <Card.Body>
                                    <Link to={{ pathname: process.env.PUBLIC_URL + "/shop",state: { data :location.state.data, data1 : ""}}}>
                                        <CRow>
                                            <CCol xs='4' >
                                            <img
                                                className="default-img img-fluid"
                                                src={defaultI}
                                                alt={defaultI}
                                                width="100%"
                                                
                                                height="100%"
                                            />
                                            </CCol>
                                            <CCol xs='8'>
                                                <div style={{margin:'0', position:'absolute', top:'50%', msTransform:'translateY(-50%)', transform:'translateY(-50%)'}}>
                                                    <h4>

                                                        {"Semua"}
                                                    </h4>
                                                </div>
                                            </CCol>
                                        </CRow>
                                        </Link>
                                    </Card.Body>
                                </Card>
                                </CCol>
                    {
                        location.state.sub && location.state.sub.map((val, index)=>{
                            console.log(val)
                            return(
                                <CCol xs="12" md="4">
                                <Card className="single-my-account mb-20" key={index}>
                                    <Card.Body>
                                    <Link to={{ pathname: process.env.PUBLIC_URL + "/shop",state: { data :location.state.data, data1 : val.name}}}>
                                        <CRow>
                                            <CCol xs='4' >
                                            <img
                                                className="default-img img-fluid"
                                                src={process.env.PUBLIC_URL + val.image}
                                                alt={val.image}
                                                width="100%"
                                                
                                                height="100%"
                                            />
                                            </CCol>
                                            <CCol xs='8'>
                                                <div style={{margin:'0', position:'absolute', top:'50%', msTransform:'translateY(-50%)', transform:'translateY(-50%)'}}>
                                                    <h4>

                                                        {val.name}
                                                    </h4>
                                                </div>
                                            </CCol>
                                        </CRow>
                                        </Link>
                                    </Card.Body>
                                </Card>
                                </CCol>

                            )
                        })
                    }
                {/* </div> */}
              {/* </div> */}
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
