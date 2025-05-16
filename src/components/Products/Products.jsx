
import React, { useState } from 'react'
import RecentProducts from '../RecentProducts/RecentProducts'
import logo from "../../assets/logo.jpg";


export default function Products() {
    const [searchTerm, setSearchTerm] = useState("");
    return <> 
     <div className="container mx-full">

      <div className="my-5  ">
        <input
          type="text"
          placeholder="Search here .  .  .  ."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-100 w-full text-gray-800  px-4 mb-2 py-2 rounded focus:bg-transparent outline-none focus:shadow-[0_2px_10px_rgba(90,210,700,1)] transition-all text-lg"
        />
      </div>

      
      <RecentProducts searchTerm={searchTerm} />
    </div>

    </>
  
    }



