import React from "react";
import ReactApexChart from "react-apexcharts";


class ProfitAreaChart extends React.Component {  
	constructor(props) {
		super(props);
		this.state = {
            series: [{
				name: 'Aplication Sent',
				data: [40, 55, 15,55,40, 55, 15,55,60,65,55,60,65]
			}, {
				name: 'Appllication Answered',
				data: [40, 55, 35,55,40, 55, 35,55,60,65,55,60,65]
			}, {
				name: 'Hired',
				data: [40, 17, 55, 55,40, 17, 55, 55,60,65,55,60,65]
			}],
            options: {
                chart: {
                    type: 'bar',
                    height: 150,
                    width:230,
                    stacked: true,				
                    offsetX: -20,      
                    toolbar: {
                        show: false,
                    }            
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '30%',
                        endingShape: "rounded",
                        startingShape: "rounded",
                        backgroundRadius: 20,
                        colors: {
                            backgroundBarColors: ['#ECECEC', '#ECECEC', '#ECECEC', '#ECECEC'],
                            backgroundBarOpacity: 1,
                            backgroundBarRadius: 3,
                        },
                    },
                    
                },
                colors:['#28BE9D', '#28BE9D', '#28BE9D'],
                xaxis: {
                    show: false,
                    axisBorder: {
                        show: false,
                    },
                    axisTicks:{
                        show: false,
                    },
                    labels: {
                        show: false,
                        style: {
                            colors: '#828282',
                            fontSize: '14px',
                            fontFamily: 'Poppins',
                            fontWeight: 'light',
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    },
                    
                    crosshairs: {
                        show: false,
                    },
                    
                },
                yaxis: {
                    show: false,
                    
                },
                grid: {
                    show: false,
                },
                toolbar: {
                    enabled: false,
                },
                dataLabels: {
                  enabled: false
                },
                legend: {
                    show:false
                },
                fill: {
                    opacity: 1
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -20,
                            offsetY: 0
                        }
                    }
                }],
            }
        };
	}

  
	render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} 
                type="bar" 
                height={150}  
                width={230}
            />
        );
	}
}

export default ProfitAreaChart; 