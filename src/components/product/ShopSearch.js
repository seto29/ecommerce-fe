import React from "react";
import { setActiveSort } from "../../helpers/product";

const ShopSearch = ({getSortParams, fName, setFName, search}) => {
  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Cari </h4>
      <div className="pro-sidebar-search mb-50 mt-25">
        <form className="pro-sidebar-search-form" action="#">
          <input type="text" placeholder="" value={fName} onChange={(e)=>{
            setFName(e.target.value)
            // search("name", e.target.value);
            search("name", e.target.value);
          }}/>
          <button
          onClick={e => {
            search("name", e.target.value);
          }}
          >
            <i className="pe-7s-search" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShopSearch;
