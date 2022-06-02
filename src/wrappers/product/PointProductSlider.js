import PropTypes from "prop-types";
import ls from "local-storage"
import React from "react";
import {Link
} from "react-router-dom";
import Swiper from "react-id-swiper";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ProductGrid from "./PointProductGrid";

const RelatedProductSlider = ({ spaceBottomClass, category }) => {
  // console.log(category)
  const settings = {
    loop: false,
    slidesPerView: 4,
    grabCursor: true,
    breakpoints: {
      1024: {
        slidesPerView: 4
      },
      768: {
        slidesPerView: 4
      },
      640: {
        slidesPerView: 2
      },
      320: {
        slidesPerView: 2
      }
    }
  };

  return (
    <div
      className={`related-product-area ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <div className="container">
        <div >
          <h3>Hiji Point</h3>
              {/* <button style={{ background:"none",border:"none" }}> */}
                    {/* <span> */}
                <Link to={ls.get('user')?"/point-redeem":"/login-register"} style={{width:'100vw'}}>
                  {/* <div> */}
                    <div style={{width:'80%'}}>

                      <h5>

                        Redeem poin kamu dengan berbagai penawaran menarik
                      <NavigateNextIcon fontSize='large'/>
                      </h5>
                    {/* </div> */}
                    {/* <div styel={{width:'20%'}}> */}
                    {/* </div> */}
                  </div>
                </Link>
                    {/* </span> */}
              {/* </button> */}
        </div>
          <br/>
        <div className="row">
          <Swiper {...settings}>
            <ProductGrid
              category={category}
              limit={6}
              sliderClassName="swiper-slide"
            />
          </Swiper>
        </div>
      </div>
    </div>
  );
};

RelatedProductSlider.propTypes = {
  category: PropTypes.string,
  spaceBottomClass: PropTypes.string
};

export default RelatedProductSlider;
