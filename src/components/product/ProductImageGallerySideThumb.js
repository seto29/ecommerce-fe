import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { LightgalleryProvider, LightgalleryItem } from "react-lightgallery";
import Swiper from "react-id-swiper";

const ProductImageGalleryLeftThumb = ({ product, thumbPosition }) => {
  const [gallerySwiper, getGallerySwiper] = useState(null);
  const [thumbnailSwiper, getThumbnailSwiper] = useState(null);

  // effect for swiper slider synchronize
  useEffect(() => {
    if (
      gallerySwiper !== null &&
      gallerySwiper.controller &&
      thumbnailSwiper !== null &&
      thumbnailSwiper.controller
    ) {
      gallerySwiper.controller.control = thumbnailSwiper;
      thumbnailSwiper.controller.control = gallerySwiper;
    }
  }, [gallerySwiper, thumbnailSwiper]);

  // swiper slider settings
  const gallerySwiperParams = {
    getSwiper: getGallerySwiper,
    spaceBetween: 10,
    loopedSlides: 4,
    loop: true,
  };

  const thumbnailSwiperParams = {
    getSwiper: getThumbnailSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    loopedSlides: 4,
    touchRatio: 0.2,
    freeMode: true,
    loop: true,
    slideToClickedSlide: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    renderPrevButton: () => (
      <button className="swiper-button-prev ht-swiper-button-nav">
        <i className="pe-7s-angle-left" />
      </button>
    ),
    renderNextButton: () => (
      <button className="swiper-button-next ht-swiper-button-nav">
        <i className="pe-7s-angle-right" />
      </button>
    )
  };

  return (
    <Fragment>
      <div className="row row-5">
          <div className="product-large-image-wrapper">
            <LightgalleryProvider>
              <Swiper {...gallerySwiperParams}>
                {product.images &&
                  product.images.map((single, key) => {
                    return (
                      <div key={key}>
                        <LightgalleryItem
                          group="any"
                          src={process.env.PUBLIC_URL + single}
                        >
                          <button>
                            <i className="pe-7s-expand1"></i>
                          </button>
                        </LightgalleryItem>
                        <div className="single-image">
                          <img
                            src={process.env.PUBLIC_URL + single}
                            className="img-fluid"
                            alt=""
                          />
                        </div>
                      </div>
                    );
                  })}
              </Swiper>
            </LightgalleryProvider>
          </div>
          {/* <div className="product-small-image-wrapper mt-15">
              {product.images.length<3?
                <Swiper {...thumbnailSwiperParams}>
                  {
                  product.images &&
                    product.images.map((single, key) => {
                      return (
                        <div key={key}>
                          <div className="single-image">
                            <img
                              src={single}
                              className="img-fluid"
                              alt="thum"
                            />
                          </div>
                        </div>
                      );
                    })
                  }
                  {
                  product.images &&
                    product.images.map((single, key) => {
                      return (
                        <div key={key}>
                          <div className="single-image">
                            <img
                              src={single}
                              className="img-fluid"
                              alt="thum"
                            />
                          </div>
                        </div>
                      );
                    })
                  }
                </Swiper>
                :
                <Swiper {...thumbnailSwiperParams}>
                  {
                  product.images &&
                    product.images.map((single, key) => {
                      return (
                        <div key={key}>
                          <div className="single-image">
                            <img
                              src={single}
                              className="img-fluid"
                              alt="thum"
                            />
                          </div>
                        </div>
                      );
                    })
                  }
                </Swiper>
              }
              </div> */}
        </div>
    </Fragment>
  );
};

ProductImageGalleryLeftThumb.propTypes = {
  product: PropTypes.object,
  thumbPosition: PropTypes.string
};

export default ProductImageGalleryLeftThumb;
