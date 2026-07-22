import React from 'react';
import {Link} from 'react-router-dom';

import { SelectPicker} from 'rsuite';
import { IMAGES } from '../../constant/theme';
import DropdownBlog from '../../elements/DropdownBlog';

function Dzmedia({image}) {
    return(
        <>
            <div className="dz-media">
                <img src={image} alt="" className="avtar avtar-lg"/>
            </div>
        </>
    )
}
const menuselect = [
    {label:'Recently', value:'1'},
    {label:'This Weeks', value:'2'},
    {label:'Today', value:'3'},
]

const Activity = () => {    
    return(
        <>
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-titles acti-space">
                        <nav>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item ps-0"><Link to={"#"}>File Manager</Link></li>
                                <li className="breadcrumb-item active">Activity</li>
                            </ol>
                        </nav>
                        <div className="d-flex align-items-center flex-wrap">
                            <div className="me-2">
                                <button type="button" className="btn light btn-primary btn-sm mx-1">Activity</button>
                                <button type="button" className="btn light btn-primary btn-sm mx-1">Notifications</button>
                            </div>                                                                                  
                            <SelectPicker
                                className='drop-data-select me-2 mb-auto'                                
                                data={menuselect}
                                searchable={false}  
                                placeholder="This Month"                                    
                            />
                            <DropdownBlog />
                        </div>
                    </div>
                </div>  
                <div className="col-xl-12">
                    <div >
                        <div className="card activity">
                            <div className="card-body pt-0">
                                <div id="DZ_W_TimeLine11" className="widget-timeline style-3">
                                    <h4 className="mt-3">Today</h4>
                                    <ul className="timeline-active">
                                        <li className="d-flex align-items-baseline timeline-list">
                                            <Dzmedia image={IMAGES.profile14} />
                                            <div className="panel">
                                                <Link to={"#"} className="timeline-panel text-muted d-flex align-items-center">
                                                    <h4><strong>Karen Hope</strong> has created new task at <strong>Frize</strong> <strong className="text-primary">Projects</strong> </h4>
                                                </Link>
                                                <div className="modulel flex-wrap">
                                                    <Dzmedia image={IMAGES.profile15} />
                                                    <Dzmedia image={IMAGES.profile16} />
                                                </div>
                                            </div>
                                            <span className="time">Monday, March 31 2024</span>	
                                        </li>
                                        <li className="d-flex align-items-baseline timeline-list">
                                            <Dzmedia image={IMAGES.profile17} />
                                            <div className="panel">
                                                <Link to={"#"} className="timeline-panel text-muted d-flex align-items-center">
                                                    <h4><strong className="text-pink">[REMINDER] </strong> Due date of <strong className="text-pink">Erempe Studios Projects</strong> task will be coming</h4>
                                                </Link>
                                            </div>	
                                            <span className="time">Monday, March 31 2024</span>
                                        </li>
                                        <li className="d-flex align-items-baseline timeline-list">
                                            <Dzmedia image={IMAGES.profile18} />
                                            <div className="panel">
                                                <Link to={"#"} className="timeline-panel text-muted d-flex align-items-center">
                                                    <h4 ><strong>Tony Soap </strong> commented at <strong className="text-primary"> Frize Projects </strong></h4>
                                                </Link>
                                                
                                            </div>
                                            <span className="time">Monday, March 31 2024</span>	
                                        </li>
                                        <li className="d-flex align-items-baseline timeline-list">
                                            <Dzmedia image={IMAGES.profile19} />
                                            <div className="panel">
                                                <Link to={"#"} className="timeline-panel text-muted d-flex align-items-center">
                                                    <h4 ><strong>Samantha William </strong> add 4 files on  Frize <strong className="text-danger">Projects </strong></h4>
                                                </Link>
                                                <div className="modulel flex-wrap">
                                                    <Dzmedia image={IMAGES.profile21} />
                                                    <Dzmedia image={IMAGES.profile22} />
                                                    <Dzmedia image={IMAGES.profile23} />
                                                    <Dzmedia image={IMAGES.profile24} />
                                                </div>
                                            </div>
                                            <span className="time">Monday, March 31 2024</span>	
                                        </li>
                                    </ul>
                                    <h4 className="mt-3">Yesterday</h4>
                                    <ul className="timeline-active">
                                        <li className="d-flex align-items-baseline timeline-list">
                                            <Dzmedia image={IMAGES.profile25} />
                                            <div className="panel">
                                                <Link to={"#"} className="timeline-panel text-muted d-flex align-items-center">
                                                    <h4 ><strong>Johnny Ahmad </strong>  mentioned you at <strong className="text-primary"> Web Design Projects</strong></h4>
                                                </Link>
                                            </div>
                                            <span className="time">Monday, March 31 2024</span>	
                                        </li>
                                        <li className="d-flex align-items-baseline timeline-list">
                                            <Dzmedia image={IMAGES.profile19} />
                                            <div className="panel">
                                                <Link to={"#"} className="timeline-panel text-muted d-flex align-items-center">
                                                    <h4><strong>Nadila Adja  </strong> mentioned you at <strong className="text-pink"> Projects</strong> </h4>
                                                </Link>
                                            </div>
                                            <span className="time">Monday, March 31 2024</span>	
                                        </li>
                                    </ul>
                                    <div className="loadmore-btn">
                                        <button className="btn btn-primary">Load More</button>
                                    </div>
                                </div>	
                            </div>
                        </div>	
                    </div>                    
                </div>
            </div>
        </>

    )
}
export default Activity;