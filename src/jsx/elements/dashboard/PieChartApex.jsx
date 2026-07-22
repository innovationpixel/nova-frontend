import React from "react";
import ReactApexChart from "react-apexcharts";

class PieChartApex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			series: [10,20,35,20],
			options: {
				chart: {
					type: 'donut',
					height: 250,     
					innerRadius: 50,               
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
				colors:[ '#252289', '#D7D7D7' ,'#9568FF', 'var(--primary)'],
				legend: {
					position: 'bottom',
					show:false
				},
				responsive: [					
					{
						breakpoint: 768,
						options: { 
						 	chart: {
								height:200
						  	},
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
				height={250} 
			/>
			
		);
	}
}

export default PieChartApex;