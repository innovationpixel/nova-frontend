import React from "react";
import ReactApexChart from "react-apexcharts";

class InvoiceChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			series: [70],
			options: {
				chart: {
					type: 'radialBar',
					offsetY: 0,
                    height:250,
                    sparkline: {
                        enabled: true
                    }              
				},   
				plotOptions: {
                    radialBar: {
                        startAngle: -135,
                        endAngle: 225,
                        track: {
                          background: "#F1EAFF",
                          strokeWidth: '100%',
                          margin: 5,
                        },
                        
                        hollow: {
                          margin: 50,
                          size: '65%',
                          background: '#F1EAFF',
                          image: undefined,
                          imageOffsetX: 0,
                          imageOffsetY: 0,
                          position: 'front',
                        },
                        
                        dataLabels: {
                          name: {
                            show: false
                          },
                          value: {
                            offsetY: 5,
                            fontSize: '12px',
                            color:'#886CC0',
                            fontWeight:700,
                          }
                        }
                    }
                    
			  	},
                grid: {
                    padding: {
                      top: -10
                    }
                },
				fill: {
                    type: 'gradient',
                    gradient: {
                      shade: 'dark',
                      type: 'horizontal',
                      shadeIntensity: 0.5,
                      gradientToColors: ['var(--primary)'],
                      inverseColors: true,
                      opacityFrom: 0.5,
                      opacityTo: 1,
                      stops: [0, 100]
                    }
                },
                stroke: {
                    lineCap: 'round'
                },
                labels: ['Average Results'],
				legend: {
					position: 'bottom',
					show:false
				},
				responsive: [					
					{
						breakpoint: 1600,
                        options: {
                        chart: {
                            height:250
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
				type="radialBar"
				height={250} 
			/>
			
		);
	}
}

export default InvoiceChart;