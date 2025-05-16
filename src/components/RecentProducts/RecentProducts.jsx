import React, { useContext, useEffect, useState } from 'react';
import style from "./RecentProducts.module.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CartContext } from '../../Context/CartContext';
import toast from 'react-hot-toast';
import { WishListContext } from '../../Context/WishListContext';
import logo from "../../assets/logo.jpg";

export default function RecentProducts({ searchTerm }) {
  const navigate = useNavigate();
  let { addProductToCart,NumOfCartItems, setNumOfCartItems } = useContext(CartContext);
  let { addProductToWishList, deleteWishListItem, getUserLogedWishList } = useContext(WishListContext);
  const [loadingCart, setloadingCart] = useState(false)
  const [currentIdCart, setcurrentIdCart] = useState(0)
  const [loadingWishList, setloadingWishList] = useState(false)
  const [currentIdWishList, setcurrentIdWishList] = useState(0)
  const [wishlist, setWishlist] = useState(new Set());

  
  useEffect(() => {
    async function fetchWishlist() {
      let response = await getUserLogedWishList();
      if (response?.data?.data) {
        setWishlist(new Set(response.data.data.map(item => item.id)));
      }
    }
    fetchWishlist();
  }, []);

  async function toggleWishlist(id) {
    setcurrentIdWishList(id)
    setloadingWishList(true)
    if (wishlist.has(id)) {
      let response = await deleteWishListItem(id);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        setcurrentIdWishList(null)
        setloadingWishList(false)
        setWishlist(prev => {
          const newWishlist = new Set(prev);
          newWishlist.delete(id);
          return newWishlist;
        });
      } else {
        toast.error(response.data.message);
        setcurrentIdWishList(null)
        setloadingWishList(false)
      }
    } else {
      let response = await addProductToWishList(id);
      if (response.data.status === "success") {
        setcurrentIdWishList(null)
        setloadingWishList(false)
        toast.success(response.data.message);
        setWishlist(prev => new Set(prev).add(id));
      } else {
        toast.error(response.data.message);
        setloadingWishList(false)
        setcurrentIdWishList(null)
      }
    }
  }



  async function addTocart (id){
    setcurrentIdCart(id)
    setloadingCart(true)
      let response = await addProductToCart(id)
    
       if(response.data.status === "success"){
        
         toast.success(response.data.message);
         setloadingCart(false)
         setcurrentIdCart(null)
       }
       else{
         toast.error(response.data.message);
         setloadingCart(false)
         setcurrentIdCart(null)
       }}
    

  function handleProductClick(product) {
    navigate(`/ProductDetails/${product.id}/${product.category.name}`);
  }

  function getProducts() {
    return axios.get(`https://ecommerce.routemisr.com/api/v1/products`);
  }

  let { isFetching, isLoading, error, isError, data } = useQuery({
    queryKey: ["recentProduct"],
    queryFn: getProducts,
    staleTime: 100000,
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-90 ">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
  }

  if (isError) {
    console.error("Error fetching data:", error);
    return <h2>Error fetching data. Please try again later.</h2>;
  }

  const filteredProducts = (data?.data?.data || []).filter(product =>
    product?.title?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );

  return (
    <div className="row pt-5 flex flex-wrap gap-5">
      {filteredProducts.length > 0 ? filteredProducts.map((product) => (
        <div
          key={product.id}
          className="relative lg:w-[23%] w-full sm:w-[47%] md:w-[31%] mb-5 duration-500 rounded-md hover:shadow-3xl hover:shadow-[0_2px_10px_rgba(34,197,95,1)] group"
        >
          <div
            onClick={() => handleProductClick(product)}
            style={{ cursor: "pointer" }}
          >
            <img src={product.imageCover} alt="Product" className="h-96 w-full object-cover rounded-t-xl" />
            <div className="px-4 py-3 w-full pb-20">
              <span className="text-green-400 mr-3 text-xs">{product.category.name}</span>
              <h3 className="text-lg text-black truncate block capitalize">
                {product.title.split(" ").slice(0, 2).join(" ")}
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-black">{product.price} EGP</span>
                <span> {product.ratingsAverage} <i className='fas fa-star text-yellow-400'></i></span>
              </div>
            </div>
          </div>
          <div className="absolute left-1/2  -translate-x-1/2 bottom-3 flex items-center w-full ps-6 gap-6 sm:gap-0 ">
            <button onClick={() => addTocart(product.id)}
              className="bg-green-600 text-white py-2   font-serif rounded-xl w-[75%] opacity-0 scale-90 transition-all duration-1000 group-hover:opacity-100 group-hover:scale-100">
              {loadingCart && currentIdCart == product.id ? <i className='fas fa-spinner fa-spin'></i> : "Add To Cart" }
            </button>
            <span onClick={() => toggleWishlist(product.id)}>
            {loadingWishList && currentIdWishList == product.id ? <i className='fas fa-spinner fa-solid fa-heart text-xl cursor-pointer   text-end fa-spin'></i> : <i className={`fa-solid fa-heart text-xl cursor-pointer w-[20%] text-center ${wishlist.has(product.id) ? 'text-red-500' : 'text-gray-400'}`}></i>}
            </span>
          </div>
        </div>
      )) : <p className='w-auto text-green-500 ps-10 text-4xl font-serif'> No products found.</p>}
    </div>
  );
}
