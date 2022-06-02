import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

const HeroSliderTwentySevenSingle = ({ data, sliderClass, history }) => {
  console.log(data)
  return (
    <div
      className={`single-slider-2 slider-height-1 d-flex align-items-center slider-height-res hm-13-slider ${
        sliderClass ? sliderClass : ""
      }`}
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + data.image})`,backgroundRepeat:'no-repeat',backgroundSize:'cover'
      }}
      onClick={(e)=>data.product_id!==null?history.push('/product/'+data.product.slug):data.category_id!==null?history.push({pathname:'/shop', state:{data:data.category.name}}):data.link!==null? window.location.href =(data.link):""}
    >
    </div>
  );
};

HeroSliderTwentySevenSingle.propTypes = {
  data: PropTypes.object,
  sliderClass: PropTypes.string
};

export default HeroSliderTwentySevenSingle;
