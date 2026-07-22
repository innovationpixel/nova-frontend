import React from "react";
import ReactApexChart from "react-apexcharts";

class WelletSidePieChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {       
            series: [10,20,35],         
			options: {
				chart: {
                    type: 'donut',
                    height:170,
                    innerRadius: 50,  
				},
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width: 0,
                },
                plotOptions: {
                    pie: {
                        startAngle: 0, 
                         endAngle: 360,
                        donut: {
                             size: '80%',
                             labels: {
                                 show:true,
                                 name: {
                                    
                               },
                                 
                             },
                        },
                        
                    },
                },
                colors:[ '#EEEEEE', '#2BC844' ,'#FD5353', 'var(--primary)'],
                legend: {
                    position: 'bottom',
                    show:false
                },
                responsive: [{
                    breakpoint: 768,
                    options: { 
                     chart: {
                        width:200
                      },
                    }
                }],
			}, 
		};
	}

  
	render() {
		  return (			           
			  <ReactApexChart options={this.state.options} series={this.state.series} type="donut" height={170}  />			 
		  );
	}
}

export default WelletSidePieChart;