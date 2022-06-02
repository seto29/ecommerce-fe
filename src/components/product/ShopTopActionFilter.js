import PropTypes from "prop-types";
import React, { Fragment } from "react";
import ShopTopFilter from "./ShopTopFilter";
import { toggleShopTopFilter } from "../../helpers/product";

const ShopTopActionFilter = ({
  getFilterSortParams,
  productCount,
  sortedProductCount,
  products,
  getSortParams
}) => {
  return (
    <Fragment>
      <div className="shop-top-bar mb-35">
        <div className="select-shoing-wrap">
          <div className="shop-select">
            <select
              onChange={e => getFilterSortParams("filterSort", e.target.value)}
            >
              <option value="default">Default</option>
              <option value="priceHighToLow">Harga - Tinggi ke Rendah</option>
              <option value="priceLowToHigh">Harga - Rendah ke Tinggi</option>
            </select>
          </div>
          <p>
            Menunjukkan {sortedProductCount} dari {productCount} hasil
          </p>
        </div>

        <div className="filter-active">
          <button onClick={e => toggleShopTopFilter(e)}>
            <i className="fa fa-plus"></i> filter
          </button>
        </div>
      </div>

      {/* shop top filter */}
      <ShopTopFilter products={products} getSortParams={getSortParams} />
    </Fragment>
  );
};

ShopTopActionFilter.propTypes = {
  getFilterSortParams: PropTypes.func,
  getSortParams: PropTypes.func,
  productCount: PropTypes.number,
  products: PropTypes.array,
  sortedProductCount: PropTypes.number
};

export default ShopTopActionFilter;
