import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
// import { connect } from "react-redux";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import RelatedProductSlider from "../../wrappers/product/RelatedProductSlider";
import ProductDescriptionTab from "../../wrappers/product/ProductDescriptionTab";
import ProductImageDescription from "../../wrappers/product/ProductImageDescription";
import { GetDetailByID } from "../../services/Products";

const Product = ({ location, match }) => {
  const { pathname } = location;
  const [product, setProduct] = useState({})
  
  async function getProducts(slug){
    await GetDetailByID(slug).then(({product})=>{
      setProduct(product[0])
    })
  }

  async function getProducts1(){
    await GetDetailByID(match.params.id).then(({product})=>{
      setProduct(product[0])
    })
  }
  
  useEffect(() => {

    getProducts(match.params.id)
  },[match.params.id]);
  return (
    <Fragment>
      <MetaTags>
        <title>Hiji Official Store | {product.name}</title>
        <meta
          name={product.name}
          content={product.description}
        />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Beranda</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/shop"}>Belanja</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Produk
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />

        {/* product description with image */}
        <ProductImageDescription
          spaceTopClass="pt-100"
          spaceBottomClass="pb-100"
          product={product}
        />

        {/* product description tab */}
        <ProductDescriptionTab
          spaceBottomClass="pb-90"
          productFullDesc={product.description}
          product={product}
          getProducts1={getProducts1}
        />

        {/* related product slider */}
        <RelatedProductSlider
          spaceBottomClass="pb-95"
          category={product.category}
        />
      </LayoutOne>
    </Fragment>
  );
};

Product.propTypes = {
  location: PropTypes.object,
  product: PropTypes.object
};

export default (Product);
