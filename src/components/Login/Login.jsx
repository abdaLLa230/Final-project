import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import Swal from "sweetalert2";

export default function Login() {
  let { setUserLogin } = useContext(UserContext);
  const navigate = useNavigate();
  const [ApiError, setApiError] = useState("");
  const [IsLoading, setIsLoading] = useState(false);

  const validationSchema = yup.object().shape({
    email: yup.string().email("Email not Valid").required("Email is Required"),
    password: yup.string().required("Password is Required").min(6, "Minimum Password is 6"),
  });

  const HandleLogin = async (values) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signin",
        values
      );
      if (data.message === "success") {
        localStorage.setItem("userToken", data.token);
        setUserLogin(data.token);
        navigate("/");
      }
    } catch (error) {
      setApiError(error.response?.data?.message || "Login failed");
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Login failed",
        icon: "error",
        iconColor: "#dc2626",
        confirmButtonText: "Done",
        background: 'rgba(255, 255, 255, 0.9)', 
        backdrop: false, 
        customClass: {
          confirmButton:"bg-blue-600 hover:bg-blue-700 text-white px-10 py-2 rounded-2xl",
          container: 'swal-container', 
          popup: 'swal-popup', 
          width: '32rem', 
          background: '#ffffff'
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: HandleLogin,
  });

  return (
    <div className=" bg-gray-50 pt-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold flex w-96 pt-4 pb-6 hover:text-green-600 hover:cursor-pointer justify-center">
          Login Now !
        </h1>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            {ApiError && (
              <div className="mb-6 p-4 bg-red-100 rounded-lg">
                <p className="text-red-600 text-center">{ApiError}</p>
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative flex items-center">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <i className="fas fa-envelope text-gray-400 text-lg"></i>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email Address"
                  />
                </div>
                {formik.errors.email && formik.touched.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.email}
                  </p>
                )}

                <div className="relative flex items-center">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <i className="fas fa-lock text-gray-400 text-lg"></i>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="Password"
                  />
                </div>
                {formik.errors.password && formik.touched.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  disabled={IsLoading}
                  className="w-full py-2 px-6 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  {IsLoading ? (
                    <span className="flex items-center justify-center py-1 space-x-2">
                      <i className="fas fa-spinner fa-spin text-white text-xl"></i>
                    </span>
                  ) : (
                    "Login Now"
                  )}
                </button>
              </div>
            </form>
            <div className="text-center text-md pt-2 text-gray-600">
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Don't have an account? Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
