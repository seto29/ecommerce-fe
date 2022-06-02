import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import {GetByID, Update, UpdatePassword} from "../../services/User"
import ls from "local-storage"

const MyAccount = ({ location }) => {
  const { pathname } = location;
  const [profile, setProfile] = useState({})
  const [password, setPassword] = useState("")
  const [dis1, setDis1] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  

  async function fetchVouchers(){
    const res = await GetByID()
    setProfile(res.detail)
    setDis1(res.detail.birth_date===null || res.detail.birth_date==="null" || res.detail.birth_date==="0000-00-00" ? false:true)
  }

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
  
async function handleUpdate(){
  await Update(profile.name, profile.phone, profile.email, profile.birth_date).then((data)=>{
    if(data.status===200){
      ls.remove('token')
      ls.remove('user')
      ls.set('token',data.token)
      ls.set('user',data.token)
      fetchVouchers()
      alert('Berhasil Mengubah Data')
      // history.push('/')
    }else{
      alert('Gagal Mengubah Data')
    }
  })
}

async function handleUpdatePassword(){
  await UpdatePassword(oldPassword, password).then((data)=>{
    if(data.status===200){
      ls.remove('token')
      ls.remove('user')
      ls.set('token',data.token)
      ls.set('user',data.token)
      setOldPassword("")
      setPassword("")
      // history.push('/')
    }
      alert(data.msg)
  })
}

  useEffect(() => {
    fetchVouchers()
  }, [])

  return (
    <Fragment>
      <MetaTags>
        <title>Hiji Official Store | Akun Saya</title>
        <meta
          name="Akun Hiji Official Store"
          content="Akun Saya"
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Beranda</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Akun Saya
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="ml-auto mr-auto col-lg-9">
                <div className="myaccount-wrapper">
                  <Accordion defaultActiveKey="0">
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="0">
                          <h3 className="panel-title">
                            <span>1 .</span> Edit Informasi Akun{" "}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>Informasi Akun Saya</h4>
                            </div>
                            <div className="row">
                              <div className="col-sm-12">
                                <div className="billing-info">
                                  <label>Nama</label>
                                  <input type="text" name="name" value={profile.name} onChange={(e)=>handleUserInput(e)}/>
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
                                  <label>No. Telepon</label>
                                  <input type="text" name="phone" value={profile.phone} onChange={(e)=>handleUserInput(e)}/>
                                </div>
                              </div>
                              <div className="col-sm-12">
                                <div className="billing-info">
                                  <label>Tanggal Lahir</label>
                                  <input type="date" disabled={dis1} name="birth_date" value={profile.birth_date} onChange={(e)=>handleUserInput(e)}/>
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button onClick={()=>handleUpdate()} type="submit">Simpan</button>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="1">
                          <h3 className="panel-title">
                            <span>2 .</span> Ubah Password Akun
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>Ubah Password</h4>
                            </div>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Password Lama</label>
                                  <input type="password" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)}/>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Password</label>
                                  <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button onClick={()=>handleUpdatePassword()} type="submit">Simpan</button>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    {/* <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="2">
                          <h3 className="panel-title">
                            <span>3 .</span> Modify your address book entries{" "}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="2">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>Address Book Entries</h4>
                            </div>
                            <div className="entries-wrapper">
                              <div className="row">
                                <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                                  <div className="entries-info text-center">
                                    <p>John Doe</p>
                                    <p>Paul Park </p>
                                    <p>Lorem ipsum dolor set amet</p>
                                    <p>NYC</p>
                                    <p>New York</p>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                                  <div className="entries-edit-delete text-center">
                                    <button className="edit">Edit</button>
                                    <button>Delete</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="submit">Continue</button>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card> */}
                  </Accordion>
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
