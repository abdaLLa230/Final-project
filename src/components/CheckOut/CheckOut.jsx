import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import { CartContext } from '../../Context/CartContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function CheckOut() {
  const { OnlinePay, CashOrder, cartId } = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const navigate = useNavigate();
  
  const formik = useFormik({
    initialValues: {
      details: '',
      phone: '',
      city: '',
    },
    onSubmit: async () => {
      if (!cartId) {
        Swal.fire({
          title: "Your cart is empty",
          text: "Please add products first",
          icon: "error",
          confirmButtonText: "Done",
          background: 'rgba(255, 255, 255, 1)', 
          backdrop: false, 
          customClass: {
          confirmButton:"bg-blue-600 hover:bg-blue-700 text-white  px-10 py-2 rounded-2xl",
            container: 'swal-container', 
            popup: 'swal-popup', 
            width: '32rem', 
            background: '#ffffff'
        }});
        return;
      }

      if (!formik.values.details || !formik.values.phone || !formik.values.city) {
        Swal.fire({
          title: "Please complete all fields",
          icon: "warning",
          confirmButtonText: "Done",
          background: 'rgba(255, 255, 255, 1)', 
          backdrop: false, 
          customClass: {
          confirmButton:"bg-blue-600 hover:bg-blue-700 text-white  px-10 py-2 rounded-2xl",
            container: 'swal-container', 
            popup: 'swal-popup', 
            width: '32rem', 
            background: '#ffffff'
        }});
        return;
      }

      setIsLoading(true);
      
      try {
        if (paymentMethod === 'online') {
          const { data } = await OnlinePay(cartId, formik.values, `${window.location.origin}`);
          window.location.href = data.session.url;
        } else {
          const { data } = await CashOrder(cartId, formik.values);
          Swal.fire({
            title: "Order completed successfully!",
            icon: "success",
            draggable: true,
            confirmButtonText: "Done",
            background: 'rgba(255, 255, 255, 1)', 
            backdrop: false, 
            customClass: {
            confirmButton:"bg-blue-600 hover:bg-blue-700 text-white  px-10 py-2 rounded-2xl",
              container: 'swal-container', 
              popup: 'swal-popup', 
              width: '32rem', 
              background: '#ffffff'

        }}).then((result) => {
            if (result.isConfirmed) {
              navigate('/allorders');
            }})
        }
      } catch (error) {
        Swal.fire({
          title: "Payment failed",
          text: error.response?.data?.message || 'Please try again.',
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-2xl'
          }});
      } finally {
        setIsLoading(false);
      }
    },
  });

  const paymentOptions = [
    {
      id: 'online',
      title: 'Credit/Debit Card',
      icon: (
        <div className="flex space-x-2">
          <span className="bg-white p-1.5 rounded shadow-md">💳</span>
          <span className="bg-white p-1.5 rounded shadow-md">📱</span>
        </div>
      ),
      description: 'Secure payment with Stripe',
      buttonText: 'Pay Now',
      activeClass: 'ring-2 ring-blue-500 bg-blue-50'
    },
    {
      id: 'cash',
      title: 'Cash on Delivery',
      icon: <span className="bg-white p-1.5 rounded shadow-md">💰</span>,
      description: 'Pay when you receive your order',
      buttonText: 'Place Order',
      activeClass: 'ring-2 ring-green-500 bg-green-50'
    }
  ];

  return (
    <>
      <div className="py-3 pt-0 sm:p lg:p-">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-green-600 text-center">
          Checkout
        </h1>
      </div>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 pt-0 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 pt-0 sm:p-8">
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <h1 className="text-xl font-serif text-center">Complete your purchase</h1>
                
                <div className="space-y-4">
                  <h2 className="text-lg font-serif text-left text-gray-800 border-b pb-2">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <input
                        type="text"
                        name="city"
                        placeholder='City'
                        onChange={formik.handleChange}
                        value={formik.values.city}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <input
                        type="tel"
                        placeholder='Phone'
                        name="phone"
                        onChange={formik.handleChange}
                        value={formik.values.phone}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <textarea
                      name="details"
                      onChange={formik.handleChange}
                      value={formik.values.details}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Full Address"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Payment Method</h2>
                  
                  <div className="space-y-3">
                    {paymentOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => setPaymentMethod(option.id)}
                        className={`p-4 border border-gray-200 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === option.id ? option.activeClass : 'hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`mr-4 flex-shrink-0 ${
                            paymentMethod === option.id ? 'text-blue-600' : 'text-gray-400'
                          }`}>
                            {option.icon}
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium text-gray-900">{option.title}</h3>
                            <p className="text-sm text-gray-500">{option.description}</p>
                          </div>
                          <div className="ml-4">
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={paymentMethod === option.id}
                              onChange={() => {}}
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-6 rounded-xl font-medium text-white transition-colors ${
                    paymentMethod === 'online' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  } ${
                    isLoading ? 'opacity-80 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      Processing...
                    </span>
                  ) : (
                    paymentOptions.find(o => o.id === paymentMethod)?.buttonText
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
