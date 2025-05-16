import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import logo from "../../assets/logo.jpg";

export default function Brands() {
  const [selectedBrand, setSelectedBrand] = useState(null);

  function getBrands() {
    return axios
      .get(`https://ecommerce.routemisr.com/api/v1/brands`)
      .then((res) => res.data );   
  }

  let { isLoading, error, isError, data } = useQuery({
    queryKey: ["getbrands"],
    queryFn: getBrands,
    staleTime: 100000,
    refetchInterval: 300000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-90 ">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
      
    );
  }

  if (isError) {
    return <h2>{error.message}</h2>;

  }

  return (
    <div>
      <h1 className="text-4xl flex pt-10 w-auto font-serif text-green-600 justify-center">
        All Brands
      </h1>

      
      <div className="pt-5 grid grid-cols-1   sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {data?.data?.length > 0 &&
          data.data.map((brand, index) => (
            <div
              key={index}
              className="hover:shadow-3xl  hover:shadow-[0_2px_10px_rgba(34,197,95,1)] group  cursor-pointer"
              onClick={() => setSelectedBrand(brand)}
            >
              
              <img
                src={brand.image}
                alt="Brand"
                className=" h-[154px] w-[60%] sm:w-full sm:h-[159px] object-cover rounded-t-xl"
              />
              <h3 className="text-lg text-black py-1 bg-slate-300 truncate block capitalize text-center">
                {brand.name}
              </h3>
            </div>
          ))}
      </div>

      {selectedBrand && (
        <div
          className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-[9999]"
          onClick={() => setSelectedBrand(null)}
        >
          <div
            className="bg-white p-6 rounded-lg w-[500px] shadow-lg relative pb-2 mt-20 animate-slideDown"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b py-3 ">
              <button
                className="absolute top-2 hover:border-gray-500 right-4 text-gray-400 text-4xl hover:text-gray-500"
                onClick={() => setSelectedBrand(null)}
              >
                &times;
              </button>
            </div>

            <div className="flex justify-between">
              <div className="items-center mt-14">
                <h1 className="text-4xl font-bold text-green-600">
                  {selectedBrand.name}
                </h1>
                <h3 className="text-gray-700 text-xl">
                  {selectedBrand.name.toLowerCase()}
                </h3>
              </div>

              <img
                src={selectedBrand.image}
                alt={selectedBrand.name}
                className="mt-auto w-[50%] justify-end h-[50%] object-cover"
              />
            </div>

            <div className="flex justify-end pb-0 border-t">
              <button
                className="mt-2 px-5 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                onClick={() => setSelectedBrand(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


