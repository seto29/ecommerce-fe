import PropTypes from "prop-types";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CCollapse,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFade,
  CForm,
  CFormGroup,
  CFormText,
  CValidFeedback,
  CInvalidFeedback,
  CTextarea,
  CInput,
  CInputFile,
  CInputCheckbox,
  CInputRadio,
  CInputGroup,
  CInputGroupAppend,
  CInputGroupPrepend,
  CDropdown,
  CInputGroupText,
  CLabel,
  CSelect,
  CRow,
  CSwitch
} from '@coreui/react'
import React, { useEffect } from "react";
import { setActiveSort, setActiveSortDefault, setActiveSortIdx } from "../../helpers/product";

const ShopCategories = ({ categories, getSortParams, setSelected, selected, categories1, getSubSortParams, subSelected, setSubSelected }) => {
  
  
  
  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Kategori </h4>
      <div className="sidebar-widget-list mt-30">
        {categories ? (
          <ul>
            <li>
                      {" "}
                      <CInputCheckbox checked={""===selected?true:false} onClick={(e)=>{
                        setSelected("")
                        setSubSelected("")
                        getSortParams("category", "");
                        }}/>{" Semua Kategori "}
            </li>
            {categories1.map((category, key) => {
              // console.log(category)
              return (
                <li key={key}>
                      {" "}
                      <CInputCheckbox checked={category.name===selected?true:false} onClick={(e)=>{
                        setSelected(category.name)
                        setSubSelected("")
                        getSortParams("category", category.name);
                        }}/>{" "}{category.name}{" "}
                        {
                          category.sub.length>0?
                          <ul style={{marginLeft:'2vw'}} hidden={category.name===selected?false:true}>
                            <li key={key+'-001'}>
                                      {" "}
                                      <CInputCheckbox checked={subSelected===""?true:false} onClick={(e)=>{
                                        setSubSelected("")
                                        getSubSortParams("subC", "");
                                        }}/>{" "}{"Semua"}{" "}
                            </li>
                            {
                              category.sub.map((value, index)=>{
                                return(
                                  <li key={key+'-'+index}>
                                      {" "}
                                      <CInputCheckbox checked={value.name===subSelected?true:false} onClick={(e)=>{
                                        setSubSelected(value.name)
                                        getSubSortParams("subC", value.name);
                                        }}/>{" "}{value.name}{" "}
                                  </li>
                                  )
                                })
                            }
                          </ul>
                          :
                          ''
                        }
                </li>
              );
            })}
          </ul>
        ) : (
          "No categories found"
        )}
      </div>
    </div>
  );
};

ShopCategories.propTypes = {
  categories: PropTypes.array,
  getSortParams: PropTypes.func,
  setSelected: PropTypes.string,
  selected: PropTypes.func,
  categories1: PropTypes.array,
  getSubSortParams: PropTypes.func,
  subSelected: PropTypes.string,
  setSubSelected: PropTypes.func,
};

export default ShopCategories;
