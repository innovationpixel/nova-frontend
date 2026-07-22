import React from "react";
import ReactApexChart from "react-apexcharts";


class OrdersAreaChart extends React.Component {  
	constructor(props) {
		super(props);
		this.state = {
        series: [{
                name: 'Net Profit',
                data: [70, 150, 100, 200, 100, 150, 150,70],
            }, 	
        ],
      options: {
        chart: {
            type: 'area',
            height: 100,
            width: 200, 
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false
            },
            sparkline: {
                enabled: true
            },           
        },
        colors:['#2696FD'],
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false,
        },
        stroke: {
            show: true,
            width: 2,
            curve:'smooth',
            colors:['var(--primary)'],
        },

        states: {
            normal: {
                filter: {
                    type: 'none',
                    value: 0
                }
            },
            hover: {
                filter: {
                    type: 'none',
                    value: 0
                }
            },
            active: {
                allowMultipleDataPointsSelection: false,
                filter: {
                    type: 'none',
                    value: 0
                }
            }
        },
        xaxis: {
            categories: ['Jan', 'feb', 'Mar', 'Apr', 'May'],
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false
            },
            labels: {
                show: false,
                style: {
                    fontSize: '12px',
                }
            },
            crosshairs: {
                show: false,
                position: 'front',
                stroke: {
                    width: 1,
                    dashArray: 3
                }
            },
            tooltip: {
                enabled: true,
                formatter: undefined,
                offsetY: 0,
                style: {
                    fontSize: '12px',
                }
            }
        },
        yaxis: {
            show: false,
        },
        fill: {
            type:'solid',
        opacity: 0.1,
        colors:'#2696FD'
        },
        tooltip: {
            enabled:false,
            style: {
                fontSize: '12px',
            },
            y: {
                formatter: function(val) {
                    return "$" + val + " thousands"
                }
            }
        },
            responsive: [{
              
                breakpoint: 1601,
                options:{
                    chart: {
                        height:80,
                    },
                    
                }
              
            }]
                    
			}, 
		};
	}

  
	render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={100}  />
        );
	}
}

export default OrdersAreaChart; 
