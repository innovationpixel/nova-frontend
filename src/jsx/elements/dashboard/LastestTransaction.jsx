import React from 'react';
import DropdownBlog from '../DropdownBlog';
import { Link } from 'react-router-dom';
import { IMAGES, SVGICON } from '../../constant/theme';
import { Dropdown } from 'react-bootstrap';
import { SelectPicker } from 'rsuite';

const tableData = [
	{ image:IMAGES.Trans1, title:'Portu Studio', amount:'$ 650,036.34'},
	{ image:IMAGES.Trans2, title:'Akademi Studio', amount:'$ 120,036.34'},
	{ image:IMAGES.Trans3, title:'Kleon Studio', amount:'$ 340,036.34'},
	{ image:IMAGES.Trans4, title:'Nextrun Studio', amount:'$ 740,036.34'},
	{ image:IMAGES.Trans1, title:'Creation Studio', amount:'$ 120,036.34'},
];

const ChartData = [
    {label:'This Month', value:'This Month'},
    {label:'Week', value:'Weeks'},
    {label:'Today', value:'Today'},
];

const LastestTransaction = () => {
    return (        
        <div className="card lastest_trans h-auto">
            <div className="card-header dz-border flex-wrap pb-3">
                <div>
                    <h2 className="heading">Lastest Transaction</h2>
                </div>
                <div className="d-flex align-items-center">                    
                    <SelectPicker
                        className='select-data me-2'
                        data={ChartData}
                        searchable={false}
                        
                    />
                    <DropdownBlog />
                </div>
            </div>
            <div className="card-body p-0">
                {/* <!--list--> */}
                <div className="table-responsive">
                    <table className="table shadow-hover trans-table border-no dz-border tbl-btn short-one mb-0 ">
                        <tbody>
                            {tableData.map((item, ind)=>(
                                <tr className="trans-td-list" key={ind}>
                                    <td>
                                        <div className="trans-list">
                                            <div className="profile-img">
                                                <img src={item.image} className="avtar" alt="" />
                                            </div>
                                            <div className="user-info">
                                                <h6 className="font-500 mb-0 ms-3">{item.title}</h6>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="fs-15 font-w500">{item.amount}</span>
                                    </td>
                                    <td>
                                        <span className="font-w400">March 01, 2024</span>
                                    </td>
                                    <td className="pe-3">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <div className="icon-box btn-secondary light me-2">
                                                {SVGICON.DownloadIcon}																	
                                            </div>
                                            <Dropdown className="custom-dropdown">
                                                <Dropdown.Toggle className="btn sharp btn-secondary light border-0 me-0 i-false">
                                                    {SVGICON.DropdownIcon}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu drop="end" className="dropdown-menu-end">
                                                    <Dropdown.Item>Option 1</Dropdown.Item>
                                                    <Dropdown.Item>Option 2</Dropdown.Item>
                                                    <Dropdown.Item>Option 3</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </td>
                                </tr>
                            ))}												
                        </tbody>
                    </table>	
                </div>
            </div>
            <div className="table-pagenation pt-3 mt-0">
                <p>Showing 1-5 from 15 data</p>
                <nav>
                    <ul className="pagination pagination-gutter pagination-primary no-bg me-2">
                        <li className="page-item page-indicator">
                            <Link to={"#"} className="page-link">
                                <i className="fa-solid fa-angle-left" />
                            </Link>
                        </li>
                        <li className="page-item active">
                            <Link to={"#"} className="page-link">1</Link>
                        </li>
                        <li className="page-item ">
                            <Link to={"#"} className="page-link">2</Link>
                        </li>
                        <li className="page-item">
                            <Link to={"#"} className="page-link">3</Link>
                        </li>
                        <li className="page-item page-indicator">
                            <Link to={"#"} className="page-link">
                                <i className="fa-solid fa-angle-right" />
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>  
        
    );  
};

export default LastestTransaction;