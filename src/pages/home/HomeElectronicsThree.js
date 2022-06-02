import React, { Fragment, useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import LayoutOne from "../../layouts/LayoutOne";
import HeroSliderTwentySeven from "../../wrappers/hero-slider/HeroSliderTwentySeven";
import BannerTwentyEight from "../../wrappers/banner/BannerTwentyEight";
import BannerTwentyNine from "../../wrappers/banner/BannerTwentyNine";
import TestimonialTwo from "../../wrappers/testimonial/TestimonialTwo";
import {getAll} from "../../services/Ads"

import PointProductSlider from "../../wrappers/product/PointProductSlider";
// import BrandLogoSliderOne from "../../wrappers/brand-logo/BrandLogoSliderOne";
import CategoryProductGridSixContainer from "../../wrappers/product/CategoryProductGridSixContainer";
import TabProductEighteen from "../../wrappers/product/TabProductEighteen";
import { getTopRated } from "../../services/Products";
import ls from "local-storage"

const HomeElectronicsThree = (props) => {
  const [loading, setLoading] = useState(true);
  const [sliderData, setSlider]=useState([])
  const [newProducts, setNewProducts] = useState([])
  async function getProducts(){
    await getTopRated().then(({newProducts,topSales})=>{
      if(newProducts!==null && newProducts.length>0){
        setNewProducts(newProducts)
      }else{
        setNewProducts([])
      }
      setLoading(false)
    })
  }
  useEffect(()=>{
    if(ls.get('logged')){
      ls.remove('logged')
      window.location.reload()
    }
    
    getAds()
      getProducts()
  },[])

  

  async function getAds(){
    await getAll().then(({ads})=>{
      if(ads!==null && ads.length>0){
        setSlider(ads)
      }else{
        getAds()
      }
    })
  }
  return (
  <>
    {
        loading===false?
    <Fragment>
      <MetaTags>
        <title>Hiji Official Store</title>
        <meta
          name="description"
          content="Hiji Official Store menjual berbagai plastik, sedotan, biji kopi, mesin kopi"
        />
      </MetaTags>
      <LayoutOne headerTop="visible">
        {/* hero slider */}
        <HeroSliderTwentySeven sliderData={sliderData} history={props.history}/>
        {/* banner */}
        {/* <BannerTwentyEight spaceTopClass="pt-100" spaceBottomClass="pb-70" /> */}
        {/* product tab */}
        <CategoryProductGridSixContainer spaceBottomClass="pb-70" />
        <br/>
        <PointProductSlider
          spaceBottomClass="pb-95"
          category={"npne"}
        />
        <TabProductEighteen setLoading={setLoading} newProducts1={newProducts} category="electronics" spaceBottomClass="pb-70" />
        {/* banner */}
        {/* <BannerTwentyNine spaceBottomClass="pb-70" /> */}
        {/* product grid */}
        {/* testimonial */}
        {/* <TestimonialTwo
          spaceTopClass="pt-100"
          spaceBottomClass="pb-95"
          bgColorClass="bg-gray-3"
          backgroundImage="/assets/img/bg/testimonial-bg.jpg"
        /> */}
        {/* brand logo slider */}
        {/* <BrandLogoSliderOne spaceBottomClass="pb-95" spaceTopClass="pt-100" /> */}
      </LayoutOne>
    </Fragment>
    :<div className="flone-preloader-wrapper">
      <div className="flone-preloader">
      <span></span>
      <span></span>
      </div>
  </div>
      }
  </>
  );
};

export default HomeElectronicsThree;
