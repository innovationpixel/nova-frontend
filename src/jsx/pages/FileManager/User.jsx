import React,{ useState} from 'react';
import {Link} from 'react-router-dom';
import {Dropdown, Modal} from 'react-bootstrap';

import DonutChart from '../../elements/User/DonutChart';
import { IMAGES, SVGICON } from '../../constant/theme';

const piechartBlog = [
    {title:'Invoices Made', percent:'90', bg:'rgba(1, 163, 255,1)'},
    {title:'Clients Growth', percent:'30', bg:'rgb(255, 209, 37,1)'},
    {title:'Projects Done', percent:'75', bg:'rgba(235, 98, 208,1)'},
    {title:'Income Increase', percent:'60', bg:'rgba(149, 104, 255,1)'},
];

const messageBlog = [
    {image:IMAGES.smallpic1, title:'Dedi Cahyadi', subtitle:'Head Manager'},
    {image:IMAGES.smallpic2, title:'Evans John', subtitle:'Programmer'},
    {image:IMAGES.smallpic3, title:'Brian Brandon', subtitle:'Graphic Designer'},
    {image:IMAGES.smallpic4, title:'Chynthia Lawra', subtitle:'Software Engineer'},
    {image:IMAGES.smallpic5, title:'Dedi Cahyadi', subtitle:'CEO'},
];

const User = () => {
    const [modelOpen,setModelOpen] = useState(false);
    const [refreshToggle, setRefreshToggle] = useState(false);
    const [datas, setDatas] = useState(messageBlog)
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
    return(
        <>  
            <div className="row">
                <div className="col-xl-9 col-xxl-8">                    
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="user card  ">
                                <div className="user-head">
                                    <div className="photo-content">
                                        <div className="cover-photo"></div>
                                    </div>
                                    <div className="user-info">
                                        <div className="user-photo">
                                            <img src={IMAGES.ProfileImg13} className="img-fluid rounded-circle" alt="" />
                                        </div>
                                        <div className="user-details">
                                            <div>
                                                <div className="profile-name">
                                                    <h3 className="name">Nadila Adja</h3>
                                                    <h5>UI Designer</h5>
                                                    <span>
                                                        <svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M8 0.5C5.87827 0.5 3.84344 1.34285 2.34315 2.84315C0.842855 4.34344 0 6.37827 0 8.5C0 13.9 7.05 20 7.35 20.26C7.53113 20.4149 7.76165 20.5001 8 20.5001C8.23835 20.5001 8.46887 20.4149 8.65 20.26C9 20 16 13.9 16 8.5C16 6.37827 15.1571 4.34344 13.6569 2.84315C12.1566 1.34285 10.1217 0.5 8 0.5ZM8 18.15C5.87 16.15 2 11.84 2 8.5C2 6.9087 2.63214 5.38258 3.75736 4.25736C4.88258 3.13214 6.4087 2.5 8 2.5C9.5913 2.5 11.1174 3.13214 12.2426 4.25736C13.3679 5.38258 14 6.9087 14 8.5C14 11.84 10.13 16.16 8 18.15ZM8 4.5C7.20887 4.5 6.43552 4.7346 5.77772 5.17412C5.11992 5.61365 4.60723 6.23836 4.30448 6.96927C4.00173 7.70017 3.92252 8.50444 4.07686 9.28036C4.2312 10.0563 4.61216 10.769 5.17157 11.3284C5.73098 11.8878 6.44371 12.2688 7.21964 12.4231C7.99556 12.5775 8.79983 12.4983 9.53073 12.1955C10.2616 11.8928 10.8864 11.3801 11.3259 10.7223C11.7654 10.0645 12 9.29113 12 8.5C12 7.43913 11.5786 6.42172 10.8284 5.67157C10.0783 4.92143 9.06087 4.5 8 4.5ZM8 10.5C7.60444 10.5 7.21776 10.3827 6.88886 10.1629C6.55996 9.94318 6.30362 9.63082 6.15224 9.26537C6.00087 8.89991 5.96126 8.49778 6.03843 8.10982C6.1156 7.72186 6.30608 7.36549 6.58579 7.08579C6.86549 6.80608 7.22186 6.6156 7.60982 6.53843C7.99778 6.46126 8.39991 6.50087 8.76537 6.65224C9.13082 6.80362 9.44318 7.05996 9.66294 7.38886C9.8827 7.71776 10 8.10444 10 8.5C10 9.03043 9.78929 9.53914 9.41421 9.91421C9.03914 10.2893 8.53043 10.5 8 10.5Z" fill="#666666"/>
                                                        </svg>
                                                        {" "}Jakarta, Indonesia
                                                    </span> 
                                                </div>
                                                <div className="user-contact">
                                                    <div className="user-number">
                                                        <div className="icon-box bg-primary me-2">
                                                           {SVGICON.CallIcon}
                                                        </div>
                                                        <h4 className="details">+12 345 6789 0</h4>
                                                    </div>
                                                    <div className="user-email">
                                                        <div className="icon-box bg-primary me-2">
                                                            {SVGICON.MessageIcon}	
                                                        </div>
                                                        <h4 className="details">info@example.com</h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="side-detail">
                                                <div className="edit-profiil">
                                                    <button className="btn light btn-primary btn-sm text-nowrap">Edit Profile</button>
                                                </div>
                                                <Dropdown className="dropdown ms-auto">
                                                    <Dropdown.Toggle as="div" className="i-false btn sharp btn-primary tp-btn" data-bs-toggle="dropdown">
                                                        {SVGICON.DropdownIcon}                                                        
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu align="end" as="ul" className="dropdown-menu dropdown-menu-end">
                                                        <li className="dropdown-item"><Link to={"#"}><i className="fa fa-user-circle text-primary me-2" /> View profile</Link></li>
                                                        <li className="dropdown-item"><Link to={"#"}><i className="fa fa-users text-primary me-2" /> Add to btn-close friends </Link></li>
                                                        <li className="dropdown-item"><Link to={"#"}><i className="fa fa-plus text-primary me-2" /> Add to group </Link></li>
                                                        <li className="dropdown-item"><Link to={"#"}><i className="fa fa-ban text-primary me-2" /> Block </Link></li>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>                                            
                                        </div>                                    
                                    </div>                                
                                </div>
                            </div>                            
                        </div>
                        <div className="col-xl-12">
                            <div className="card pie-chart2">
                                <div className="card-header border-0">
                                    <h2 className="heading">Pie Chart</h2>
                                    <div className="d-flex align-items-center">
                                        <div className="coman-btn me-2">
                                            <button type="button" className="btn light btn-primary btn-sm mx-1">Chart</button>
                                            <button type="button" className="btn light btn-primary btn-sm mx-1">Activity</button>
                                        </div>
                                        <Dropdown className="dropdown ms-auto">
                                            <Dropdown.Toggle as="div" className="i-false btn sharp btn-primary tp-btn" data-bs-toggle="dropdown">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" version="1.1"><g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><rect x="0" y="0" width="24" height="24"></rect><circle fill="#000000" cx="12" cy="5" r="2"></circle><circle fill="#000000" cx="12" cy="12" r="2"></circle><circle fill="#000000" cx="12" cy="19" r="2"></circle></g></svg>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu align="end" as="ul" className="dropdown-menu dropdown-menu-end">
                                                <li className="dropdown-item"><Link to={"#"}><i className="fa fa-user-circle text-primary me-2"></i> View profile</Link></li>
                                                <li className="dropdown-item"><Link to={"#"}><i className="fa fa-users text-primary me-2"></i> Add to btn-close friends </Link></li>
                                                <li className="dropdown-item"><Link to={"#"}><i className="fa fa-plus text-primary me-2"></i> Add to group </Link></li>
                                                <li className="dropdown-item"><Link to={"#"}><i className="fa fa-ban text-primary me-2"></i> Block </Link></li>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="chart-group">
                                        { piechartBlog.map((item , ind)=>(
                                            <div className="text-center radius-bar" key={ind}>
                                                <div className="d-inline-block position-relative donut-chart-sale">
                                                    <DonutChart className="donut1" value={item.percent} backgroundColor={item.bg}
                                                        backgroundColor2= "rgba(245, 245, 245, 1)"
                                                    />
                                                    <small>{item.percent}%</small>
                                                </div>
                                                <h4>{item.title}</h4>
                                            </div>
                                        ))}                                        
                                    </div>
                                    <div className="chart-info">
                                        <div>
                                            <h4>Best tips increase management</h4>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed <br />
                                                do eiusmod tempor incididunt ut labore et dolore magna
                                            </p>
                                        </div>
                                        <div>
                                            <Link to={"#"} className="btn light btn-primary">Learn More</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>   
                <div className="col-xl-3 col-xxl-4">
                    <div className="row">                               
                        <div className="col-xl-12">
                            <div className="card">
                                <div className="">
                                    <div className="prot-blog">
                                        <div className="d-flex post justify-content-between mb-3 align-items-center">
                                            <h3 className="text d-inline mb-0">Your Plan</h3>
                                            <Dropdown>
                                                <Dropdown.Toggle as="div" className="i-false">
                                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4.58333 13.5207C3.19 13.5207 2.0625 12.3932 2.0625 10.9998C2.0625 9.6065 3.19 8.479 4.58333 8.479C5.97667 8.479 7.10417 9.6065 7.10417 10.9998C7.10417 12.3932 5.97667 13.5207 4.58333 13.5207ZM4.58333 9.854C3.95083 9.854 3.4375 10.3673 3.4375 10.9998C3.4375 11.6323 3.95083 12.1457 4.58333 12.1457C5.21583 12.1457 5.72917 11.6323 5.72917 10.9998C5.72917 10.3673 5.21583 9.854 4.58333 9.854Z" fill="white"/>
                                                        <path d="M17.4168 13.5207C16.0235 13.5207 14.896 12.3932 14.896 10.9998C14.896 9.6065 16.0235 8.479 17.4168 8.479C18.8102 8.479 19.9377 9.6065 19.9377 10.9998C19.9377 12.3932 18.8102 13.5207 17.4168 13.5207ZM17.4168 9.854C16.7843 9.854 16.271 10.3673 16.271 10.9998C16.271 11.6323 16.7843 12.1457 17.4168 12.1457C18.0493 12.1457 18.5627 11.6323 18.5627 10.9998C18.5627 10.3673 18.0493 9.854 17.4168 9.854Z" fill="white"/>
                                                        <path d="M10.9998 13.5207C9.6065 13.5207 8.479 12.3932 8.479 10.9998C8.479 9.6065 9.6065 8.479 10.9998 8.479C12.3932 8.479 13.5207 9.6065 13.5207 10.9998C13.5207 12.3932 12.3932 13.5207 10.9998 13.5207ZM10.9998 9.854C10.3673 9.854 9.854 10.3673 9.854 10.9998C9.854 11.6323 10.3673 12.1457 10.9998 12.1457C11.6323 12.1457 12.1457 11.6323 12.1457 10.9998C12.1457 10.3673 11.6323 9.854 10.9998 9.854Z" fill="white"/>
                                                    </svg>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu className="dropdown-menu dropdown-menu-end" align={"end"}>
                                                    <Dropdown.Item>Delete</Dropdown.Item>
                                                    <Dropdown.Item>Edit</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        <div className="d-flex fill justify-content-between align-items-center">
                                            <h2 className="text">Free</h2>
                                            <Link to={"#"}>Upgrade Plan</Link>
                                        </div>
                                        <h4>
                                            <Link to={"post-details"} className="text-bla">
                                                <svg className="me-1" width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="4.5" cy="4.5" r="4.5" fill="#FCFCFC"/>
                                                </svg>
                                                {" "} 50 GB Storage
                                            </Link>
                                        </h4>
                                        <h4><Link to={"post-details"} className="text-bla"><svg className="me-1" width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="4.5" cy="4.5" r="4.5" fill="#FCFCFC"/>
                                            </svg>
                                            {" "} Limited Features</Link></h4>
                                        <p className="mb-0">Upgrade to Premium Plan to get more Features & Storage memory</p>
                                        <div className="shape">
                                            <svg width="488" height="353" viewBox="0 0 488 353" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <mask id="mask0_51_1209" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="438" height="283">
                                                <rect width="438" height="283" fill="url(#paint0_linear_51_1209)"/>
                                                </mask>
                                                <g mask="url(#mask0_51_1209)">
                                                <path d="M165 410.5H15L465.5 88H487.5L165 410.5Z" fill="#ccecff"/>
                                                <path d="M264 369.5H114L564.5 47H586.5L264 369.5Z" fill="#ccecff"/>
                                                </g>
                                                <defs>
                                                <linearGradient id="paint0_linear_51_1209" x1="308.075" y1="-143.042" x2="316.634" y2="468.334" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#363B64"/>
                                                <stop offset="1" stopColor="#4CBC9A"/>
                                                </linearGradient>
                                                </defs>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-12">
                            <div className="card messages ">
                                <div className="card-header border-0 p-4 pb-0 ">
                                    <div>
                                        <h2 className="heading">Messages</h2>
                                    </div>
                                    <div >
                                        <Link to={"#"} className="add" 
                                            onClick={()=>setModelOpen(true)}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 3C7.05 3 3 7.05 3 12C3 16.95 7.05 21 12 21C16.95 21 21 16.95 21 12C21 7.05 16.95 3 12 3ZM12 19.125C8.1 19.125 4.875 15.9 4.875 12C4.875 8.1 8.1 4.875 12 4.875C15.9 4.875 19.125 8.1 19.125 12C19.125 15.9 15.9 19.125 12 19.125Z" fill="white"/>
                                                <path d="M16.3503 11.0251H12.9753V7.65009C12.9753 7.12509 12.5253 6.67509 12.0003 6.67509C11.4753 6.67509 11.0253 7.12509 11.0253 7.65009V11.0251H7.65029C7.12529 11.0251 6.67529 11.4751 6.67529 12.0001C6.67529 12.5251 7.12529 12.9751 7.65029 12.9751H11.0253V16.3501C11.0253 16.8751 11.4753 17.3251 12.0003 17.3251C12.5253 17.3251 12.9753 16.8751 12.9753 16.3501V12.9751H16.3503C16.8753 12.9751 17.3253 12.5251 17.3253 12.0001C17.3253 11.4751 16.8753 11.0251 16.3503 11.0251Z" fill="white"/>
                                            </svg>								
                                        </Link>									
                                    </div>	
                                </div>
                                
                                <div className="card-body loadmore-content  dz-scroll recent-activity-wrapper p-4">
                                    <div className="input-group search-area mb-3">
                                        <input type="text" className="form-control" placeholder="Search here..." />
                                        <span className="input-group-text">
                                            <Link to={"#"}>
                                                <svg className="me-1 mb-1 user-search" width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8.625 16.3125C4.3875 16.3125 0.9375 12.8625 0.9375 8.625C0.9375 4.3875 4.3875 0.9375 8.625 0.9375C12.8625 0.9375 16.3125 4.3875 16.3125 8.625C16.3125 12.8625 12.8625 16.3125 8.625 16.3125ZM8.625 2.0625C5.0025 2.0625 2.0625 5.01 2.0625 8.625C2.0625 12.24 5.0025 15.1875 8.625 15.1875C12.2475 15.1875 15.1875 12.24 15.1875 8.625C15.1875 5.01 12.2475 2.0625 8.625 2.0625Z" fill="#2696FD"/>
                                                    <path d="M16.5001 17.0626C16.3576 17.0626 16.2151 17.0101 16.1026 16.8976L14.6026 15.3976C14.3851 15.1801 14.3851 14.8201 14.6026 14.6026C14.8201 14.3851 15.1801 14.3851 15.3976 14.6026L16.8976 16.1026C17.1151 16.3201 17.1151 16.6801 16.8976 16.8976C16.7851 17.0101 16.6426 17.0626 16.5001 17.0626Z" fill="var(--primary)"/>
                                                </svg>
                                            </Link>
                                        </span>
                                    </div>
                                    {datas && datas.map((data, ind)=>(
                                        <div className="d-flex align-items-center student" key={ind}>
                                            <span className="me-3 me-lg-2">
                                                <img src={data.image} alt="" width="50" />
                                            </span>
                                            <div className="user-info">
                                                <h6 className="name"><Link to={"post-details"}>{data.title}</Link></h6>
                                                <span className="fs-14 font-w400 text-wrap">{data.subtitle}</span>
                                            </div>
                                            <div className="indox text-center">
                                                <span className="d-block">12:45 PM</span>
                                                <span className="badge  badge-primary">2</span>		
                                            </div>																
                                        </div>
                                    ))}                                  
                                </div>
                                <div className="card-footer text-center border-0 pt-0">
                                    <Link to={"#"} onClick={() => hendelClick()} 
                                        className="btn btn-block btn-primary dz-load-more"
                                    >
                                        {refreshToggle && <i className="fa fa-refresh" />}
                                        {" "}View More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div> 
            </div>    
            <Modal show={modelOpen} onHide={setModelOpen} centered>        
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Messages</h5>
                    <button type="button" className="btn-close" onClick={()=>setModelOpen(false)}></button>
                </div>
                <div className="modal-body">
                    <div className="mb-3 d-block">
                        <label  className="form-label d-block">Enter Name</label>
                        <input type="text" className="form-control w-100 mb-3" placeholder="Username"/>
                    </div>
                    <div className="mb-3 d-block">
                        <label  className="form-label d-block">Enter Position</label>
                        <input type="text" className="form-control w-100 mb-3" placeholder="Username" />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className=" btn btn-danger light"onClick={()=>setModelOpen(false)}>Close</button>
                    <button type="button" className="btn btn-primary">Save changes</button>
                </div>                
            </Modal>
        </>

    )
}
export default User;