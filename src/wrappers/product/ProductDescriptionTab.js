import PropTypes from "prop-types";
import React, { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import ls from 'local-storage'
import {fInsert, fInsertReply} from "../../services/ProductDiscussions";

const ProductDescriptionTab = ({ spaceBottomClass, productFullDesc, product, getProducts1 },props) => {
  const [question, setQuestion]=useState("")
  let replies1 = []

  async function handleInsert(e){
    
    await fInsert(question, product.id).then(({success})=>{
      setQuestion("")
      getProducts1()
    })
    // if(e===true){
    // }
  }

  async function handleInsertReply(id, content){
    
    await fInsertReply(id, content).then(({success})=>{
      setQuestion("")
      replies1 = []
      getProducts1()
    })
    // if(e===true){
    // }
  }

  return (
    <div className={`description-review-area ${spaceBottomClass}`}>
      <div className="container">
        <div className="description-review-wrapper">
          <Tab.Container defaultActiveKey="productDescription">
            <Nav variant="pills" className="description-review-topbar">
              <Nav.Item>
                <Nav.Link eventKey="additionalInfo">
                  Spesifikasi
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="productDescription">Deskripsi</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="productReviews">Diskusi</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="description-review-bottom">
              <Tab.Pane eventKey="additionalInfo">
                <div className="product-anotherinfo-wrapper">
                  <ul>
                    <li>
                      <span>Berat</span> {product.weight>0? product.weight+" "+product.mName : '-'} 
                    </li>
                    <li>
                      {/* <span>Dimensi</span>{product.length>0?product.length:"?"} {" x "} {product.width>0?product.width:"?"} {" x "} {product.height>0?product.height:"?"} {product.vName} */}
                    </li>
                    <li>
                      <span>Garansi</span> {product.wName}
                    </li>
                    <li>
                      <span>Kategori</span> {product.cName}
                    </li>
                  </ul>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="productDescription" style={{whiteSpace:'pre-wrap'}}>
                {productFullDesc}
              </Tab.Pane>
              <Tab.Pane eventKey="productReviews">
                <div className="row">
                  <div className="col-lg-7">
                  {
                    product.discussions && product.discussions.map(({id, user_name, content, created_at, replies},i)=>{
                      return (

                          <div className="review-wrapper" key={user_name+content}>
                            <div className="single-review">
                              <div className="review-content">
                                <div className="review-top-wrap">
                                  <div className="review-left">
                                    <div className="review-name">
                                      <h4>{user_name}</h4>
                                    </div>
                                    <div className="review-rating">
                                      {Intl.DateTimeFormat("id-ID", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                        }).format(Date.parse(created_at))}

                                    </div>
                                  </div>
                                </div>
                                <div className="review-bottom">
                                  <p>
                                    {content}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {
                              replies.map(({id, name, content, created_at})=>{
                                return(
                                  <div className="single-review child-review" style={{paddingBottom:'25px'}} key={id}>
                                    <div className="review-content">
                                      <div className="review-top-wrap">
                                        <div className="review-left">
                                          <div className="review-name">
                                            <h4>{name}</h4>
                                          </div>
                                          <div className="review-rating">
                                          {Intl.DateTimeFormat("id-ID", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "numeric",
                                            }).format(Date.parse(created_at))}
                                          </div>
                                        </div>
                                        <div className="review-left">
                                        </div>
                                      </div>
                                      <div className="review-bottom">
                                        <p >
                                          {
                                            content
                                          }
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })
                            }
                            {
                              ls.get('user')?
                                  <div className="single-review child-review" style={{paddingBottom:'10px'}}>
                                    <div className="review-content">
                                      <div className="review-top-wrap">
                                        <div className="review-left">
                                          <div className="review-name">
                                            Balas Komentar
                                          </div>
                                          <div className="review-rating">
                                          </div>
                                        </div>
                                        <div className="review-left">
                                        </div>
                                      </div>
                                      <div className="review-bottom">
                                        <textarea placeholder="balas komentar" value={replies1[i]} onChange={(e)=>replies1[i]=e.target.value}/>
                                        <input type="submit" defaultValue="Submit" onClick={(e)=>handleInsertReply(id, replies1[i])} style={{backgroundColor:'blue', color:'white'}}/>
                                      </div>
                                    </div>
                                  </div>
                              :
                                  <div className="single-review child-review" style={{paddingBottom:'10px'}}>
                                    <div className="review-content">
                                      <div className="review-top-wrap">
                                        <div className="review-left">
                                          <div className="review-name">
                                            Balas Komentar
                                          </div>
                                          <div className="review-rating">
                                          </div>
                                        </div>
                                        <div className="review-left">
                                        </div>
                                      </div>
                                      <div className="review-bottom">
                                        <textarea placeholder="Silahkan Login dahulu sebelum membalas komentar" disabled value={replies1[i]} onChange={(e)=>replies1[i]=e.target.value}/>
                                        <input type="submit" defaultValue="Submit" disabled onClick={(e)=>handleInsertReply(id, replies1[i])} style={{backgroundColor:'gray', color:'white'}}/>
                                      </div>
                                    </div>
                                  </div>
                            }
                            <br/>
                            <br/>
                            <hr/>
                          </div>
                      )
                    })
                  }
                        </div>
                  <div className="col-lg-5">
                    <div className="ratting-form-wrapper pl-50">
                      <h3>Tambahkan Diskusi</h3>
                      <div className="ratting-form">
                        {/* <form onSubmit={handleInsert(question)}> */}
                          <div className="row">
                            <div className="col-md-12">
                              {
                                ls.get('user')?
                                <div className="rating-form-style form-submit">
                                  <textarea
                                    name="Question"
                                    placeholder="Diskusi"
                                    defaultValue={""}
                                    value={question}
                                    onChange={(e)=>setQuestion(e.target.value)}
                                  />
                                  {
                                    question.length>0?
                                    <input type="submit" defaultValue="Submit" onClick={(e)=>handleInsert(e)}/>
                                    :
                                    <input type="submit" defaultValue="Submit" disabled style={{backgroundColor:'gray'}} />
                                  }
                                </div>
                                :
                                <div className="rating-form-style form-submit">
                                  <textarea
                                    name="Question"
                                    placeholder="Silahkan Login dahulu sebelum menambahkan diskusi"
                                    defaultValue={""}
                                    value={question}
                                    disabled
                                    onChange={(e)=>setQuestion(e.target.value)}
                                  />
                                  
                                    <input type="submit" defaultValue="Submit" disabled style={{backgroundColor:'gray'}} />
                                  
                                </div>
                              }
                            </div>
                          </div>
                        {/* </form> */}
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
};

ProductDescriptionTab.propTypes = {
  productFullDesc: PropTypes.string,
  spaceBottomClass: PropTypes.string
};

export default ProductDescriptionTab;
