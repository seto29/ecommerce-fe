import PropTypes from "prop-types";
import React, { useEffect, Suspense, lazy } from "react";
import {guestRegister, tokenRecreate} from "./services/User"
import ScrollToTop from "./helpers/scroll-top";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import { multilanguage, loadLanguages } from "redux-multilanguage";
import { connect } from "react-redux";
import { BreadcrumbsProvider } from "react-breadcrumbs-dynamic";

// home pages
const HomeElectronicsThree = lazy(() =>
  import("./pages/home/HomeElectronicsThree")
);
// shop pages
const ShopGridStandard = lazy(() => import("./pages/shop/ShopGridStandard"));
const ShopGridFilter = lazy(() => import("./pages/shop/ShopGridFilter"));
const ShopGridTwoColumn = lazy(() => import("./pages/shop/ShopGridTwoColumn"));
const ShopGridNoSidebar = lazy(() => import("./pages/shop/ShopGridNoSidebar"));
const ShopGridFullWidth = lazy(() => import("./pages/shop/ShopGridFullWidth"));
const ShopGridRightSidebar = lazy(() =>
  import("./pages/shop/ShopGridRightSidebar")
);
const ShopListStandard = lazy(() => import("./pages/shop/ShopListStandard"));
const ShopListFullWidth = lazy(() => import("./pages/shop/ShopListFullWidth"));
const ShopListTwoColumn = lazy(() => import("./pages/shop/ShopListTwoColumn"));

// product pages
const Product = lazy(() => import("./pages/shop-product/Product"));
const ProductTabLeft = lazy(() =>
  import("./pages/shop-product/ProductTabLeft")
);
const ProductTabRight = lazy(() =>
  import("./pages/shop-product/ProductTabRight")
);
const ProductSticky = lazy(() => import("./pages/shop-product/ProductSticky"));
const ProductSlider = lazy(() => import("./pages/shop-product/ProductSlider"));
const ProductFixedImage = lazy(() =>
  import("./pages/shop-product/ProductFixedImage")
);

// blog pages
const BlogStandard = lazy(() => import("./pages/blog/BlogStandard"));
const BlogDetailsStandard = lazy(() =>
  import("./pages/blog/BlogDetailsStandard")
);

// other pages
const About = lazy(() => import("./pages/other/About"));
const Contact = lazy(() => import("./pages/other/Contact"));
const MyAccount = lazy(() => import("./pages/other/MyAccount"));
const CustomOrder = lazy(() => import("./pages/other/CustomOrder"));
const LoginRegister = lazy(() => import("./pages/other/LoginRegister"));

const Cart = lazy(() => import("./pages/other/Cart"));
const Wishlist = lazy(() => import("./pages/other/Wishlist"));
const Compare = lazy(() => import("./pages/other/Compare"));
const Checkout = lazy(() => import("./pages/other/Checkout"));
const Payment = lazy(() => import("./pages/other/Payment"));
const Transactions = lazy(() => import("./pages/other/Transactions"));
const DiscountBalances = lazy(() => import("./pages/other/DiscountBalances"));
const PointRedeem = lazy(() => import("./pages/other/PointRedeem"));
const MemberCard = lazy(() => import("./pages/other/MemberCard"));
const Tracking = lazy(() => import("./pages/other/Tracking"));
const TAC = lazy(() => import("./pages/other/TAC"));
const FAQs = lazy(() => import("./pages/other/FAQs"));
const SC = lazy(() => import("./pages/other/SubCategories"));
const Sample = lazy(() => import("./pages/other/Sample"));

const NotFound = lazy(() => import("./pages/other/NotFound"));

var ls = require('local-storage');

const App = (props) => {
  
  async function handleAddToCart(){
    await guestRegister().then((data)=>{
      ls.remove('token')
      ls.remove('redux_localstorage_simple')
      ls.set('token',data.token)
    })
    window.location.reload()
  }
  
  async function handleRecreate(){
    await tokenRecreate().then((data)=>{
      ls.remove('token')
      ls.set('token',data.token)
    })
  }

  useEffect(() => {
    if(ls.get('token')){
      handleRecreate()
    }else{
      handleAddToCart()
    }
  }, [])

  useEffect(() => {
  props.dispatch(
      loadLanguages({
        languages: {
          id: require("./translations/indonesia.json"),
          en: require("./translations/english.json"),
          fn: require("./translations/french.json"),
          de: require("./translations/germany.json"),
        }
      })
    );
  });

  return (
    <ToastProvider placement="bottom-left">
      <BreadcrumbsProvider>
        <Router>
          <ScrollToTop>
            <Suspense
              fallback={
                <div className="flone-preloader-wrapper">
                  <div className="flone-preloader">
                    <span></span>
                    <span></span>
                  </div>
                </div>
              }
            >
              <Switch>
                <Route
                  exact
                  path={process.env.PUBLIC_URL + "/"}
                  component={HomeElectronicsThree}
                />
                
                {/* Shop pages */}
                <Route
                  path={process.env.PUBLIC_URL + "/shop"}
                  component={ShopGridStandard}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/shop-grid-filter"}
                  component={ShopGridFilter}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/shop-grid-two-column"}
                  component={ShopGridTwoColumn}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/shop-grid-no-sidebar"}
                  component={ShopGridNoSidebar}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/shop-grid-full-width"}
                  component={ShopGridFullWidth}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/shop-grid-right-sidebar"}
                  component={ShopGridRightSidebar}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/shop-list-standard"}
                  component={ShopListStandard}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/shop-list-full-width"}
                  component={ShopListFullWidth}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/shop-list-two-column"}
                  component={ShopListTwoColumn}
                />

                {/* Shop product pages */}
                <Route
                  path={process.env.PUBLIC_URL + "/product/:id"}
                  render={(routeProps) => (
                    <Product {...routeProps} key={routeProps.match.params.id} />
                  )}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/product-tab-left/:id"}
                  component={ProductTabLeft}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/product-tab-right/:id"}
                  component={ProductTabRight}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/product-sticky/:id"}
                  component={ProductSticky}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/product-slider/:id"}
                  component={ProductSlider}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/product-fixed-image/:id"}
                  component={ProductFixedImage}
                />

                {/* Blog pages */}
                <Route
                  path={process.env.PUBLIC_URL + "/blog"}
                  component={BlogStandard}
                />
                {/* <Route
                  path={process.env.PUBLIC_URL + "/blog-no-sidebar"}
                  component={BlogNoSidebar}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/blog-right-sidebar"}
                  component={BlogRightSidebar}
                /> */}
                <Route
                  path={process.env.PUBLIC_URL + "/blog-details-standard"}
                  component={BlogDetailsStandard}
                />

                {/* Other pages */}
                <Route
                  path={process.env.PUBLIC_URL + "/about"}
                  component={About}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/contact"}
                  component={Contact}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/my-account"}
                  component={MyAccount}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/custom-order"}
                  component={CustomOrder}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/login-register"}
                  component={LoginRegister}
                />

                <Route
                  path={process.env.PUBLIC_URL + "/cart"}
                  component={Cart}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/wishlist"}
                  component={Wishlist}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/compare"}
                  component={Compare}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/checkout"}
                  component={Checkout}
                />

                <Route
                  path={process.env.PUBLIC_URL + "/payment"}
                  component={Payment}
                />

                <Route
                  path={process.env.PUBLIC_URL + "/transactions"}
                  component={Transactions}
                />

                <Route
                  path={process.env.PUBLIC_URL + "/discount-balances"}
                  component={DiscountBalances}
                />

                <Route
                  path={process.env.PUBLIC_URL + "/point-redeem"}
                  component={PointRedeem}
                />

                <Route
                  path={process.env.PUBLIC_URL + "/member-card"}
                  component={MemberCard}
                />
                
                <Route
                  path={process.env.PUBLIC_URL + "/tracking"}
                  component={Tracking}
                />

                <Route
                  path={process.env.PUBLIC_URL + "/TAC"}
                  component={TAC}
                />

                <Route
                  path={process.env.PUBLIC_URL + "/FAQs"}
                  component={FAQs}
                />

                <Route
                  path={process.env.PUBLIC_URL + "/sub-categories"}
                  component={SC}
                />

                <Route
                  path={process.env.PUBLIC_URL + "/sample"}
                  component={Sample}
                />

                <Route
                  path={process.env.PUBLIC_URL + "/not-found"}
                  component={NotFound}
                />

                <Route exact component={NotFound} />
              </Switch>
            </Suspense>
          </ScrollToTop>
        </Router>
      </BreadcrumbsProvider>
    </ToastProvider>
  );
};

App.propTypes = {
  dispatch: PropTypes.func
};

export default connect()(multilanguage(App));
