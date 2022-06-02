import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SectionTitleSix from "../../components/section-title/SectionTitleSix";
import ProductGridSeven from "./ProductGridSeven";
import { getTopRated } from "../../services/Products";

const TabProductEighteen = ({
  newProducts1,
  setLoading,
  spaceTopClass,
  spaceBottomClass,
  category,
  containerClass,
  extraClass
}, props) => {
  const [newProducts, setNewProducts] = useState(newProducts1)
  // const [topSalesProducts, setTopSalesProducts] = useState([])
  
  async function getProducts(){
    // await getTopRated().then(({newProducts,topSales})=>{
    //   if(newProducts!==null && newProducts.length>0){
    //     setNewProducts(newProducts)
    //   }else{
    //     setNewProducts([])
    //   }
      
    //   setLoading(false)
    //   // if(topSales!==null && topSales.length>0){
    //   //   setTopSalesProducts(topSales)
    //   //   console.log("asu")
    //   // }else{
    //   //   setTopSalesProducts([])
    //   // }

    //   if(topSales===null || topSales.length=== 0 || newProducts===null || newProducts.length===0){
    //     getProducts()
    //   }
    // })
  }
  useEffect(() => {
    getProducts()
  },[props]);
  return (
    <div
      className={`product-area ${spaceTopClass ? spaceTopClass : ""} ${
        spaceBottomClass ? spaceBottomClass : ""
      } ${extraClass ? extraClass : ""}`}
    >
      <div className={`${containerClass ? containerClass : "container"}`}>
        <Tab.Container defaultActiveKey="newArrival">
          <div className="row mb-60 align-items-center">
            <div className="col-lg-6">
              <h3>Terbaru</h3>
            </div>
            <div className="col-lg-6">
              <Nav
                variant="pills"
                className="product-tab-list product-tab-list--style2 justify-content-start justify-content-lg-end"
              >
                <Nav.Item>
                  <Nav.Link eventKey="newArrival">
                    {/* <h4>Produk Terbaru</h4> */}
                  </Nav.Link>
                </Nav.Item>
                {/* <Nav.Item>
                  <Nav.Link eventKey="bestSeller">
                    <h4>Best Sellers</h4>
                  </Nav.Link>
                </Nav.Item> */}
                {/* <Nav.Item>
                  <Nav.Link eventKey="saleItems">
                    <h4>Sale Items</h4>
                  </Nav.Link>
                </Nav.Item> */}
              </Nav>
            </div>
          </div>

          <Tab.Content>
            <Tab.Pane eventKey="newArrival">
              <div className="row">
                <ProductGridSeven
                  products={newProducts}
                  type="new"
                  limit={8}
                  spaceBottomClass="mb-25"
                />
              </div>
            </Tab.Pane>
            {/* <Tab.Pane eventKey="bestSeller">
              <div className="row">
                <ProductGridSeven
                  products={topSalesProducts}
                  type="bestSeller"
                  limit={8}
                  spaceBottomClass="mb-25"
                />
              </div>
            </Tab.Pane> */}
            {/* <Tab.Pane eventKey="saleItems">
              <div className="row">
                <ProductGridSeven
                  products={products}
                  type="saleItems"
                  limit={8}
                  spaceBottomClass="mb-25"
                />
              </div>
            </Tab.Pane> */}
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

TabProductEighteen.propTypes = {
  newProducts1: PropTypes.array,
  setLoading: PropTypes.func,
  category: PropTypes.string,
  containerClass: PropTypes.string,
  extraClass: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default TabProductEighteen;
