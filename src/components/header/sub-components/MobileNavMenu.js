import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";

const MobileNavMenu = ({ strings }) => {
  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/"}>Beranda</Link>
        </li>

        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/shop"}>
            Belanja
          </Link>
          {/* <ul className="sub-menu">
            <li className="menu-item-has-children">
              <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                {strings["shop_layout"]}
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                    {strings["shop_grid_standard"]}
                  </Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/shop-grid-filter"}>
                    {strings["shop_grid_filter"]}
                  </Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/shop-grid-two-column"}>
                    {strings["shop_grid_two_column"]}
                  </Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/shop-grid-no-sidebar"}>
                    {strings["shop_grid_no_sidebar"]}
                  </Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/shop-grid-full-width"}>
                    {strings["shop_grid_full_width"]}
                  </Link>
                </li>
                <li>
                  <Link
                    to={process.env.PUBLIC_URL + "/shop-grid-right-sidebar"}
                  >
                    {strings["shop_grid_right_sidebar"]}
                  </Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/shop-list-standard"}>
                    {strings["shop_list_standard"]}
                  </Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/shop-list-full-width"}>
                    {strings["shop_list_full_width"]}
                  </Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/shop-list-two-column"}>
                    {strings["shop_list_two_column"]}
                  </Link>
                </li>
              </ul>
            </li>
            <li className="menu-item-has-children">
              <Link to={process.env.PUBLIC_URL + "/product/1"}>
                {strings["product_details"]}
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to={process.env.PUBLIC_URL + "/product/1"}>
                    {strings["product_tab_bottom"]}
                  </Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/product-tab-left/1"}>
                    {strings["product_tab_left"]}
                  </Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/product-tab-right/1"}>
                    {strings["product_tab_right"]}
                  </Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/product-sticky/1"}>
                    {strings["product_sticky"]}
                  </Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/product-slider/1"}>
                    {strings["product_slider"]}
                  </Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/product-fixed-image/1"}>
                    {strings["product_fixed_image"]}
                  </Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/product/1"}>
                    {strings["product_simple"]}
                  </Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/product/1"}>
                    {strings["product_variation"]}
                  </Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/product/1"}>
                    {strings["product_affiliate"]}
                  </Link>
                </li>
              </ul>
            </li>
          </ul> */}
        </li>
        
        {/* <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/blog"}>
            {strings["blog"]}
          </Link>
        </li> */}
        <li>
          <Link to={process.env.PUBLIC_URL + "/contact"}>
            Hubungi Kami
          </Link>
        </li>
      </ul>
    </nav>
  );
};

MobileNavMenu.propTypes = {
  strings: PropTypes.object
};

export default multilanguage(MobileNavMenu);
