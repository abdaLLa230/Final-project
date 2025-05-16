import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import logo from "../../assets/logo.jpg";

export default function Subcategories({ categoryId, categoryName }) {
  
  const getSubcategories = async () => {
    if (!categoryId) return [];
    const res = await axios.get(
      `https://ecommerce.routemisr.com/api/v1/subcategories?category=${categoryId}`
    );
    return res.data.data || [];
  };

  
  const {
    data: subcategories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getSubcategories", categoryId],
    queryFn: getSubcategories,
    enabled: !!categoryId,
    staleTime: 100000,
    refetchOnWindowFocus: false,
  });

  
  if (!categoryId) return null;

 
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-90 ">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
    );
  }

  if (isError) {
    return (
      <h1 className="text-3xl flex pb-10 w-96 pt-10 font-serif hover:text-green-600 justify-start">
        An error occurred while loading data !
      </h1>
    );
  }

  return <>
    <div className="mt-10 p-5 pb-10 border-t border-gray-300">
     
      <h2 className="text-3xl font-serif text-green-600 mb-4">
        {categoryName} Subcategories
      </h2>

      
      {subcategories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {subcategories.map((sub) => (
            <div
              key={sub._id}
              className="p-3 bg-gray-200 text-black rounded-lg shadow-2xl hover:shadow-[0_2px_10px_rgba(34,197,95,1)] group  transition-all cursor-pointer text-center"
            >
              {sub.name}
            </div>
          ))}
        </div>
      ) : (
        <h1 className="text-3xl flex pb-10 w-96 pt-10 font-serif hover:text-green-600 justify-start">
          Not available Subcategories !
        </h1>
      )}
    </div>
  

  </>
}

