import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import { SVGICON } from '../constant/theme';

const swiperData = [
    {design:SVGICON.Line1,icon: SVGICON.Bitcoin, title:'Bitcoin', color:'secondary', amount:'33.23'},
    {design:SVGICON.line2,icon: SVGICON.Ether, title:'Ethereum', color:'blue', amount:'42.50'},
    {design:SVGICON.line3,icon: SVGICON.litecoin, title:'Litecoin', color:'green', amount:'40.10'},
    {design:SVGICON.line4,icon: SVGICON.Ripple, title:'Ripplecoin', color:'pink', amount:'36.00'},
];

const CryptoSlider = () => {
    return (
        <>
            <Swiper 
                spaceBetween={40}
                slidesPerView={4}
                speed={1500}
                className="crypto-Swiper position-relative overflow-hidden"
                breakpoints={{
                    300: {
                        slidesPerView: 1,
                        spaceBetween: 30,
                    },	
                    576: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },
                    991: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                    1200: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                    1600: {
                        slidesPerView: 4,
                        spaceBetween: 30,
                    },
                }}
            >
                {swiperData.map((item, i)=>(
                    <SwiperSlide key={i}>
                        <div className={`card coin-card ${item.color}`}>
                            <div className="back-image">
                               {item.design}
                            </div>
                            <div className="card-body p-4">
                                <div className="title">
                                    <h4>{item.title}</h4>
                                    {item.icon}
                                </div>
                                <div  className="chart-num">
                                    <h2>${item.amount}</h2>
                                    <span>+12,4%</span>
                                </div>
                            </div>	
                        </div>                              
                    </SwiperSlide>
                ))}
            </Swiper>   
            
        </>
    );
};

export default CryptoSlider;