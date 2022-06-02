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
import {getAllSample} from "../../services/Products";
import {insertCO} from "../../services/Transaction"
import ls from "local-storage"
const init = {name:"", phone:"", shop:"", address:"", necessity:"", details:""}
const MyAccount = ({ location, history }) => {
  console.log(location)
  const { pathname } = location;
  const [profile, setProfile] = useState(init)
  const [defaultI, setDefaultI] = useState("");
  const [products, setProducts] = useState([]);
  
  async function getDef(){
    await getDefaultImage().then(({image})=>{
        setDefaultI(image)
        // setLoading(false)
    })
  }
  async function getAllS(){
    await getAllSample().then(({samples, status})=>{
        if(status===200){
            console.log(samples)
            setProducts(samples)
        }
        // setLoading(false)
    })
  }

  useEffect(()=>{
      getDef()
      getAllS()
  },[])

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
        
        
        
        <button 
              onClick={()=>history.push('/custom-order')}
            style={{width:'33.33%',
              border: '1px solid #24446c',
              borderTopColor: '#24446c',
              borderRightColor: '#24446c',
              backgroundColor: '#24446c',
              color: '#fff',
              height:'7vh',
              cursor: 'pointer'}}>
              Form
            </button>
        <button 
              style={{width:'33.33%',
              border: '1px solid #24446c',
              borderTopColor: '#24446c',
              backgroundColor: '#24446c',
              color: '#e3ca09',
              height:'7vh',
              cursor: 'pointer'}}>
              <u>Sample</u>
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
              {/* <div className="ml-auto mr-auto col-lg-9"> */}
                {/* <div className="myaccount-wrapper"> */}
                    {
                        products && products.map((val, index)=>{
                            console.log(val)
                            return(
                                <CCol xs="12" md="6">
                                <Card className="single-my-account mb-20" key={index}>
                                    <Card.Body>
                                    <Link to={process.env.PUBLIC_URL + "/product/" + val.slug}>
                                    {/* <Link to={{ pathname: process.env.PUBLIC_URL + "/shop",state: { data :location.state.data, data1 : val.name}}}> */}
                                        <CRow>
                                            <CCol xs='4' >
                                            <img
                                                className="default-img img-fluid"
                                                src={process.env.PUBLIC_URL + val.images[0]}
                                                alt={val.images[0]}
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
