import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from 'react';
import MetaTags from 'react-meta-tags';
import Paginator from 'react-hooks-paginator';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { connect } from 'react-redux';
import { getSortedProducts } from '../../helpers/product';
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import ShopSidebar from '../../wrappers/product/ShopSidebar';
import ShopTopbar from '../../wrappers/product/ShopTopbar';
import ShopProducts from '../../wrappers/product/ShopProducts';
import { getAll } from "../../services/Products";
import { getAll as getAllC, getDefaultImage} from "../../services/Categories";

// import { setActiveSortDefault } from "../../helpers/product";

const ShopGridStandard = (props) => {
    const [layout, setLayout] = useState('grid three-column');
    const [sortType, setSortType] = useState('');
    const [sortValue, setSortValue] = useState('');
    const [sortSubType, setSortSubType] = useState('');
    const [sortSubValue, setSortSubValue] = useState('');
    const [searchType, setSearchType] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [filterSortType, setFilterSortType] = useState('');
    const [filterSortValue, setFilterSortValue] = useState('');
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [selected, setSelected] = useState("");
    const [subSelected, setSubSelected] = useState("");
    const [selected1, setSelected1] = useState(false);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [defaultI, setDefaultI] = useState("");

    const [fName, setFName] = useState("");
    const pageLimit = 15;
    const {pathname} = props.location;

    const getLayout = (layout) => {
        setLayout(layout)
    }

    const getSortParams = (sortType, sortValue) => {
        setSortType(sortType);
        setSortValue(sortValue);
    }

    const getSubSortParams = (sortType, sortValue) => {
        setSortSubType(sortType);
        setSortSubValue(sortValue);
    }
    
    const search = (sortType, sortValue) => {
        setSearchType(sortType);
        setSearchValue(sortValue);
    }
    
    const getFilterSortParams = (sortType, sortValue) => {
        setFilterSortType(sortType);
        setFilterSortValue(sortValue);
    }
    
    useEffect(()=>{
        const selectSelected = async()=>{
            await setSortType('category');
            await setSelected(props.history.location.state?props.history.location.state.data:"");
            await setSortValue(props.history.location.state?props.history.location.state.data:"");
            return "a"
        }
        selectSelected()
        setSortSubType('subC');
        setSubSelected(props.history.location.state && props.history.location.state.data1?props.history.location.state.data1:"");
        setSortSubValue(props.history.location.state && props.history.location.state.data1?props.history.location.state.data1:"");
    },[])

    useEffect(() => {
        let sortedProducts = getSortedProducts(products, searchType, searchValue);
        let sortedProducts1 = getSortedProducts(sortedProducts, sortType, sortValue);
        let sortedProducts2 = getSortedProducts(sortedProducts1, sortSubType, sortSubValue);
        const filterSortedProducts = getSortedProducts(sortedProducts2, filterSortType, filterSortValue);
        sortedProducts = filterSortedProducts;
        setSortedProducts(sortedProducts);
        setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
    }, [offset, products, sortType, sortValue, filterSortType, filterSortValue, searchType, searchValue, sortSubType, sortSubValue ]);

    async function getProducts(){
        await getAll().then(({products})=>{
            setProducts(products)
            setLoading(false)
        })
      }

    async function getCat(){
        await getAllC().then(({categories})=>{
            setCategories(categories)
            // setLoading(false)
        })
      }

    async function getDef(){
        await getDefaultImage().then(({image})=>{
            setDefaultI(image)
            // setLoading(false)
        })
      }
    
    useEffect(() => {
        getProducts()
        getCat()
        getDef()
    },[]);

    return (
        <>
        {
            loading===false?
        <Fragment>
            <MetaTags>
                <title>Hiji Official Store | Halaman Belanja</title>
                <meta name="description" content="Halaman Belanja Hiji Official" />
            </MetaTags>
            
            

            <BreadcrumbsItem to={process.env.PUBLIC_URL + '/'}>Beranda</BreadcrumbsItem>
            <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>Belanja</BreadcrumbsItem>

            <LayoutOne headerTop="visible">
                {/* breadcrumb */}
                <div hidden={selected==="Custom Order"?false:true}>
                <button
              onClick={()=>props.history.push('/custom-order')}
              style={{width:'33.33%',
              border: '1px solid #24446c',
              backgroundColor: '#24446c',
              borderTopColor: '#24446c',
              borderLeftColor: '#24446c',
              color: '#fff',
              height:'7vh',
              cursor: 'pointer'}}>
              Form
            </button>
            <button 
              onClick={()=>props.history.push('/sample')}
            style={{width:'33.33%',
              border: '1px solid #24446c',
              borderTopColor: '#24446c',
              borderRightColor: '#24446c',
              backgroundColor: '#24446c',
              color: '#fff',
              height:'7vh',
              cursor: 'pointer'}}>
              Sample
            </button>
            
            <button 
              style={{width:'33.33%',
              border: '1px solid #24446c',
              borderTopColor: '#24446c',
              backgroundColor: '#24446c',
              color: '#e3ca09',
              height:'7vh',
              cursor: 'pointer'}}>
              <u>Pesanan</u>
            </button>
            </div>
                <Breadcrumb />

                <div className="shop-area pt-95 pb-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 order-2 order-lg-1">
                                {/* shop sidebar */}
                                <ShopSidebar products={products} getSortParams={getSortParams} setSelected={setSelected} selected={selected} search={search} fName={fName} setFName={setFName} categories={categories} getSubSortParams={getSubSortParams} setSubSelected={setSubSelected} subSelected={subSelected} sideSpaceClass="mr-30"/>
                            </div>
                            <div className="col-lg-9 order-1 order-lg-2">
                                {/* shop topbar default */}
                                <ShopTopbar getLayout={getLayout} getFilterSortParams={getFilterSortParams} productCount={products.length} sortedProductCount={currentData.length} />

                                {/* shop page content default */}
                                <ShopProducts layout={layout} products={currentData} />

                                {/* shop product pagination */}
                                <div className="pro-pagination-style text-center mt-30">
                                    <Paginator
                                        totalRecords={sortedProducts.length}
                                        pageLimit={pageLimit}
                                        pageNeighbours={2}
                                        setOffset={setOffset}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        pageContainerClass="mb-0 mt-0"
                                        pagePrevText="«"
                                        pageNextText="»"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutOne>
        </Fragment>
                :<div className="flone-preloader-wrapper">
                <div className="flone-preloader">
                <span></span>
                <span></span>
                </div>
            </div>
                }
            </>
    )
}

ShopGridStandard.propTypes = {
  location: PropTypes.object,
  products: PropTypes.array
}

const mapStateToProps = state => {
    return{
        products: state.productData.products
    }
}

export default connect(mapStateToProps)(ShopGridStandard);