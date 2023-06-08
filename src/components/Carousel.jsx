import React, { useState, useEffect } from 'react';
import images from "../images/images.jpg";
import images_1 from "../images/images_1.jpg";
import images_2 from "../images/images_2.jpg";
import images_3 from "../images/images_3.jpg";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Carousel.css';
import slider from "../data/slider";

const CarouselPage = () => {
    // const [index, setIndex] = useState(0);
    // const [data, setData] = useState(slider)
    const [screenWidth, setScreenWidth] = useState(`${window.innerWidth - 20}`)
    const length = 3;

    useEffect(() => {
        setScreenWidth(`${window.innerWidth - 20}`)
    }, [])

    return (
        <Carousel className="carousel" autoPlay infiniteLoop stopOnHover renderThumbs={ (children) => null}>
            {slider.map((item,index) => (
                <img key={index} className='p-2 hover:scale-105 ease-in-out duration-300' style={{ width: `${screenWidth}px`, height: "400px", display: "inline-block", cursor: "pointer" }} alt='/' src={item.img} />
            ))}
        </Carousel>
    );
};

export default CarouselPage;

  // const scrollLeft=()=>{
  //   var slider = document.getElementById("slider")
  //   slider.scrollLeft = slider.scrollLeft - screenWidth
  // }
  // const scrollRight=()=>{
  //   var slider = document.getElementById("slider")
  //   slider.scrollLeft = slider.scrollLeft + screenWidth
  // }

  // useEffect(()=>{
  //   setScreenWidth(`${window.innerWidth - 20}`)
  //   //console.log("screenWidth",screenWidth)
  // },[])
  
    // const handlePrevious = () => {
    //     const newIndex = index - 1;
    //     setIndex(newIndex < 0 ? length - 1 : newIndex);
    // };

    // const handleNext = () => {
    //     const newIndex = index + 1;
    //     setIndex(newIndex >= length ? 0 : newIndex);
    // };

{/* {/* <MdChevronLeft onClick={scrollLeft} size={40}/> */ }
{/* <div id="slider" className="w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide" style={{width:`${screenWidth}px`,height:"400px", overflow:"scroll",overflowX:"scroll",whiteSpace:"nowrap",scrollBehavior:"smooth"}}>
        */}
{/* </div> */ }
{/* <MdChevronRight onClick={scrollRight} size={40}/>  */ }
{/* <button onClick={handlePrevious}>Previous</button>
            <button onClick={handleNext}>Next</button>
            <p>{index}</p> */}
