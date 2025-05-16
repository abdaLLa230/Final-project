 import React, { useContext, useEffect, useState } from 'react';
 import style from "./ProductDetails.module.css";
 import { Link, useParams } from 'react-router-dom';
 import axios from 'axios';
 import Slider from "react-slick";
 import toast from 'react-hot-toast';
 import { CartContext } from '../../Context/CartContext';
 import { WishListContext } from '../../Context/WishListContext';
 import logo from "../../assets/logo.jpg";

 export default function ProductDetails() {
   const [Product, setProduct] = useState(null);
   const [RelatedProducts, setRelatedProducts] = useState([]);
   const [wishlist, setWishlist] = useState({});
   const [loadingWishlist, setLoadingWishlist] = useState(false);
   const [currentWishlistId, setCurrentWishlistId] = useState(null);
   const [loadingCart, setLoadingCart] = useState(false);
   const [currentCartId, setCurrentCartId] = useState(null);
  
  
  
  

   let { category, id } = useParams();
   let { addProductToCart } = useContext(CartContext);
   let { addProductToWishList, deleteWishListItem, getUserLogedWishList } = useContext(WishListContext);

   useEffect(() => {
     async function fetchWishlist() {
       let response = await getUserLogedWishList();
       if (response?.data?.data) {
         const wishlistData = {};
         response.data.data.forEach(item => {
           wishlistData[item.id] = true;
         });
         setWishlist(wishlistData);
       }
     }
     fetchWishlist();
   }, []);

async function toggleWishlist(id) {
  setCurrentWishlistId(id);
  setLoadingWishlist(true);

  if (wishlist[id]) {
    let response = await deleteWishListItem(id);
    if (response.data.status === "success") {
      toast.success(response.data.message);
      setWishlist(prev => {
        const newWishlist = { ...prev };
        delete newWishlist[id];
        return newWishlist;
      });
    } else {
      toast.error(response.data.message);
    }
  } else {
    let response = await addProductToWishList(id);
    if (response.data.status === "success") {
      toast.success(response.data.message);
      setWishlist(prev => ({
        ...prev,
        [id]: true
      }));
    } else {
      toast.error(response.data.message);
    }
  }

  setLoadingWishlist(false);
  setCurrentWishlistId(null);
}

async function addTocart(id) {
  setCurrentCartId(id);
  setLoadingCart(true);

  let response = await addProductToCart(id);
  if (response.data.status === "success") {
    toast.success(response.data.message);
  } else {
    toast.error(response.data.message);
  }

  setLoadingCart(false);
  setCurrentCartId(null);
}

   var settings = {
     dots: true,
     infinite: true,
     speed: 500,
     slidesToShow: 1,
     slidesToScroll: 1,
     autoplay: true,
     autoplaySpeed: 2000,
   };

   function getProduct(id) {
     axios.get(`https:ecommerce.routemisr.com/api/v1/products/${id}`)
       .then((res) => {
         setProduct(res.data.data);
         console.log(res);
       })
       .catch(() => {});
   }

   function getAllproduct() {
     axios.get(`https:ecommerce.routemisr.com/api/v1/products`)
       .then((res) => {
         let related = res.data.data.filter((product) => product.category.name === category);
         
         
         setRelatedProducts(related);
       })
       .catch((error) => {
         console.error("Error fetching related products:", error);
       });
   }

   useEffect(() => {
     getProduct(id);
     getAllproduct();
   }, [id, category]);

   return (
     <>
       {RelatedProducts.length > 0 ?
         <div className="w-full md:max-w-6xl md:w-[90%] p-6 flex flex-col md:flex-row items-center gap-6 md:gap-10 mx-auto">
           <div className="w-full md:w-1/3 justify-center">
             <Slider {...settings}>
               {Product?.images.map((src, index) => (
                 <img key={index} src={src} className='w-full object-cover' alt="Product" />
               ))}
             </Slider>
           </div>

           <div className="w-full md:w-[70%] space-y-3 lg:pt-5 text-start md:pl-10">
             <h1 className="text-3xl font-bold">{Product?.title}</h1>
             <p className="text-gray-500">{Product?.description}</p>
             <h4 className="flex justify-start pt-10 text-green-500 w-40 font-medium">
               {Product?.category.name}
             </h4>

             <div className="flex justify-between items-center w-full">
               <span className="text-xl font-mono text-gray-700">{Product?.price} EGP</span>
               <span className="flex items-center gap-1">
                 {Product?.ratingsAverage} <i className="fas text-yellow-400 fa-star"></i>
               </span>
             </div>

             <div className="flex items-center justify-center md:justify-between pt-4 w-full gap-8 md:gap-2">
               <button onClick={() => addTocart(Product.id)} className="bg-green-600 text-white py-2 px-8 font-serif rounded-md w-[90%] opacity-100 scale-100 transition-all duration-300 hover:bg-green-700">
               {loadingCart && currentCartId === Product.id ? <i className='fas fa-spinner fa-spin'></i> : "Add To Cart" }
               </button>
               <span onClick={() => toggleWishlist(Product.id)}>
                {loadingWishlist && currentWishlistId === Product.id ? <i className='fas fa-spinner fa-solid fa-heart text-xl cursor-pointer   text-end fa-spin'></i>:<i className={`fa-solid fa-heart text-xl cursor-pointer w-[20%] text-center ${wishlist[Product.id] ? 'text-red-500' : 'text-gray-400'}`}></i> }
               </span>
             </div>
           </div>
         </div>
         : null
       }

       <div className="row flex pt-16 flex-wrap gap-5">
         {RelatedProducts.length > 0 ? RelatedProducts.map((product) => (
           <div 
             key={product.id} 
             className="relative lg:w-[23%] w-full sm:w-[47%] md:w-[31%] mb-5 duration-500 rounded-md hover:shadow-3xl hover:shadow-[0_2px_10px_rgba(34,197,95,1)] group"
           >
             <Link to={`/ProductDetails/${product.id}/${product.category.name}`} >
               <img src={product.imageCover} alt="Product" className="h-96 w-full object-cover rounded-t-xl" />
               <div className="px-4 py-3 w-full pb-20">
                 <span className="text-green-400 mr-3 text-xs">{product.category.name}</span>
                 <h3 className="text-lg text-black truncate block capitalize">
                   {product.title.split(" ").slice(0, 2).join(" ")}
                 </h3>
                 <div className="flex justify-between items-center">
                   <span className="text-lg font-mono text-gray-700">{product.price} EGP</span>
                   <span> {product.ratingsAverage} <i className='fas fa-star text-yellow-400'></i></span>
                 </div>
               </div>
             </Link>
             <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex items-center w-[90%] gap-2">
               <button onClick={() => addTocart(product.id)} className="bg-green-600 text-white py-2 px-4 font-serif rounded-md w-[80%] opacity-0 scale-90 transition-all duration-1000 group-hover:opacity-100 group-hover:scale-100">
               {loadingCart && currentCartId === product.id ? <i className='fas fa-spinner fa-spin'></i> : "Add To Cart" }
               </button>
               <span onClick={() => toggleWishlist(product.id)}>
               {loadingWishlist && currentWishlistId === product.id ?  <i className='fas fa-spinner fa-solid fa-heart text-xl cursor-pointer   text-end fa-spin'></i> : <i className={`fa-solid fa-heart text-xl cursor-pointer w-[20%] text-center ${wishlist[product.id] ? 'text-red-500' : 'text-gray-400'}`}></i> }
              
               </span>
             </div>
           </div>
         )) : (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-90 ">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        
         )}
       </div>
     </>
   );
 }






