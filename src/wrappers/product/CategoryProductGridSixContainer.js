import React from "react";
import CategoryProductGridSix from "./CategoryProductGridSix";

const ProductGridSixContainer = ({ spaceBottomClass }) => {
  return (
    <div
      className={`product-grid-six-container ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <div className="container">
        <br/>
        <center>
          <h3>
          Belanja Apa Hari Ini?
          </h3>
        </center>
        <br/>
        <div className="row">
          <CategoryProductGridSix
            category="electronics"
            limit={15}
            spaceBottomClass="mb-25"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductGridSixContainer;
