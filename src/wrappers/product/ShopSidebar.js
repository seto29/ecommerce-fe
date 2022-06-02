import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  getIndividualCategories,
  getIndividualTags,
  getIndividualColors,
  getProductsIndividualSizes
} from "../../helpers/product";
import ShopSearch from "../../components/product/ShopSearch";
import ShopCategories from "../../components/product/ShopCategories";
import ShopColor from "../../components/product/ShopColor";
import ShopSize from "../../components/product/ShopSize";
import ShopTag from "../../components/product/ShopTag";

const ShopSidebar = ({ products, getSortParams, setSelected, selected, search, fName, setFName,sideSpaceClass, categories, getSubSortParams, subSelected, setSubSelected }) => {
  const uniqueCategories = getIndividualCategories(products);
  const uniqueColors = getIndividualColors(products);
  const uniqueSizes = getProductsIndividualSizes(products);
  const uniqueTags = getIndividualTags(products);
  return (
    <div className={`sidebar-style ${sideSpaceClass ? sideSpaceClass : ""}`}>
      {/* shop search */}
      <ShopSearch 
        getSortParams={getSortParams}
        fName={fName}
        setFName={setFName}
        search={search}
      />

      {/* filter by categories */}
      <ShopCategories
        categories={uniqueCategories}
        categories1={categories}
        getSortParams={getSortParams}
        getSubSortParams={getSubSortParams}
        setSelected={setSelected}
        selected={selected}
        subSelected={subSelected}
        setSubSelected={setSubSelected}
      />

      {/* filter by color */}
      {/* <ShopColor colors={uniqueColors} getSortParams={getSortParams} /> */}

      {/* filter by size */}
      {/* <ShopSize sizes={uniqueSizes} getSortParams={getSortParams} /> */}

      {/* filter by tag */}
      {/* <ShopTag tags={uniqueTags} getSortParams={getSortParams} /> */}
    </div>
  );
};

ShopSidebar.propTypes = {
  getSortParams: PropTypes.func,
  products: PropTypes.array,
  categories: PropTypes.array,
  setSelected: PropTypes.func,
  selected: PropTypes.string,
  fName:PropTypes.string,
  setFName:PropTypes.func,
  search: PropTypes.func,
  getSubSortParams: PropTypes.func,
  subSelected: PropTypes.string,
  setSubSelected: PropTypes.func,
  sideSpaceClass: PropTypes.string
};

export default ShopSidebar;
