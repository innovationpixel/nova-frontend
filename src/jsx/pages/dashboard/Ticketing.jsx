import React, { useState } from 'react';
import MainTitle from '../../elements/MainTitle';
import TicketSwiper from '../../elements/TicketSwiper';
import { SVGICON } from '../../constant/theme';
import { Dropdown, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { SelectPicker } from 'rsuite';

const transactionTable = [
    {icon: SVGICON.ArrowRed,name:'Marilyn Workman', status:'Complete', mail:'vita@mail.com ', color:'success', amount:'60.00'},
    {icon: SVGICON.ArrowGreen,name:'Talan Siphron', status:'Panding', mail:'ahmad@mail.com ', color:'primary', amount:'70.00'},
    {icon: SVGICON.ArrowGreen,name:'Thomas Khun', status:'Unpaid', mail:'kevin@mail.com', color:'pink', amount:'65.00'},
    {icon: SVGICON.ArrowRed,name:'Soap Khun', status:'Panding', mail:'soap@mail.com ', color:'primary', amount:'50.50'},
    {icon: SVGICON.ArrowGreen,name:'Raja Ahmad', status:'Complete', mail:'ahmad@mail.com', color:'success', amount:'70.00'},
    {icon: SVGICON.ArrowRed,name:'Jorden Vill', status:'Panding', mail:'jordan@mail.com ', color:'primary', amount:'63.00'},
    {icon: SVGICON.ArrowGreen,name:'Manthan Khun', status:'Unpaid', mail:'mantha@mail.com ', color:'pink', amount:'78.00'},
];

const eventDataBlog = [
    {date:'01', month:'Mar', title:'Design Webinar with Team'},
    {date:'03', month:'Mar', title:'Anime Music Event'},
    {date:'06', month:'Mar', title:'Top Management Meeting'},
    {date:'09', month:'Mar', title:'Vacation'},
    {date:'10', month:'Mar', title:'Usability Testing'},
    {date:'11', month:'Mar', title:'Design Webinar with Team'},
    {date:'13', month:'Mar', title:'Concert'},
    {date:'15', month:'Mar', title:'Development Webinar with Team'},
    {date:'17', month:'Mar', title:'Design Webinar event'},
    {date:'18', month:'Mar', title:'Design Teasting with Team'},
];



const ChartData = [
    {label:'This Month', value:'This Month'},
    {label:'Week', value:'Weeks'},
    {label:'Today', value:'Today'},
];

const Ticketing = () => {
    const [modelOpen,setModelOpen] = useState(false);
    const [refreshToggle, setRefreshToggle] = useState(false);
    const [datas, setDatas] = useState(eventDataBlog)
    const hendelClick = () => {
        setRefreshToggle(true);
        setTimeout(() => {
          setDatas([
            ...datas,
            datas[Math.floor(Math.random() * Math.floor(datas.length - 1))],            
          ]);
          setRefreshToggle(false);
        }, 1000);
    };
    return (
        <>
            <div className="row">
                <div className="col-xl-12">
                    <div className="row">
                        <div className="col-xl-12">
                            <MainTitle parent="Dashboard" children="Ticketing" />                            
                        </div>
                    </div>   
                    <div className="row wow fadeInUp main-card" data-wow-delay="0.7s">
                        <div className="col-xxl-8 col-xl-9">
                            <TicketSwiper />
                            <div className="row">
                                <div className="col-xl-12 wow fadeInUp" data-wow-delay="1.5s">
                                    <div className="card lastest_trans">
                                        <div className="card-header border-0 flex-wrap">
                                            <h2 className="heading">Lastest Transaction</h2>
                                            <div className="d-flex align-items-center">                                                
                                                <SelectPicker
                                                    className='select-data me-sm-4 me-2'
                                                    data={ChartData}
                                                    searchable={false}                                                
                                                />
                                                <Dropdown>
                                                    <Dropdown.Toggle  as="div" className="btn-link btn sharp tp-btn btn-primary pill i-false">
                                                        {SVGICON.DropdownIcon}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu drop={"end"} className="dropdown-menu-end">
                                                        <Dropdown.Item>Delete</Dropdown.Item>
                                                        <Dropdown.Item>Edit</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <div className="card-body py-0">
                                            <div className="table-responsive">
                                                <table className="table-responsive-lg table display mb-0 order-table card-table text-black no-footer student-tbl">
                                                    <tbody>
                                                        {transactionTable.map((item, i)=>(
                                                            <tr key={i}>
                                                                <td className="whitesp-no p-0">
                                                                    <div className="d-flex py-sm-3 py-1 align-items-center trans-info">
                                                                        <span className="icon me-3">
                                                                            {item.icon}	
                                                                        </span>
                                                                        <div>
                                                                            <h6 className="font-w500 fs-15 mb-0">{item.name}</h6>
                                                                            <span className="fs-14 font-w400"><Link to={"/app-profile"}>@thomaskhuncoro</Link></span>
                                                                        </div>												
                                                                    </div>
                                                                </td>
                                                                <td className="whitesp-no">
                                                                    <Link to={"/ecom-invoice"} className="tb-mail">{item.mail}</Link>
                                                                </td>
                                                                <td className="text-end">
                                                                    <span className={`btn light btn-sm btn-${item.color}`}>
                                                                        {item.color === "success" ?  SVGICON.DoubleRight : item.color === "primary" ?  
                                                                            SVGICON.CircleQuestion
                                                                            :
                                                                            SVGICON.PinkQuestion
                                                                        }                                                                        
                                                                        {" "}{item.status}
                                                                    </span>
                                                                </td>
                                                                <td className="doller">${item.amount}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>   
                                            </div>   
                                        </div>  
                                        <div className="table-pagenation pt-3 mt-0">
                                            <p>Showing <span>1-5</span>from <span>100</span>data</p>
                                            <nav>
                                                <ul className="pagination pagination-gutter pagination-primary no-bg">
                                                    <li className="page-item page-indicator">
                                                        <Link to={"#"} className="page-link" >
                                                            <i className="fa-solid fa-angle-left" />
                                                        </Link>
                                                    </li>
                                                    <li className="page-item "><Link to={"#"} className="page-link">1</Link></li>
                                                    <li className="page-item active"><Link to={"#"} className="page-link">2</Link></li>
                                                    <li className="page-item"><Link to={"#"} className="page-link">3</Link></li>
                                                    <li className="page-item page-indicator">
                                                        <Link to={"#"} className="page-link">
                                                            <i className="fa-solid fa-angle-right" />
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div> 
                                    </div>   
                                </div>   
                            </div>   
                        </div>
                        <div className="col-xxl-4 col-xl-3">
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="card event-agenda">
                                        <div className="card-header border-0 pb-0">
                                            <div>
                                                <h2 className="heading">Event Agenda</h2>
                                            </div>
                                            <div className="add-icon">
                                                <Link to={"#"} className="add" onClick={()=>setModelOpen(true)}>
                                                   {SVGICON.PlusSign}
                                                </Link>							
                                            </div>	
                                        </div>
                                        <div className="card-body dz-scroll recent-activity-wrapper p-3 pt-0">
                                            {datas && datas.map((item, ind)=>(
                                                <div className="d-flex align-items-center event" key={ind}>
                                                    <div className="event-date">
                                                        <h4>{item.date}</h4>
                                                        <span>{item.month}</span>
                                                    </div>
                                                    <div className="event-info">
                                                        <h6><Link to="/app-profile">{item.title}</Link></h6>
                                                        <span>1 March 2024 - 10.00 AM</span>
                                                    </div>                                                                            
                                                </div>
                                            ))}
                                        </div>
                                        <div className="card-footer text-center border-0 pt-0">
                                            <Link to={"#"} className="btn btn-block light btn-secondary dz-load-more"
                                                onClick={() => hendelClick()}
                                            >
                                                {refreshToggle && <i className="fa fa-refresh" />}
                                                View More
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={modelOpen} onHide={setModelOpen} centered> 
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Event Agenda</h5>
                    <button type="button" className="btn-close" onClick={()=>setModelOpen(false)}></button>
                </div>
                <div className="modal-body">
                    <div className="mb-3 d-block">
                    <label  className="form-label d-block mb-2">Event Name</label>
                        <input type="text" className="form-control w-100 mb-0" placeholder="Sales report" />
                    </div>
                    <div className="d-flex align-items-center">
                        <div className="mb-3 d-block me-3 w-100">
                            <label className="form-label d-block mb-2">Form</label>
                            <input type="date" className="form-control mb-0" />
                        </div>
                        <div className="mb-3 d-block w-100">
                            <label className="form-label d-block mb-2">To</label>
                            <input type="date" className="form-control mb-0" />
                        </div>
                    </div>
                    <div className="mb-3 d-block">
                        <label className="form-label d-block mb-2">Where</label>
                        <input type="text" className="form-control w-100 mb-0" placeholder="Add resource" />
                    </div>
                    <div className="mb-3 d-block">
                        <label className="form-label d-block mb-2">Guests</label>
                        <input type="text" className="form-control w-100 mb-0" placeholder="Add guests" />
                    </div>
                    <div className="mb-3 d-block">
                        <label className="form-label d-block mb-2">Agenda</label>
                        <textarea className="form-control w-100 mb-0" rows="2" placeholder="What is agenda for this event?" defaultValue={""} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className=" btn btn-danger light" onClick={()=>setModelOpen(false)}>Close</button>
                    <button type="button" className="btn btn-primary">Save changes</button>
                </div>                    
            </Modal>	
        </>
    );
};

export default Ticketing;