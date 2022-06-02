import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom";
import { save, load } from "redux-localstorage-simple";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import { fetchProducts } from "../../redux/actions/productActions";
import { fetchCarts1 } from "../../redux/actions/cartActions";
import rootReducer from "../../redux/reducers/rootReducer";
import { createStore, applyMiddleware } from "redux";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import {Login,updateGuestToUser} from "../../services/User"
import ls from 'local-storage'

const initProfile = ({name:"", email:"", phone:"", password:"" })
const LoginRegister = ({ location, history},props) => {
  const { pathname } = location;
  const [profile, setProfile] = useState(initProfile);
  const [emailLogin, setEmailLogin] = useState("")
  const [passwordLogin, setPasswordLogin] = useState("")
  const [errorLogin, setErrorLogin] = useState("")
  const [loading, setLoading] = useState(false)

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

async function handleRegister(){
  setLoading(true)
    await updateGuestToUser(profile.name, profile.phone, profile.email, profile.password, profile.birth_date).then((data)=>{
      setLoading(false)
      console.log(data)
      if(data.status===200){
        
        alert('Berhasil Mendaftar')
        ls.remove('user')
        ls.remove('token')
        ls.set('token',data.token)
        ls.set('user',data.token)
        
        // fetch products from json file
        store.dispatch(fetchProducts());
        store.dispatch(fetchCarts1());
        setInterval(() => {
        }, 2000)
        history.push('/')
        alert('Berhasil Mendaftar')
      }else{
        alert(data.msg)
      }
    })
}

const store = createStore(
  rootReducer,
  load(),
  composeWithDevTools(applyMiddleware(thunk, save()))
);

  useEffect(()=>{
    if(ls.get('user')){
      ls.remove('user')
      ls.remove('token')
      ls.remove('redux_localstorage_simple')
      window.location.reload()
    }
  },[])

  async function handleLogin(){
      await Login(emailLogin, passwordLogin).then((data)=>{
        if(data.status===200){
          ls.remove('token')
          ls.remove('user')
          ls.set('token',data.token)
          ls.set('user',data.token)
          ls.set('logged',true)
          
          // fetch products from json file
          store.dispatch(fetchProducts());
          store.dispatch(fetchCarts1());
          history.push({ pathname: process.env.PUBLIC_URL + "/",state: { reload :true}})
        }else{
          setErrorLogin("error")
          setTimeout(() => {
            setErrorLogin("")
          }, 2500);
        }
      })
  }
  return (
    <Fragment>
      <MetaTags>
        <title>Hiji Official Store | Login</title>
        <meta
          name="Login dan Register Hiji Official"
          content="Login dan Register Hiji Official"
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Beranda</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Login Daftar
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ml-auto mr-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>Login</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="register">
                          <h4>Daftar</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                           {
                             errorLogin===""?
                             ''
                             :
                            <center>
                              <p style={{backgroundColor:"tomato", borderRadius:"15px", marginBottom:'20px'}}>Login Gagal, Silahkan periksa Data Anda</p>
                            </center>
                           }
                           <label>No.Telepon</label>
                              <input
                                type="text"
                                name="Phone"
                                placeholder="08123456789"
                                value={emailLogin}
                                onChange={(e)=>setEmailLogin(e.target.value)}
                                />
                                
                            <label>Password</label>
                              <input
                                type="password"
                                name="password"
                                placeholder=""
                                value={passwordLogin}
                                onChange={(e)=>setPasswordLogin(e.target.value)}
                                />
                              <div className="button-box">
                                <div className="login-toggle-btn">
                                  {/* <input type="checkbox" />
                                  <label className="ml-10">Remember me</label>
                                  <Link to={process.env.PUBLIC_URL + "/"}>
                                    Forgot Password?
                                  </Link> */}
                                </div>
                                {emailLogin.length>0 && passwordLogin.length>0?
                                  <button onClick={()=>handleLogin()}>
                                    <span>Login</span>
                                  </button>
                                  :
                                  <button style={{backgroundColor:'#efefef',color:'black'}} disabled onClick={()=>handleLogin()}>
                                    <span>Login</span>
                                  </button>
                                }
                              </div>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <label>Nama</label>
                                  <input
                                    type="text"
                                    name="name"
                                    placeholder="Kevin"
                                    value={profile.name}
                                    onChange={(e)=>handleUserInput(e)}
                                    />
                                    <label>Tgl. Lahir</label>
                                  <input
                                    type="date"
                                    name="birth_date"
                                    value={profile.birth_date}
                                    onChange={(e)=>handleUserInput(e)}
                                    />
                                  <label>No. Telepon</label>
                                  <input
                                    type="text"
                                    name="phone"
                                    placeholder="08123456789"
                                    value={profile.phone}
                                    onChange={(e)=>handleUserInput(e)}
                                    />
                                  <label>Email</label>
                                  <input
                                    name="email"
                                    placeholder="name@email.com"
                                    type="email"
                                    value={profile.email}
                                    onChange={(e)=>handleUserInput(e)}
                                    />
                                  <label>Password</label>
                                  <input
                                    type="password"
                                    name="password"
                                    placeholder=""
                                    value={profile.password}
                                    onChange={(e)=>handleUserInput(e)}
                                    />
                              <div className="button-box">
                                {
                                loading===true?
                                  <button style={{backgroundColor:'#efefef',color:'black'}} disabled >
                                    <span>Sedang Di Proses</span>
                                  </button>
                                :
                                profile.name.length>0 && profile.email.length>0 && profile.phone.length>0 && profile.password.length>0?
                                  <button onClick={()=>handleRegister()}>
                                    <span>Daftar</span>
                                  </button>
                                  :
                                  <button style={{backgroundColor:'#efefef',color:'black'}} disabled >
                                    <span>Daftar</span>
                                  </button>
                                }
                              </div>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

LoginRegister.propTypes = {
  location: PropTypes.object
};

export default LoginRegister;
