import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import Swal from "sweetalert2";

export default function Register() {
  let { setUserLogin } = useContext(UserContext);
  const navigate = useNavigate();
  const [ApiError, setApiError] = useState("");
  const [IsLoading, setIsLoading] = useState(false);

  const validationSchema = yup.object().shape({
    name: yup.string().min(3, "Minimum length is 3").max(32, "Max Length is 32").required("Name is Required"),
    email: yup.string().email("Email not Valid").required("Email is Required"),
    password: yup.string().required("Password is Required").min(6, "Minimum Password is 6"),
    rePassword: yup.string().oneOf([yup.ref("password")], "Not the Same Password").required("RePassword is Required"),
    phone: yup.string().matches(/^01[1250][0-9]{8}$/, "Phone Not Valid").required("Phone is Required"),
  });

  const HandleRegister = async (values) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signup",
        values
      );
      if (data.message === "success") {
        Swal.fire({
          title: "Success!",
          text: "Registration completed successfully",
          icon: "success",
          iconColor: "#16a34a",
          confirmButtonText: "Done",
          background: 'rgba(255, 255, 255, 0.9)',
          backdrop: false, 
          customClass: {
            confirmButton:"bg-blue-600 hover:bg-blue-700 text-white  px-10 py-2 rounded-2xl",
            container: 'swal-container', 
            popup: 'swal-popup', 
            width: '32rem', 
            background: '#ffffff'
          },
        }).then(() => {
          navigate("/login");
        });
      }
    } catch (error) {
      setApiError(error.response?.data?.message || "Registration failed");
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Registration failed",
        icon: "error",
        iconColor: "#dc2626",
        confirmButtonText: "Done",
        background: 'rgba(255, 255, 255, 0.9)', 
        backdrop: false, 
        customClass: {
          confirmButton:"bg-blue-600 hover:bg-blue-700 text-white  px-10 py-2 rounded-2xl",
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
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
    validationSchema,
    onSubmit: HandleRegister,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold flex w-96 pt-4 pb-6 hover:text-green-600 hover:cursor-pointer justify-center">
          {" "}
          Register Now !{" "}
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
                    <i className="fas fa-user text-gray-400 text-lg"></i>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full Name"
                  />
                </div>
                {formik.errors.name && formik.touched.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.name}
                  </p>
                )}

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Password"
                      />
                    </div>
                    {formik.errors.password && formik.touched.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <i className="fas fa-lock text-gray-400 text-lg"></i>
                      </div>
                      <input
                        type="password"
                        name="rePassword"
                        value={formik.values.rePassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Confirm Password"
                      />
                    </div>
                    {formik.errors.rePassword && formik.touched.rePassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.rePassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <i className="fas fa-phone text-gray-400 text-lg"></i>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Phone Number"
                  />
                </div>
                {formik.errors.phone && formik.touched.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.phone}
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
                      <i className="fas fa-spinner  fa-spin text-white text-xl"></i>
                    </span>
                  ) : (
                    "Register Now"
                  )}
                </button>
              </div>
            </form>
            <div className="text-center text-md pt-2 text-gray-600">
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Already have an account? Login Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
