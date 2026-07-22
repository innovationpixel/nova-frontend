import React from 'react';
import { Dropdown } from 'react-bootstrap';
import ApexCharts from 'apexcharts';
import { SelectPicker} from 'rsuite';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import MainTitle from '../../elements/MainTitle';
import { IMAGES, SVGICON } from '../../constant/theme';
import BalanceBarChart from '../../elements/dashboard/BalanceBarChart';
import { Link } from 'react-router-dom';
import LastestTransaction from '../../elements/dashboard/LastestTransaction';


const ProjectAreaChart = loadable(() =>
 	pMinDelay(import("../../elements/dashboard/ProjectAreaChart"), 1000)
);

const infoBlog = [
	{ image: IMAGES.QuickPart1, name:'Nadila Adja', amount:'$ 12.568,60'},
	{ image: IMAGES.QuickPart2, name:'Portu Studio', amount:'$ 10.128,60'},
	{ image: IMAGES.QuickPart3, name:'Kleon Studio', amount:'$ 14.100,50'},
];

const recentActivity = [
	{title:'Payment', icon:SVGICON.Payment, amount:'+$2000'},
	{title:'Subcription', icon:SVGICON.Subscrib, amount:'-$120'},
];

const DropdownBlog = () =>{
	return(
		<Dropdown className="custom-dropdown">
			<Dropdown.Toggle as="div" className="btn sharp btn-primary tp-btn i-false">
				{SVGICON.DropdownIcon}
			</Dropdown.Toggle>
			<Dropdown.Menu  drop="end" className="dropdown-menu-end">
				<Dropdown.Item>Option 1</Dropdown.Item>
				<Dropdown.Item>Option 2</Dropdown.Item>
				<Dropdown.Item>Option 3</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	)
}

const ChartData = [
    {label:'This Month', value:'This Month'},
    {label:'Week', value:'Weeks'},
    {label:'Today', value:'Today'},
];

const Banking = () => {			
	const projectSeries = (value) => {		
		ApexCharts.exec('assetDistribution2', 'toggleSeries', value)
	}	
	return(
		<>
			<div className="row">
				<div className="col-xl-12">
					<MainTitle parent="Dashboard" children="Banking"/>
				</div>
				<div className="col-xl-6">
					<div className="row">
						<div className="col-xl-12">
							<div className="card your_balance">
								<div className="card-header border-0">
									<div>
										<h2 className="heading mb-1">Your Balance</h2>
										<span>June 1, 2024, 08:22 AM</span>
									</div>
								</div>
								<div className="card-body pt-0 custome-tooltip pb-xl-3 pb-0">
									<div className="row gx-0">
										<div className="col-xl-4 col-sm-4">
											<div className="mothly-income">
												<span>This Month</span>
												<h4>$23,741.00 <span className="ms-1"> + 15%</span></h4>
											</div>
											<div className="balance_data">
												<div className="balance-icon income">
													{SVGICON.IncomeIcon}
												</div>
												<div className="balance_info">
													<span className="text-success">Income</span>
													<h4>$23,741.00</h4>
												</div>
											</div>
											<div className="balance_data">
												<div className="balance-icon outcome">
													{SVGICON.IncomeIcon}
												</div>
												<div className="balance_info">
													<span className="text-danger">Outcome</span>
													<h4>$23,741.00</h4>
												</div>
											</div>
										</div>
										<div className="col-xl-8 col-sm-8">
											<div id="barChart">
												<BalanceBarChart />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-12">
							<LastestTransaction />
						</div>
					</div>
				</div>
				<div className="col-xl-6">
					<div className="row">
						<div className="col-md-6 col-xl-6 col-xxl-12" >
							<div className="card quick_payment">
								<div className="card-header border-0 pb-0">
									<h2 className="heading">Quick Payment</h2>
								</div>
								<div className="card-body p-0">
									{infoBlog.map((item, ind)=>(
										<div className="quick-info" key={ind}>
											<div className="quick-content">
												<span className="quick_img">
													<img src={item.image} className="avtar avtar-lg" alt="" />
												</span>
												<div className="user-name">
													<span>{item.name}</span>
													<h6>{item.amount}</h6>													
												</div>
											</div>
											<div className="count">
												<span>09/09/2023</span>
											</div>
										</div>
									))}									
								</div>
								<div className="card-footer border-0">
									<Link to={"#"} className="btn btn-primary w-100 mb-3">New Transfer</Link>
								</div>
							</div>
						</div>
						<div className="col-md-6 col-xl-6 col-xxl-12">
							<div className="row">								
								<div className="col-xl-12">
									<div className="card prim-card">
										<div className="card-body py-3">
											<h4 className="number">1234 5678 9012 3456</h4>
											<div className="d-flex align-items-center justify-content-between">
												<div className="prim-info">
													<span>Card Holder</span>
													<h4>Nella Vita</h4>
												</div>
												<div className="master-card">
													{SVGICON.MasterCard}
													<span className="text-white d-block mt-1">Master Card</span>
												</div>
											</div>
										</div>
									</div>
								</div>							
								<div className="col-xl-12">
									<div className="card recent-activity">
										<div className="card-header pb-0 border-0 pt-3">
											<h2 className="heading mb-0">Recent Activity</h2>
										</div>
										<div className="card-body p-0 pb-3">
											{recentActivity.map((item, ind)=>(
												<div className="recent-info" key={ind}>
													<div className="recent-content">
														<span className="recent_icon">
															{item.icon}
														</span>
														<div className="user-name">
															<h6>{item.title}</h6>
															<span>2 March 2024, 13:45 PM</span>
														</div>
													</div>
													<div className="count">
														<span>{item.amount}</span>
													</div>
												</div>
											))}																						
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-12">
							<div className="card crypto-chart ">
								<div className="card-header pb-0 border-0 flex-wrap">
									<div>
										<div className="chart-title mb-3">
											<h2 className="heading">Project Statistic</h2>	
										</div>
										<div className="d-flex align-items-center mb-2">
											<div className="round weekly" id="dzOldSeries">
												<div>
													<input type="checkbox" id="checkbox1" 
														value="Persent" onClick={()=>projectSeries('Persent')}
														name="radio" 
													/>
													<label htmlFor="checkbox1" className="checkmark"></label>
												</div>
												<div>
													<span className="fs-14">This Week</span>
													<h4 className="fs-5 font-w600 mb-0">1.982</h4>
												</div>
											</div>
											<div className="round " id="dzNewSeries">
												<div>
													<input type="checkbox" id="checkbox" name="radio" 
														value="Visitors" onClick={()=>projectSeries('Visitors')}
													/>
													<label htmlFor="checkbox" className="checkmark"></label>
												</div>
												<div>
													<span className="fs-14">This Week</span>
													<h4 className="fs-5 font-w600 mb-0">1.982</h4>
												</div>	
											</div>
										</div>
									</div>
									<div className="p-static">
										<div className="d-flex align-items-center mb-3 ">											
											<SelectPicker
                                                className='select-data me-sm-4 me-2'
                                                data={ChartData}
                                                searchable={false}  
                                                placeholder="This Month"                                    
                                            />
											<DropdownBlog />
										</div>
										<div className="progress-content">
											<div className="d-flex justify-content-between">
												<h6>Total</h6>
												<span className="pull-end">3.982</span>
											</div>
											<div className="progress mt-1">
												<div className="progress-bar bg-primary" style={{width: "60%", height:	"100%" }} >
													<span className="sr-only">60% Complete</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="card-body pt-2 custome-tooltip">									
									<ProjectAreaChart />									
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			
		</>
	)
}
export default Banking;