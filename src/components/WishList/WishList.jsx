import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WishListContext } from "../../Context/WishListContext";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import toast from "react-hot-toast";
import logo from "../../assets/logo.jpg";

export default function WishList() {
  const { getUserLogedWishList, deleteWishListItem } = useContext(WishListContext);
  const { addProductToCart } = useContext(CartContext);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: WishListDetails, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getUserLogedWishList,
    select: (response) => response.data.data,
    staleTime: 5000,
  });

  const [loadingIds, setLoadingIds] = useState({ add: null, delete: null });

  const deleteMutation = useMutation({
    mutationFn: deleteWishListItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
      toast.success("Product removed from wishlist!");
      setLoadingIds((prev) => ({ ...prev, delete: null }));
    },
    onError: () => {
      toast.error("Failed to remove product.");
      setLoadingIds((prev) => ({ ...prev, delete: null }));
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: addProductToCart,
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
      toast.success("Product added to cart!");
      setLoadingIds((prev) => ({ ...prev, add: null }));
    },
    onError: () => {
      toast.error("Failed to add product.");
      setLoadingIds((prev) => ({ ...prev, add: null }));
    },
  });

  function handleProductClick(product) {
    navigate(`/ProductDetails/${product.id}/${product.category.name}`);
  }

  if (isLoading) {
    return <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-90 ">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
            // <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-90">
//     <i className="fas fa-spinner fa-spin text-white text-4xl"></i>
//  </div>
  }

  return (
    <>
      {WishListDetails?.length > 0 ? (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-green-600 text-center py-4">
            Your Wish List
          </h1>

          {/* Responsive Layout */}
          <div className="max-w-7xl mx-auto">
            {/* Table View for Larger Screens */}
            <div className="hidden sm:block">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 border-collapse">
                {/* Table Header */}
                <thead className="text-xs text-gray-700 uppercase bg-slate-300">
                  <tr>
                    <th scope="col" className="px-4 py-3 sm:px-6">Image</th>
                    <th scope="col" className="px-4 py-3 sm:px-6">Product</th>
                    <th scope="col" className="px-4 py-3 sm:px-6">Product Rate</th>
                    <th scope="col" className="px-4 py-3 sm:px-6">Price</th>
                    <th scope="col" className="px-4 py-3 sm:px-6">Action</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {WishListDetails.map((product, index) => (
                    <tr
                      onClick={() => handleProductClick(product)}
                      key={index}
                      className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                      {/* Product Image */}
                      <td className="p-4">
                        <img
                          src={product.imageCover}
                          alt={product.title}
                          className="w-16 h-16 sm:w-40 sm:h-48 object-cover rounded-md"
                        />
                      </td>

                      {/* Product Title */}
                      <td className="px-4 py-3 sm:px-6 text-[16px] text-gray-900">
                        {product.title}
                      </td>

                      {/* Product Rating */}
                      <td className="px-4 py-3 sm:px-6">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <span>{product.ratingsAverage}</span>
                          <i className="fas fa-star"></i>
                        </div>
                      </td>

                      {/* Product Price */}
                      <td className="px-4 py-3 sm:px-6  text-gray-900">
                        {product.price} EGP
                      </td>

                      {/* Action Buttons */}
                      <td className="px-4 py-3 sm:px-6 space-y-2">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            setLoadingIds((prev) => ({ ...prev, add: product.id }));
                            addToCartMutation.mutate(product.id);
                          }}
                          className={`w-full text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-2xl flex items-center justify-center ${loadingIds.add === product.id ? "cursor-not-allowed opacity-70" : ""
                            }`}
                          disabled={loadingIds.add === product.id}
                        >
                          {loadingIds.add === product.id ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            "Add To Cart"
                          )}
                        </button>

                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            setLoadingIds((prev) => ({ ...prev, delete: product.id }));
                            deleteMutation.mutate(product.id);
                          }}
                          className={`w-full text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-2xl flex items-center justify-center ${loadingIds.delete === product.id ? "cursor-not-allowed opacity-70" : ""
                            }`}
                          disabled={loadingIds.delete === product.id}
                        >
                          {loadingIds.delete === product.id ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            "Remove"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card View for Mobile Screens */}
            <div className="sm:hidden ">
              {WishListDetails.map((product, index) => (
                <div
                  key={index}
                  className="bg-white relative rounded-lg shadow-md overflow-hidden mb-4"
                >
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={product.imageCover}
                      alt={product.title}
                      className="w-full h-72 object-contain"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                    <div className="absolute top-2 end-2 border p-2 bg-gray-400 backdrop-blur-md bg-opacity-50 rounded-3xl flex items-center gap-1 text-yellow-500">
                      <span>{product.ratingsAverage}</span>
                      <i className="fas fa-star"></i>
                    </div>
                    <p className="text-gray-700 font-medium">{product.price} EGP</p>

                    {/* Action Buttons */}
                    <div className=" flex gap-3">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setLoadingIds((prev) => ({ ...prev, add: product.id }));
                          addToCartMutation.mutate(product.id);
                        }}
                        className={`w-[49%] text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-2xl flex items-center justify-center ${loadingIds.add === product.id ? "cursor-not-allowed opacity-70" : ""
                          }`}
                        disabled={loadingIds.add === product.id}
                      >
                        {loadingIds.add === product.id ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          "Add To Cart"
                        )}
                      </button>

                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setLoadingIds((prev) => ({ ...prev, delete: product.id }));
                          deleteMutation.mutate(product.id);
                        }}
                        className={`w-[49%] text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-2xl flex items-center justify-center ${loadingIds.delete === product.id ? "cursor-not-allowed opacity-70" : ""
                          }`}
                        disabled={loadingIds.delete === product.id}
                      >
                        {loadingIds.delete === product.id ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          "Remove"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-600 font-serif text-center pt-20 pb-10">
          Wish List is empty
        </h1>
      )}
    </>
  );
}