import React from "react";
import ReactApexChart from "react-apexcharts";

class WeeklySummarChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			series: [60, 115, 155],
			options: {
				chart: {
					type: 'donut',
					width:130,
		            height:130,   
					innerRadius: 8,               
				},                
				dataLabels: {
				  enabled: false,
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
                colors:['#d5dfe7', '#FF9F00', '#FD5353'],
				legend: {
					position: 'bottom',
					show:false
				},
				responsive: [					
					{
						breakpoint: 1200,
                        options: {
                            chart: {
                                width: 90,
                                height: 90
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
					}
				]
			},
		};
	}

	render() {
		return (			
			<ReactApexChart
				options={this.state.options}
				series={this.state.series}
				type="donut"
				height={130} 
				width={130} 

			/>
			
		);
	}
}

export default WeeklySummarChart;