import PropTypes from "prop-types";
import React from "react";
import SubscribeEmail from "./sub-components/SubscribeEmail";

const FooterNewsletter = ({
  spaceBottomClass,
  spaceLeftClass,
  sideMenu,
  colorClass,
  widgetColorClass
}) => {
  return (
    <div
      className={`footer-widget ${spaceBottomClass ? spaceBottomClass : ""} ${
        sideMenu ? "ml-ntv5" : spaceLeftClass ? spaceLeftClass : ""
      } ${widgetColorClass ? widgetColorClass : ""}`}
    >
      {/* <div className="footer-title">
        <h3>K</h3>
      </div> */}
      <div className={`subscribe-style ${colorClass ? colorClass : ""}`}>
        <div className="d-lg-none" style={{width:"100%", display:"flex", justifyContent:'space-between'}}>
              <a href="https://play.google.com/store/apps/details?id=com.hijiofficial.hiji" target="_blank">
                <img src="http://cdn.hijiofficial.com/home-web/gp1.png"  style={{width:'170px'}}></img>
              </a>
              <a href="https://apps.apple.com/id/app/hiji-official-store/id1567718045" target="_blank">
                <img src="http://cdn.hijiofficial.com/home-web/as1.png"  style={{width:'170px'}}></img>
              </a>
        </div>
        <div className="d-none d-lg-block" style={{width:"100%"}}>
          <center>
            <div className="mb-3">
              <a href="https://play.google.com/store/apps/details?id=com.hijiofficial.hiji" target="_blank">
                <img src="http://cdn.hijiofficial.com/home-web/gp1.png"  style={{width:'80%'}}></img>
              </a>
            </div>
            <div>
              <a href="https://apps.apple.com/id/app/hiji-official-store/id1567718045" target="_blank">
                <img src="http://cdn.hijiofficial.com/home-web/as1.png"  style={{width:'80%'}}></img>
              </a>
            </div>
          </center>
        </div>
      </div>
    </div>
  );
};

FooterNewsletter.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceLeftClass: PropTypes.string,
  colorClass: PropTypes.string,
  widgetColorClass: PropTypes.string
};

export default FooterNewsletter;
