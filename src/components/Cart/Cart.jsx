import React, { useContext, useState } from "react";
import { CartContext } from "../../Context/CartContext";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function App() {
  const {
    getUserLogedCart,
    updateCartProductQantity,
    deleteCartItem,
    clearAllCartItems,
  } = useContext(CartContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loadingState, setLoadingState] = useState({});
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [manualQuantities, setManualQuantities] = useState({});

  const { data: cartDetails, isLoading } = useQuery({
    queryKey: ["cartData"],
    queryFn: getUserLogedCart,
    select: (res) => res?.data?.data,
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, count, type }) => {
      setLoadingState((prev) => ({ ...prev, [`update-${id}-${type}`]: true }));
      return updateCartProductQantity(count, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartData"] });
      toast.success("Product Updated Successfully");
    },
    onError: () => {
      toast.error("Error updating product");
    },
    onSettled: (_, __, variables) => {
      setLoadingState((prev) => ({
        ...prev,
        [`update-${variables.id}-${variables.type}`]: false,
      }));
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: deleteCartItem,
    onMutate: (id) =>
      setLoadingState((prev) => ({ ...prev, [`delete-${id}`]: true })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartData"] });
      toast.success("Product removed successfully");
    },
    onError: () => {
      toast.error("Error removing product");
    },
    onSettled: (id) =>
      setLoadingState((prev) => ({ ...prev, [`delete-${id}`]: false })),
  });

  const clearCartMutation = useMutation({
    mutationFn: clearAllCartItems,
    onMutate: () => setLoadingState((prev) => ({ ...prev, clearCart: true })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartData"] });
      toast.success("Cart cleared successfully");
      setTimeout(() => navigate("/"), 100);
    },
    onSettled: () => setLoadingState((prev) => ({ ...prev, clearCart: false })),
  });

const handleManualQuantityChange = (productId, value) => {
  const parsedValue = parseInt(value) || 1;
  if (parsedValue > 99) {
    toast.error("Max is 99 please update your Quantity", {
      style: {
        background: '#ff0000',
        color: '#ffffff',
      },
    });
    return; 
  }
  const newValue = Math.max(parsedValue, 1); 
  setManualQuantities((prev) => ({ ...prev, [productId]: newValue }));
};


const applyManualQuantity = (productId, currentCount) => {
  const newQuantity = manualQuantities[productId];
  if (newQuantity !== undefined && newQuantity !== currentCount) {
    if (newQuantity > 99) {
      return;
    }
    updateProductMutation.mutate({
      id: productId,
      count: newQuantity,
      type: "manual",
    });
  }
};

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-90 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {cartDetails?.products?.length > 0 ? (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-green-600 text-center py-4">
            Shopping Cart
          </h1>

          <div className="flex justify-end mb-4">
            <button
              onClick={() => clearCartMutation.mutate()}
              className="text-slate-100 p-2 w-full sm:w-64 bg-red-500 hover:bg-red-700 rounded-xl"
            >
              {loadingState.clearCart ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                "Clear Cart"
              )}
            </button>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Mobile View: Cards (visible only on screens smaller than lg) */}
            <div className="lg:hidden">
              <div className="grid grid-cols-1 gap-4 mb-4">
                {cartDetails.products.map((product) => (
                  <div
                    key={product.product.id}
                    className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center text-center cursor-pointer"
                    onClick={(e) => {
                      if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'I' && e.target.closest('button') === null && e.target.tagName !== 'INPUT') {
                        navigate(
                          `/ProductDetails/${product.product.id}/${product.product.category.name}`
                        );
                      }
                    }}
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0 mb-4">
                      <img
                        src={product.product.imageCover}
                        alt={product.product.title}
                        className="w-32 h-32 object-contain rounded-md"
                      />
                    </div>

                    {/* Product Title */}
                    <h3 className="font-medium text-gray-900 text-lg mb-2">
                      {product.product.title}
                    </h3>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 mb-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateProductMutation.mutate({
                            id: product.product.id,
                            count: product.count - 1,
                            type: "decrease",
                          });
                        }}
                        className="inline-flex items-center justify-center text-black bg-gray-100 px-2 py-1 border-green-500 border hover:bg-gray-100 rounded-xl"
                        disabled={
                          loadingState[`update-${product.product.id}-decrease`] || product.count === 1
                        }
                      >
                        {loadingState[`update-${product.product.id}-decrease`] ? (
                          <i className="fas fa-spinner py-1 fa-spin"></i>
                        ) : (
                          "-"
                        )}
                      </button>
                      <span className="px-3 text-slate-950">
                        {product.count}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateProductMutation.mutate({
                            id: product.product.id,
                            count: product.count + 1,
                            type: "increase",
                          });
                        }}
                        className="inline-flex items-center justify-center text-black bg-gray-100 px-2 py-1 border-green-500 border hover:bg-gray-100 rounded-xl"
                        disabled={
                          loadingState[`update-${product.product.id}-increase`]
                        }
                      >
                        {loadingState[`update-${product.product.id}-increase`] ? (
                          <i className="fas fa-spinner py-1 fa-spin"></i>
                        ) : (
                          "+"
                        )}
                      </button>
                    </div>

                    {/* Total Price for Product */}
                    <p className="text-gray-900 text-lg font-semibold mb-2">
                      {product.price * product.count}$
                    </p>

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItemMutation.mutate(product.product.id);
                      }}
                      className="text-red-500 text-[16px] py-1 rounded-lg hover:text-red-700"
                      disabled={loadingState[`delete-${product.product.id}`]}
                    >
                      {loadingState[`delete-${product.product.id}`] ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        "Remove"
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart Summary for Mobile/Medium - Below Cards */}
              <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                <h2 className="text-2xl text-slate-600 mb-4">Cart Summary</h2>
                <div className="flex justify-between text-slate-600 mb-2">
                  <span>Total Items</span>
                  <span>{cartDetails?.products?.length}</span>
                </div>
                <div className="flex justify-between text-slate-600 mb-4">
                  <span>Shipping</span>
                  <span className="font-medium">0$</span>
                </div>
                <hr />
                <div className="flex justify-between text-slate-600 mt-4 text-lg font-mono">
                  <span>Total</span>
                  <span>{cartDetails?.totalCartPrice + 0}$</span>
                </div>
                <Link to="/checkout">
                  <button
                    className="w-full mt-6 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
                    onClick={() => setCheckoutLoading(true)}
                  >
                    {checkoutLoading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      "Checkout"
                    )}
                  </button>
                </Link>
              </div>
            </div>

            {/* Large Screens and Up: Table View (visible only on lg and larger) */}
            <div className="hidden lg:flex gap-6">
              {/* Table View - 75% width */}
              <div className="w-[75%]">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 border-collapse">
                  <thead className="text-xs text-gray-700 uppercase bg-slate-300">
                    <tr>
                      <th className="px-4 py-3 sm:px-6">Image</th>
                      <th className="px-4 py-3 sm:px-6">Product</th>
                      <th className="px-4 py-3 sm:px-6">Quantity</th>
                      <th className="px-4 py-3 sm:px-6">Price</th>
                      <th className="px-4 py-3 sm:px-6">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartDetails.products.map((product, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b h-52 border-gray-200 cursor-pointer hover:bg-gray-50"
                        onClick={(e) => {
                          if (e.target.tagName !== "BUTTON" && e.target.tagName !== "INPUT") {
                            navigate(
                              `/ProductDetails/${product.product.id}/${product.product.category.name}`
                            );
                          }
                        }}
                      >
                        <td className="p-4">
                          <img
                            src={product.product.imageCover}
                            alt={product.product.title}
                            className="w-16 h-16 sm:w-36 sm:h-48 object-contain rounded-md"
                          />
                        </td>
                        <td className="px-4 py-3 sm:px-6 font-medium text-gray-900">
                          {product.product.title}
                        </td>
                        <td className="px-4 py-3 sm:px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateProductMutation.mutate({
                                  id: product.product.id,
                                  count: product.count - 1,
                                  type: "decrease",
                                });
                              }}
                              className="inline-flex items-center justify-center text-black bg-gray-100 px-2 py-1 border-green-500 border hover:bg-gray-100 rounded-xl"
                              disabled={
                                loadingState[
                                  `update-${product.product.id}-decrease`
                                ] || product.count === 1
                              }
                            >
                              {loadingState[
                                `update-${product.product.id}-decrease`
                              ] ? (
                                <i className="fas fa-spinner py-1 fa-spin"></i>
                              ) : (
                                "-"
                              )}
                            </button>
                            
                            <input
                               type="number"
                               min="1"
                               max="99"
                               value={manualQuantities[product.product.id] ?? product.count}
                               onChange={(e) => handleManualQuantityChange(product.product.id, e.target.value)}
                               onBlur={() => applyManualQuantity(product.product.id, product.count)}
                               onClick={(e) => e.stopPropagation()}
                               className="w-16 text-center border border-gray-300 rounded-md py-1"
                            />
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateProductMutation.mutate({
                                  id: product.product.id,
                                  count: product.count + 1,
                                  type: "increase",
                                });
                              }}
                              className="inline-flex items-center justify-center text-black bg-gray-100 px-2 py-1 border-green-500 border hover:bg-gray-100 rounded-xl"
                              disabled={
                                loadingState[
                                  `update-${product.product.id}-increase`
                                ] || product.count >= 99
                              }
                            >
                              {loadingState[
                                `update-${product.product.id}-increase`
                              ] ? (
                                <i className="fas fa-spinner py-1 fa-spin"></i>
                              ) : (
                                "+"
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-gray-900">
                          {product.price * product.count}$
                        </td>
                        <td className="px-4 py-3 sm:px-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteItemMutation.mutate(product.product.id);
                            }}
                            className="text-red-500 w-24 text-[16px] py-1 rounded-lg"
                            disabled={loadingState[`delete-${product.product.id}`]}
                          >
                            {loadingState[`delete-${product.product.id}`] ? (
                              <i className="fas fa-spinner fa-spin"></i>
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

              {/* Cart Summary - 25% width */}
              <div className="w-[25%]">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl text-slate-600 mb-4">Cart Summary</h2>
                  <div className="flex justify-between text-slate-600 mb-2">
                    <span>Total Items</span>
                    <span>{cartDetails?.products?.length}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 mb-4">
                    <span>Shipping</span>
                    <span className="font-medium">0$</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-slate-600 mt-4 text-lg font-mono">
                    <span>Total</span>
                    <span>{cartDetails?.totalCartPrice}$</span>
                  </div>
                  <Link to="/checkout">
                    <button
                      className="w-full mt-6 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
                      onClick={() => setCheckoutLoading(true)}
                    >
                      {checkoutLoading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        "Checkout"
                      )}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-600 font-serif text-center pt-20 pb-10">
          Cart is empty
        </h1>
      )}
    </>
  );
}
