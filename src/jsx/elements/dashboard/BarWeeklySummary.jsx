import React from "react";
import ReactApexChart from "react-apexcharts";

class BarWeeklySummary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
        series: [
          {
            name: 'Inflation',
			  data: [10, 15, 8, 7, 12, 5,10]
          }
        ],
			options: {
				  chart: {
                    id: 'assetDistribution',
                    type: "bar",
                    height: 150,
                    toolbar: {
                        show: false,
                    },
				  },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '40%',
                        borderRadius: 5,                        
                        colors: {
                            backgroundBarColors: ['#eee','#eee','#eee','#eee','#eee','#eee'],
                            backgroundBarOpacity: 1,
                            backgroundBarRadius: 5,
                        },                   
                    },
                },
                colors:['var(--primary)'],               
                xaxis: {
                    show: false,
                    axisBorder: {
                        show: false,
                    },
                    axisTicks:{
                        show: false,
                    },
                    labels: {
                        show: true,
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
                    
                    categories: ['Sun', 'Mon', 'Tue','wed','Thu','Fri','Sat']
                },
                yaxis: {
                    show: false
                },
                grid: {
                    show: false,
                },
                toolbar: {
                    enabled: false,
                },
                dataLabels: {
                  enabled: false,
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
                            offsetX: -10,
                            offsetY: 0
                        }
                    }
                }],
			}, 
		};
	}

  
	render() {
		  return (			           
			  <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={150}  />			 
		  );
	}
}

export default BarWeeklySummary;