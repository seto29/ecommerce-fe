import PropTypes from "prop-types";
import React from "react";
import ls from "local-storage"
import { Link } from "react-router-dom";

const BannerTwentyEight = ({ spaceTopClass, spaceBottomClass }) => {
  return (
    <div
      className={`banner-area ${spaceTopClass ? spaceTopClass : ""} ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <div className="single-banner mb-30">
              <Link to={process.env.PUBLIC_URL + "/shop"}>
                <img
                  src={"http://cdn.hijiofficial.com/home-web/web%201.jpg"
                  }
                  alt=""
                  className="img-fluid"
                />
              </Link>
            </div>
          </div>
          <div className="col-md-4">
            <div className="single-banner mb-30">
              {
                ls.get('user')?
              <Link to={process.env.PUBLIC_URL + "/point-redeem"}>
                <img
                  src={
                    process.env.PUBLIC_URL + "http://cdn.hijiofficial.com/home-web/web%202%20b.jpg"
                  }
                  alt=""
                  className="img-fluid"
                />
              </Link>
                :
              <Link to={process.env.PUBLIC_URL + "/login-register"}>
                <img
                  src={
                    process.env.PUBLIC_URL + "http://cdn.hijiofficial.com/home-web/web%202%20b.jpg"
                  }
                  alt=""
                  className="img-fluid"
                />
              </Link>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BannerTwentyEight.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default BannerTwentyEight;
