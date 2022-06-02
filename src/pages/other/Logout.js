import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import {Login} from "../../services/User"
import ls from 'local-storage'
const LoginRegister = ({ location, history }) => {
  const { pathname } = location;
  const [emailLogin, setEmailLogin] = useState("")
  const [passwordLogin, setPasswordLogin] = useState("")
  const [errorLogin, setErrorLogin] = useState("")

  async function handleLogin(){
      await Login(emailLogin, passwordLogin).then((data)=>{
        if(data.status===200){
          ls.remove('token')
          ls.remove('user')
          ls.set('token',data.token)
          ls.set('user',data.token)
        }else{
          setErrorLogin("error")
          setTimeout(() => {
            setErrorLogin("")
          }, 2500);
        }
      })
  }

  useEffect(()=>{
    ls.remove('token')
    ls.remove('user')
    ls.remove('redux_localstorage_simple')
    history.push("/login-register")
  },[])
  return (
    <Fragment>
      <MetaTags>
        <title>Hiji Official Store | Login</title>
        <meta
          name="description"
          content="Compare page of flone ."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Beranda</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Login Register
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
                          <h4>Register</h4>
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
                              <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                value={emailLogin}
                                onChange={(e)=>setEmailLogin(e.target.value)}
                                />
                              <input
                                type="password"
                                name="password"
                                placeholder="Password"
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
                            <form>
                              <input
                                type="text"
                                name="user-name"
                                placeholder="Username"
                              />
                              <input
                                type="password"
                                name="user-password"
                                placeholder="Password"
                              />
                              <input
                                name="user-email"
                                placeholder="Email"
                                type="email"
                              />
                              <div className="button-box">
                                <button type="submit">
                                  <span>Register</span>
                                </button>
                              </div>
                            </form>
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
