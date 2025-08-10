import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CartContext } from '../../Context/CartContext';
import toast from 'react-hot-toast';
import { WishListContext } from '../../Context/WishListContext';

export default function RecentProducts({ searchTerm }) {
  const navigate = useNavigate();
  let { addProductToCart } = useContext(CartContext);
  let { addProductToWishList, deleteWishListItem, getUserLogedWishList } = useContext(WishListContext);
  const [loadingCart, setLoadingCart] = useState(false);
  const [currentIdCart, setCurrentIdCart] = useState(0);
  const [loadingWishList, setLoadingWishList] = useState(false);
  const [currentIdWishList, setCurrentIdWishList] = useState(0);
  const [wishlist, setWishlist] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; 

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
    setCurrentIdWishList(id);
    setLoadingWishList(true);
    if (wishlist.has(id)) {
      let response = await deleteWishListItem(id);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        setWishlist(prev => {
          const newWishlist = new Set(prev);
          newWishlist.delete(id);
          return newWishlist;
        });
      } else {
        toast.error(response.data.message);
      }
    } else {
      let response = await addProductToWishList(id);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        setWishlist(prev => new Set(prev).add(id));
      } else {
        toast.error(response.data.message);
      }
    }
    setLoadingWishList(false);
    setCurrentIdWishList(0);
  }

  // Add product to cart
  async function addToCart(id) {
    setCurrentIdCart(id);
    setLoadingCart(true);
    let response = await addProductToCart(id);
    if (response.data.status === "success") {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
    setLoadingCart(false);
    setCurrentIdCart(0);
  }

  function handleProductClick(product) {
    navigate(`/ProductDetails/${product.id}/${product.category.name}`);
  }

  function getProducts() {
    return axios.get(`https://ecommerce.routemisr.com/api/v1/products`);
  }

  let { isLoading, error, data } = useQuery({
    queryKey: ["recentProduct"],
    queryFn: getProducts,
    staleTime: 100000,
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-90">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching data:", error);
    return <h2 className="text-center py-10 text-red-500">Error fetching data. Please try again later.</h2>;
  }

  const filteredProducts = (data?.data?.data || [])
    .filter(product => product?.title?.toLowerCase().includes(searchTerm?.toLowerCase() || ""));

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="  pt-8">
      {currentProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] group">

                <div className="relative h-72 sm:h-80 w-full overflow-hidden cursor-pointer"
                  onClick={() => handleProductClick(product)}>

                  <img src={product.imageCover} alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                      {product.category.name}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    <i className="fas fa-star mr-1"></i>
                    <span>{product.ratingsAverage}</span>
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {product.title.split(" ").slice(0, 2).join(" ")}
                  </h3>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-green-700">
                        {product.price}$
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">Sold: {product.sold}</span>
                  </div>

                  {/* Action Buttons Container */}
                  <div className="flex items-center w-full mt-auto pt-2 gap-2">
                    <button onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product.id);
                      }}
                      className="flex-1 bg-green-600 text-white py-2 rounded-md font-serif opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 flex items-center justify-center gap-2"
                      disabled={loadingCart && currentIdCart === product.id}>

                      {loadingCart && currentIdCart === product.id ? (
                        <i className="fas fa-spinner py-1 fa-spin"></i>
                      ) : (<> <i className="fas fa-shopping-cart"></i> Add to Cart </>
                      )}
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id);}}
                      className={`w-10 h-10 flex items-center justify-center rounded-md border ${wishlist.has(product.id) ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-500'}  transition-all duration-200`}
                      disabled={loadingWishList && currentIdWishList === product.id}>

                      {loadingWishList && currentIdWishList === product.id ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : ( <i className={`fa-solid fa-heart ${wishlist.has(product.id) ? 'text-red-500' : ''}`}></i>
                      )}
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-12">
            {totalPages > 1 && (
              <>
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-3 rounded-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg flex items-center gap-2">
                  <i className="fas fa-arrow-alt-circle-left"></i>
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full text-lg font-extrabold ${
                        currentPage === page
                          ? 'bg-sky-600 text-white shadow-xl transform scale-110'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } transition-all duration-300`} >
                      {page}
                    </button>
                  ))}
                </div>

                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-3 rounded-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg flex items-center gap-2">
                  <i className="fas fa-arrow-alt-circle-right"></i>
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-3xl font-bold text-gray-600">
            No products found matching your search.
          </p>
          <p className="text-lg text-gray-500 mt-2">Try a different search term or browse our categories.</p>
        </div>
      )}
    </div>
  );
}
