import React, { useState, useEffect } from 'react';
import { Circle, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footbar from '../components/Footbar';
import LatestCollection from "../components/LatestCollection"
import BestSeller from "../components/BestSeller"
import OurPolicy from '../components/OurPolicy';
import Title from '../components/Title';
import {Link} from "react-router-dom"

const heroData = [
  {
    text1: "Summer Collection",
    text2: "Amazing Offers Up to 70% OFF",
    description: "Discover our exclusive summer lineup with incredible discounts on all items.",
    buttonText: "Shop Now",
    bgImage: "/a.jpg",
    accentColor: "from-blue-500 to-teal-400"
  },
  {
    text1: "New Arrivals",
    text2: "Fresh Styles Just Landed",
    description: "Be the first to explore our newest collection of trendy fashion items.",
    buttonText: "Explore Now",
    bgImage: "/b.jpg",
    accentColor: "from-purple-500 to-pink-500"
  },
  {
    text1: "Winter Essentials",
    text2: "Stay Warm in Style",
    description: "Get ready for the cold season with our premium winter collection.",
    buttonText: "Discover More",
    bgImage: "/c.jpg",
    accentColor: "from-amber-500 to-orange-500"
  },
  {
    text1: "Clearance Sale",
    text2: "Final Reductions - Everything Must Go!",
    description: "Huge discounts on last season's items. Limited stock available.",
    buttonText: "Grab Deals",
    bgImage: "/d.jpg",
    accentColor: "from-red-500 to-rose-500"
  }
];

const Hero = ({ heroCount, heroData, setHeroCount, isPlaying, togglePlay }) => {
  const currentSlide = heroData[heroCount];
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    let progressInterval;
    if (isPlaying) {
      // Reset progress when slide changes
      setProgressWidth(0);

      progressInterval = setInterval(() => {
        setProgressWidth(prev => {
          if (prev >= 100) {
            // When progress completes, move to next slide
            setHeroCount(prevCount => (prevCount === heroData.length - 1 ? 0 : prevCount + 1));
            return 0;
          }
          return prev + 0.3; // Increment by 0.3% 
        });
      }, 10);
    } else {
      setProgressWidth(0);
    }

    return () => clearInterval(progressInterval);
  }, [isPlaying, heroCount, setHeroCount, heroData.length]);

  const handleDotClick = (index) => {
    setHeroCount(index);
    setProgressWidth(0);
  };

  const handlePrevClick = () => {
    setHeroCount(heroCount === 0 ? heroData.length - 1 : heroCount - 1);
    setProgressWidth(0);
  };

  const handleNextClick = () => {
    setHeroCount(heroCount === heroData.length - 1 ? 0 : heroCount + 1);
    setProgressWidth(0);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${currentSlide.bgImage})` }}
      >
        {/* <div className={`absolute inset-0 bg-gradient-to-r ${currentSlide.accentColor} opacity-80`}></div> */}
        <div className={`absolute inset-0 opacity-80`}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 md:px-8 lg:px-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fadeIn">
            {currentSlide.text1}
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-6 animate-fadeIn delay-200">
            {currentSlide.text2}
          </h2>
          <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto animate-fadeIn delay-400">
            {currentSlide.description}
          </p>
          <button className={`bg-white text-gray-900 font-bold py-3 px-8 rounded-full 
            hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 
            shadow-lg animate-fadeIn delay-600`}>
              <Link to={"/collections"}>
            {currentSlide.buttonText}
              </Link>
          </button>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
        {heroData.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`p-2 transition-all duration-300 ${index === heroCount ? 'transform scale-125' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <Circle
              size={12}
              fill={index === heroCount ? "white" : "transparent"}
              stroke="white"
            />
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrevClick}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 
        hover:bg-opacity-30 p-3 rounded-full transition-all duration-300 z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} className="text-black" />
      </button>

      <button
        onClick={handleNextClick}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 
        hover:bg-opacity-30 p-3 rounded-full transition-all duration-300 z-20"
        aria-label="Next slide"
      >
        <ChevronRight size={28} className="text-black" />
      </button>

      {/* Play/Pause Button */}
      {/* <button 
        onClick={togglePlay}
        className="absolute bottom-8 right-8 bg-white bg-opacity-20 hover:bg-opacity-30 
        p-3 rounded-full transition-all duration-300 z-20"
        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
      >
        {isPlaying ? (
          <Pause size={24} className="text-black" />
        ) : (
          <Play size={24} className="text-black" />
        )}
      </button> */}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-30 z-20">
        {/* <div 
          className="h-full bg-black transition-all duration-100"
          style={{ width: `${progressWidth}%` }}
        >
        </div> */}
      </div>
    </div>
  );
};

const Home = () => {
  const [heroCount, setHeroCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);


  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setHeroCount(prevCount => (prevCount === heroData.length - 1 ? 0 : prevCount + 1));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <div className="relative bg-gradient-to-l from-slate-700 to-slate-900">
        <Hero
          heroCount={heroCount}
          heroData={heroData}
          setHeroCount={setHeroCount}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
        />



        {/* Additional content for the home page can go here */}
        <div className="container mx-auto px-4 py-12">
          {/* <h2 className="text-3xl font-bold text-center mb-8 ">Featured Categories</h2> */}
           <Title text1={"Featured"} text2={"Categories"} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Men's Fashion</h3>
              <p className="text-gray-600">Latest trends in men's clothing and accessories</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Women's Fashion</h3>
              <p className="text-gray-600">Stylish outfits and accessories for women</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Electronics</h3>
              <p className="text-gray-600">Cutting-edge gadgets and devices</p>
            </div>
          </div>
        </div>
        <div className='w-[100%] min-h-[70px] flex items-center justify-center gap-[10px] flex-col'>
          <LatestCollection />
        </div>
        <div className='w-[100%] min-h-[70px] flex items-center justify-center gap-[10px] flex-col'>
          <BestSeller />
        </div>
        <div className='w-[100%] min-h-[70px] flex items-center justify-center gap-[10px] flex-col'>
          <OurPolicy />
        </div>
      </div>
    </>

  );
};

export default Home;