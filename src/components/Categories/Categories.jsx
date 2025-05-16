import React, { useState, useRef } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Subcategories from "../Subcategories/Subcategories";


export default function Categories() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const subcategoriesRef = useRef(null);

  const getCategories = async () => {
    const res = await axios.get(
      "https://ecommerce.routemisr.com/api/v1/categories"
    );
    return res.data.data || [];
  };

  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getCategories"],
    queryFn: getCategories,
    staleTime: 100000,
    refetchInterval: 300000,
    refetchOnWindowFocus: false,
  });

  const handleCategoryClick = (category) => {
    setSelectedCategoryId(category._id);
    setSelectedCategoryName(category.name);

    setTimeout(() => {
      if (subcategoriesRef.current) {
        subcategoriesRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-90 ">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
      
    );
  }

  if (isError) {
    return (
      <h1 className="text-3xl flex pb-10 w-96 pt-10 hover:text-green-600 justify-start">
        An error occurred while loading data!
      </h1>
    );
  }

  return (
    <>
      <div>
        
        <div className="pt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category._id}
                className="hover:shadow-3xl hover:shadow-[0_2px_10px_rgba(34,197,95,1)] group cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
               
                <img
                  src={category.image}
                  alt="Category"
                  className="h-[384px] sm:h-[389px] w-full object-cover rounded-t-xl"
                />
                <h3 className="text-lg text-black py-1 bg-slate-300 truncate block capitalize text-center">
                  {category.name.split(" ").slice(0, 2).join(" ")}
                </h3>
              </div>
            ))
          ) : (
            <h1 className="text-3xl flex pb-10 w-96 pt-10 hover:text-green-600 justify-start">
              Not available Categories!
            </h1>
          )}
        </div>

        
        <div ref={subcategoriesRef}>
          {selectedCategoryId && (
            <Subcategories
              categoryId={selectedCategoryId}
              categoryName={selectedCategoryName}
            />
          )}
        </div>
      </div>
    </>
  );
}
