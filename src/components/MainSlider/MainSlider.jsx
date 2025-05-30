import React, { useState, useEffect } from 'react';
import style from "./MainSlider.module.css";
import slide1 from "../../assets/slider-image-1.jpeg";
import slide2 from "../../assets/slider-image-2.jpeg";
import slide3 from "../../assets/slider-image-3.jpeg";
import slide4 from "../../assets/grocery-banner.png";
import slide5 from "../../assets/grocery-banner-2.jpeg";
import Slider from "react-slick";

export default function MainSlider() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 750); 

    return () => clearTimeout(timer); 
  }, []);

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
  };

  return (
    <>
       
        <div className="grid  md:my-3 grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-screen-lg mx-auto items-center">
         
          <div className="col-span-1 md:pt-3 md:col-span-2">
            <Slider {...settings}>
              <div>
                <img
                  src={slide1}
                  alt="Slide 2"
                  className="w-full h-auto max-h-[210px] md:max-h-[260px] lg:max-h-[280px] rounded-lg shadow-lg object-cover"
                />
              </div>

              <div>
                <img
                  src={slide2}
                  alt="Slide 1"
                  className="w-full h-auto max-h-[210px] md:max-h-[260px] lg:max-h-[280px] rounded-lg shadow-lg object-cover"
                />
              </div>

              <div>
                <img
                  src={slide3}
                  alt="Slide 3"
                  className="w-full h-auto max-h-[210px] md:max-h-[260px] lg:max-h-[280px] rounded-lg shadow-lg object-cover"
                />
              </div>
            </Slider>
          </div>

          
          <div className="col-span-1 flex flex-col pt-2 gap-5">
            <img
              src={slide4}
              alt="Slide 4"
              className="w-full max-h-[210px] md:h-[122px] lg:h-[132px] rounded-lg shadow-lg object-cover"
            />
            <img
              src={slide5}
              alt="Slide 5"
              className="w-full max-h-[210px] md:h-[122px] lg:h-[132px] rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>
      
    </>
  );
}
