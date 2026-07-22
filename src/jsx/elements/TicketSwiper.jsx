import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import { SVGICON } from '../constant/theme';

const swiperData = [
    {title:'Ticket Solid', color:'blue', amount:'11,720'},
    {title:'Ticket Refund', color:'bg-secondary', amount:'2,345'},
    {title:'Canceled', color:'pink', amount:'999'},
    {title:'Rescheduled', color:'black', amount:'875'},
];

const TicketSwiper = () => {
    return (
        <Swiper 
            spaceBetween={40}
            slidesPerView={4}
            speed={1500}
            className="ticketing-Swiper position-relative overflow-hidden"
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
                    <div className={`card ticket ${item.color}`}>
                        <div className="back-image">
                            {SVGICON.ChainSvg}
                        </div>
                        <div className="card-body">
                            <div className="title">
                                <svg className="rounded" width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="0.425781" width="8" height="8" fill="#FCFCFC"/>
                                </svg>
                                <h4>{item.title}</h4>
                            </div>
                            <div  className="chart-num">
                                <h2>{item.amount}</h2>
                            </div>
                        </div>	
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>	
    );
};

export default TicketSwiper;