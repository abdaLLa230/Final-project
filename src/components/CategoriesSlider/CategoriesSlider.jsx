import React from 'react'
import style from"./CategoriesSlider.module.css"
import axios from 'axios'
import Categories from './../Categories/Categories';
import Slider from "react-slick";
import { useQuery } from '@tanstack/react-query'




export default function CategoriesSlider() {


  
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,  
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 1000,
  
    responsive: [
      {
        breakpoint: 1280, 
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 1024, 
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 768, 
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480, 
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      }
    ]
  };
  




function getCategories(){
  return axios.get(`https://ecommerce.routemisr.com/api/v1/categories`)
}


  let {isFetching , isLoading , error , isError , data} =useQuery({
    queryKey : ["categoriesslider"] , 
    queryFn : getCategories,
    staleTime: 60000, 
  cacheTime: 300000, 
  refetchOnWindowFocus: false,
    

  })


if(isError){
  return <h2> {error }</h2>
}

if(isFetching){
 return  
}


  return <>
  
    <h1 className='flex text-lg pt-10  justify-start font-serif'> Shop Popular Categories </h1>
    <Slider {...settings}>
    
     {data?.data?.data.map((category,index)=> 
      
        <div className='' key={index} >
          <img src={category.image} loading="lazy" className='h-[220px] w-full object-cover pb-1 ' alt="" />
          <h4 className='bg-slate-300'> {category.name}</h4>
        </div>  
   
    )}
    </Slider>
    
    </>
  
}
