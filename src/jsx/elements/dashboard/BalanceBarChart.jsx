import React from "react";
import ReactApexChart from "react-apexcharts";

const series= [
    {
        name: "New Clients",
        data: [50, 100, 80, 50, 100, 130, 150 ]
    }  
]
const options= {
    chart: {
        type: "bar",
        height: 200,
        stacked: true,
        toolbar: {
            show: false,
        },
        offsetX:0,
    },
    plotOptions: {
        bar: {
            columnWidth: "15%",
            endingShape: "rounded",
            startingShape: "rounded",
            borderRadius: 5,                
            colors: {
                backgroundBarColors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff','#ffffff','#ffffff'],
                backgroundBarOpacity: 1,
                backgroundBarRadius: 5,
            },      
        },
        distributed: true
    },
    colors:['#FF4646','#ffff','#FF4646','#ffff','#FF4646','#ffff'],
    grid: {
        show:false,
        borderColor:'#f'
    },
    legend: {
        show: false
    },
    fill: {
        opacity: 1
    },
    dataLabels: {
        enabled: false,
        colors: ['#000'],
        dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 1,
            opacity: 1
        }
    },
    xaxis: {
        categories: ['Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat', 'Sun'],	
        labels: {
            style: {
                colors: '#666666',
                fontSize: '14px',
                fontFamily: 'poppins',
                fontWeight: 500,
                cssClass: 'apexcharts-xaxis-label',
            },
        },
        crosshairs: {
            show: false,
        },
        axisBorder: {
            show: true,
        },
        axisTicks: {
            show: false,
            borderType: 'solid',
            color: '#78909C',
            height: 6,
            offsetX: 0,
            offsetY: 0
        },
    },
    stroke:{
        color:'green',
        show: true, 
        curve: 'smooth',
        lineCap: 'round',
        width: 0,
    },
    yaxis: {
        show: false
    },
    tooltip: {
        x: {
            show: true
        }
    }        
  }

const BalanceBarChart = () =>{
  return (      
    <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={200}
    />      
  );
  
}
export default BalanceBarChart;
