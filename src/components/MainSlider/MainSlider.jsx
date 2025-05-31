import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import slide1 from "../../assets/slider-image-1.jpeg";
import slide2 from "../../assets/slider-image-2.jpeg";
import slide3 from "../../assets/slider-image-3.jpeg";
import slide4 from "../../assets/grocery-banner.png";
import slide5 from "../../assets/grocery-banner-2.jpeg";

export default function PremiumMainSlider() {
  const navigate = useNavigate();
  
  // Slider settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    fade: true,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    arrows: false
  };

  // Handle slide clicks
  const navigateTo = (path) => {
    navigate(path);
  };

  // Slide content configuration
  const mainSlides = [
    {
      image: slide1,title: "LUXURY COLLECTION",subtitle: "Discover Premium Quality",path: "/products"
    },
    {
      image: slide2,title: "NEW ARRIVALS",subtitle: "Fresh From Our Suppliers",
    },
    {
      image: slide3,title: "TRENDING NOW",subtitle: "What Everyone's Loving",path: "/products"
    }
  ];

  const bannerSlides = [
    {
      image: slide4,title: "SPECIAL OFFERS",
    },
    {
      image: slide5,title: "LIMITED EDITION",
    }
  ];

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 md:py-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
        
        {/* Main Luxury Slider */}
        <div className="lg:col-span-2 relative">
          <Slider {...sliderSettings}>
            {mainSlides.map((slide, index) => (
              <div key={index} className="relative overflow-hidden">
                <motion.div
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
                  className="cursor-pointer"
                  onClick={() => navigateTo(slide.path)}>
                  <img src={slide.image} alt={slide.title}
                    className="w-full h-[210px] md:h-[340px] object-cover rounded-xl"/>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end p-8">
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}>
                      <h2 className="text-3xl font-light text-white mb-1">{slide.title}</h2>
                      <p className="text-white/90 font-thin mb-4">{slide.subtitle}</p>
                      <button 
                        className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-full hover:bg-white/20 transition-all"
                        onClick={(e) => { e.stopPropagation();navigateTo(slide.path);}}> SHOP NOW
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Premium Side Banners */}
        <div className="flex flex-col gap-6">
          {bannerSlides.map((banner, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="relative overflow-hidden rounded-xl cursor-pointer group"
              onClick={() => navigateTo(banner.path)}>
              <img src={banner.image}alt={banner.title}
                className="w-full h-[170px] md:h-[160px] object-cover transition-transform duration-700 group-hover:scale-105"/>

              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <h3 className="text-xl font-light text-white mb-2">{banner.title}</h3>
                  <div className="w-12 h-px bg-white/60 mx-auto mb-3"></div>
                  <button className="text-xs text-white border border-white/40 px-4 py-1 rounded-full hover:bg-white/10 transition-all">
                    EXPLORE
                  </button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 
