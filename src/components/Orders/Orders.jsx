import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import axios from "axios";
import decodeToken from "../../decodeToken";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserOrders() {
  const token = localStorage.getItem("userToken");
  const userData = decodeToken(token);
  const userId = userData?.id;
  const queryClient = useQueryClient();

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userOrders"],
    queryFn: async () => {
      if (!userId || !token) {
        throw new Error("Authentication required");
      }
      const response = await axios.get(
        `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return [...response.data].reverse();
    },
  });

  // Delete all orders mutation
  const deleteAllOrders = useMutation({
    mutationFn: async () => {
      if (!userId || !token) {
        throw new Error("Authentication required");
      }
      await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userOrders"]);
      toast.success(
        <div className="flex items-center">
          All orders deleted successfully!
        </div>
      );
    },
    onError: (error) => {
      toast.error(
        <div className="flex items-center">
          {error.response?.data?.message || "Failed to delete orders"}
        </div>
      );
    },
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-90 ">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-96 flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Error loading orders
          </h1>
          <p className="text-gray-600 mb-6">
            Please try again later or contact support
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              My Order{" "}
            </h1>
            <p className="text-gray-600 mt-2">Review your past purchases</p>
          </div>

          {orders?.length > 0 && (
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete all your order history?"
                  )
                ) {
                  deleteAllOrders.mutate();
                }
              }}
              disabled={deleteAllOrders.isLoading}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center"
            >
              {deleteAllOrders.isLoading ? (
                <>
                  Deleting...
                </>
              ) : (
                <>
                  Clear All Orders
                </>
              )}
            </button>
          )}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders?.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
              >
                {/* Order Header */}
                <div className="p-6 sm:p-8 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {moment(order.createdAt).format(
                        "MMMM Do YYYY [at] h:mm A"
                      )}
                    </p>
                  </div>
                  <div className="flex justify-end  md:items-center gap-3">
                    <span
                      className={`px-5 py-2   text-xs font-medium rounded-full ${
                        order.isDelivered
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "Processing"}
                    </span>
                    <span
                      className={`px-5 py-2 text-xs font-medium rounded-full ${
                        order.isPaid
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending Payment"}
                    </span>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Shipping and Payment Info */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        
                        Shipping Information
                      </h3>
                      <div className="bg-gray-50 text-left p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-normal break-words">
                          Details : {order.shippingAddress?.details}
                        </p>
                        <p className="text-gray-700">
                          City : {order.shippingAddress?.city}
                        </p>
                        <p className="text-gray-700">
                          Phone : {order.shippingAddress?.phone}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        Payment Method
                      </h3>

                      <span
                        className={`px-8 py-2 text-md font-medium rounded-full ${
                          order.paymentMethodType
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.paymentMethodType}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      
                      Ordered Items
                    </h3>
                    <div className="space-y-4">
                      {order.cartItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={item.product.imageCover}
                            alt={item.product.title}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 line-clamp-1">
                              {item.product.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Qty: {item.count}
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {item.price} EGP
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 px-6 sm:px-8 py-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="text-md text-gray-600">
                      {order.cartItems.length} item
                      {order.cartItems.length !== 1 ? "s" : ""}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Total:{" "}
                        <span className="font-bold text-lg text-gray-900">
                          {order.totalOrderPrice + order.shippingPrice} EGP
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Includes {order.shippingPrice} EGP shipping
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center">
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No Orders Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Your order history will appear here once you make purchases
              </p>
              <a
                href="/products"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Browse Products
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
