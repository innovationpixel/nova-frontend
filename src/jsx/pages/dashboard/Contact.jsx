import React, { useState } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IMAGES, SVGICON } from '../../constant/theme';

const contactBlog = [
    { title:'Jordana', image:IMAGES.Contact1, number:'+1234512345', mail:'jordan@mail.com'},
    { title:'Jacob Jack', image:IMAGES.Contact2, number:'+1234554321', mail:'jocobjack@mail.com'},
    { title:'John Core', image:IMAGES.Contact3, number:'+1234567123', mail:'johncore@mail.com'},
    { title:'Gibs Gibsy', image:IMAGES.Contact4, number:'+1234567456', mail:'gibsan@mail.com'},
    { title:'Sammy', image:IMAGES.Contact5, number:'+1234567987', mail:'sammy@mail.com'},
    { title:'Core', image:IMAGES.Contact6, number:'+1234567852', mail:'core@mail.com'},
    { title:'Sodara', image:IMAGES.Contact7, number:'+1234567369', mail:'soadara@mail.com'},
    { title:'Smith', image:IMAGES.Contact8, number:'+1234567741', mail:'smithdan@mail.com'},
    { title:'Nico', image:IMAGES.Contact9, number:'+1234567258', mail:'nicodan@mail.com'},
    { title:'Samantha', image:IMAGES.Contact10, number:'+1234567321', mail:'samantha@mail.com'},
    { title:'Adja', image:IMAGES.Contact11, number:'+1234567890', mail:'adha@mail.com'},
    { title:'Johnny', image:IMAGES.Contact12, number:'+1234574123', mail:'johnny@mail.com'}
];

const Contact = () => {
    const [openModal , setOpenModal] = useState(false);
    return (
        <>
            <div className="row">
                <div className="col-xl-12">                
                    <div className="row">                
                        <div className="col-xl-12">
                            <div className="page-titles">
                                <nav>
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item ps-0"><Link to={"#"}>Dashboard</Link></li>
                                        <li className="breadcrumb-item active">Contact</li>
                                    </ol>
                                </nav>
                                <div className="right-area folder-layout-tab">
                                    <button type="button" className="btn btn-primary" onClick={()=>setOpenModal(true)}>New Contact{" "}                                   
                                        {SVGICON.PlusSign}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-12">                                 
                            <div className="row">   
                                {contactBlog.map((item, i)=>(
                                    <div className="col-xl-4 col-md-6" key={i}>
                                        <div className="card contact_list ">
                                            <div className="card-body">
                                                <div className="user-content">
                                                    <div className="user-info">
                                                        <div className="user-img">
                                                            <img src={item.image} className="avtar avtar-xxl me-3" alt="" />
                                                        </div>
                                                        <div className="user-details">
                                                            <h4 className="user-name">{item.title}</h4>
                                                            <span className="number">{item.number}</span>
                                                            <span className="mail">{item.mail}</span> 
                                                        </div>
                                                    </div>
                                                    <Dropdown>
                                                        <Dropdown.Toggle as="div"  className="btn-link btn sharp tp-btn btn-primary pill i-false">
                                                        {SVGICON.DropdownIcon}      
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu align={'end'} className="dropdown-menu-end">
                                                            <Dropdown.Item>Delete</Dropdown.Item>
                                                            <Dropdown.Item>Edit</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                                <div className="contact-icon">
                                                    <div className="icon-box bg-primary-light me-3">
                                                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M19.973 14.7709C19.9394 14.6283 19.8749 14.4949 19.784 14.3799C19.6931 14.265 19.578 14.1715 19.447 14.1059L15.447 12.1059C15.2592 12.0122 15.0468 11.98 14.8397 12.0137C14.6325 12.0475 14.4413 12.1455 14.293 12.2939L12.618 13.9689C10.211 13.5819 6.418 9.78994 6.032 7.38294L7.707 5.70694C7.85545 5.55864 7.95349 5.36739 7.98723 5.16028C8.02097 4.95317 7.9887 4.7407 7.895 4.55294L5.895 0.552942C5.82953 0.421827 5.73604 0.306705 5.62115 0.215724C5.50625 0.124744 5.37277 0.0601275 5.23014 0.0264496C5.08751 -0.00722831 4.93922 -0.00914485 4.79577 0.0208356C4.65231 0.050816 4.5172 0.111961 4.4 0.199942L0.4 3.19994C0.275804 3.29309 0.175 3.41387 0.105573 3.55273C0.036145 3.69158 0 3.8447 0 3.99994C0 13.5699 6.43 19.9999 16 19.9999C16.1552 19.9999 16.3084 19.9638 16.4472 19.8944C16.5861 19.8249 16.7069 19.7241 16.8 19.5999L19.8 15.5999C19.8877 15.4828 19.9487 15.3479 19.9786 15.2047C20.0085 15.0614 20.0066 14.9134 19.973 14.7709ZM15.5 17.9929C7.569 17.7799 2.22 12.4309 2.007 4.49994L4.642 2.51894L5.783 4.79994L4.293 6.28994C4.19978 6.38314 4.1259 6.49384 4.07561 6.61569C4.02533 6.73754 3.99963 6.86813 4 6.99994C4 10.5329 9.467 15.9999 13 15.9999C13.2652 15.9999 13.5195 15.8945 13.707 15.7069L15.197 14.2169L17.481 15.3589L15.5 17.9929Z" fill="var(--primary)"/>
                                                        </svg>
                                                    </div>
                                                    <div className="icon-box bg-primary-light me-3">
                                                        <svg width="16" height="16" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M21.5 1.87161C21.5066 1.79397 21.5066 1.71591 21.5 1.63828L21.395 1.41661C21.395 1.41661 21.395 1.33494 21.3367 1.29994L21.2783 1.24161L21.0917 1.08994C21.0406 1.03803 20.9815 0.994693 20.9167 0.961609L20.7183 0.891609H20.485H1.585H1.35167L1.15333 0.973276C1.08829 1.00101 1.02895 1.04056 0.978333 1.08994L0.791667 1.24161C0.791667 1.24161 0.791667 1.24161 0.791667 1.29994C0.791667 1.35828 0.791667 1.38161 0.733333 1.41661L0.628333 1.63828C0.62173 1.71591 0.62173 1.79397 0.628333 1.87161L0.5 1.99994V15.9999C0.5 16.3094 0.622916 16.6061 0.841709 16.8249C1.0605 17.0437 1.35725 17.1666 1.66667 17.1666H12.1667C12.4761 17.1666 12.7728 17.0437 12.9916 16.8249C13.2104 16.6061 13.3333 16.3094 13.3333 15.9999C13.3333 15.6905 13.2104 15.3938 12.9916 15.175C12.7728 14.9562 12.4761 14.8333 12.1667 14.8333H2.83333V4.33328L10.3 9.93328C10.5019 10.0847 10.7476 10.1666 11 10.1666C11.2524 10.1666 11.4981 10.0847 11.7 9.93328L19.1667 4.33328V14.8333H16.8333C16.5239 14.8333 16.2272 14.9562 16.0084 15.175C15.7896 15.3938 15.6667 15.6905 15.6667 15.9999C15.6667 16.3094 15.7896 16.6061 16.0084 16.8249C16.2272 17.0437 16.5239 17.1666 16.8333 17.1666H20.3333C20.6427 17.1666 20.9395 17.0437 21.1583 16.8249C21.3771 16.6061 21.5 16.3094 21.5 15.9999V1.99994C21.5 1.99994 21.5 1.91828 21.5 1.87161ZM11 7.54161L5.16667 3.16661H16.8333L11 7.54161Z" fill="var(--primary)"/>
                                                        </svg>
                                                    </div>
                                                    <div className="icon-box bg-primary-light me-3">
                                                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M1.33333 19.75C1.19613 19.7503 1.0601 19.7246 0.932501 19.6742C0.73093 19.5939 0.558108 19.4549 0.436421 19.2753C0.314735 19.0957 0.24979 18.8836 0.250001 18.6667V1.33333C0.250001 1.04602 0.364137 0.770465 0.567301 0.567301C0.770466 0.364137 1.04602 0.25 1.33333 0.25H18.6667C18.954 0.25 19.2295 0.364137 19.4327 0.567301C19.6359 0.770465 19.75 1.04602 19.75 1.33333V4.58333C19.75 4.87065 19.6359 5.1462 19.4327 5.34937C19.2295 5.55253 18.954 5.66667 18.6667 5.66667C18.3793 5.66667 18.1038 5.55253 17.9006 5.34937C17.6975 5.1462 17.5833 4.87065 17.5833 4.58333V2.41667H2.41667V15.9367L4.58333 13.5967C4.68803 13.4837 4.81563 13.3943 4.9576 13.3345C5.09958 13.2747 5.25267 13.2459 5.40667 13.25H17.5833V8.91667C17.5833 8.62935 17.6975 8.3538 17.9006 8.15063C18.1038 7.94747 18.3793 7.83333 18.6667 7.83333C18.954 7.83333 19.2295 7.94747 19.4327 8.15063C19.6359 8.3538 19.75 8.62935 19.75 8.91667V14.3333C19.75 14.6207 19.6359 14.8962 19.4327 15.0994C19.2295 15.3025 18.954 15.4167 18.6667 15.4167H5.8725L2.12417 19.4033C2.02316 19.5122 1.90083 19.5992 1.76478 19.6589C1.62874 19.7185 1.48188 19.7495 1.33333 19.75Z" fill="var(--primary)"/>
                                                            <path d="M14.3335 6.75001H5.66683C5.37951 6.75001 5.10396 6.63587 4.9008 6.43271C4.69763 6.22954 4.5835 5.95399 4.5835 5.66668C4.5835 5.37936 4.69763 5.10381 4.9008 4.90064C5.10396 4.69748 5.37951 4.58334 5.66683 4.58334H14.3335C14.6208 4.58334 14.8964 4.69748 15.0995 4.90064C15.3027 5.10381 15.4168 5.37936 15.4168 5.66668C15.4168 5.95399 15.3027 6.22954 15.0995 6.43271C14.8964 6.63587 14.6208 6.75001 14.3335 6.75001ZM14.3335 11.0833H5.66683C5.37951 11.0833 5.10396 10.9692 4.9008 10.766C4.69763 10.5629 4.5835 10.2873 4.5835 10C4.5835 9.71269 4.69763 9.43714 4.9008 9.23398C5.10396 9.03081 5.37951 8.91668 5.66683 8.91668H14.3335C14.6208 8.91668 14.8964 9.03081 15.0995 9.23398C15.3027 9.43714 15.4168 9.71269 15.4168 10C15.4168 10.2873 15.3027 10.5629 15.0995 10.766C14.8964 10.9692 14.6208 11.0833 14.3335 11.0833Z" fill="var(--primary)"/>
                                                        </svg>                                                        
                                                    </div>
                                                    <div className="icon-box  bg-primary-light">
                                                        <svg width="16" height="16" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M23.1547 2.20068C22.9967 2.09387 22.8151 2.02739 22.6255 2.00705C22.436 1.98671 22.2443 2.01314 22.0673 2.08401L17.7798 3.79901C17.6526 2.97529 17.2356 2.22402 16.6038 1.68036C15.972 1.13671 15.167 0.836354 14.3335 0.833344H3.8335C2.90524 0.833344 2.015 1.20209 1.35862 1.85847C0.702245 2.51485 0.333496 3.40509 0.333496 4.33334V13.6667C0.333496 14.5949 0.702245 15.4852 1.35862 16.1416C2.015 16.7979 2.90524 17.1667 3.8335 17.1667H14.3335C15.1668 17.1637 15.9717 16.8635 16.6035 16.3201C17.2352 15.7767 17.6523 15.0257 17.7798 14.2023L22.0673 15.9172C22.2444 15.9879 22.4361 16.0142 22.6256 15.9937C22.8151 15.9732 22.9968 15.9065 23.1546 15.7996C23.3124 15.6926 23.4417 15.5486 23.5309 15.3802C23.6202 15.2118 23.6669 15.024 23.6668 14.8333V3.16668C23.6669 2.97607 23.6202 2.78836 23.5309 2.61996C23.4416 2.45156 23.3124 2.30761 23.1547 2.20068ZM14.3335 14.8333H3.8335C3.52408 14.8333 3.22733 14.7104 3.00854 14.4916C2.78975 14.2728 2.66683 13.9761 2.66683 13.6667V4.33334C2.66683 4.02392 2.78975 3.72718 3.00854 3.50839C3.22733 3.28959 3.52408 3.16668 3.8335 3.16668H14.3335C14.6429 3.16668 14.9397 3.28959 15.1585 3.50839C15.3772 3.72718 15.5002 4.02392 15.5002 4.33334V13.6667C15.5002 13.9761 15.3772 14.2728 15.1585 14.4916C14.9397 14.7104 14.6429 14.8333 14.3335 14.8333ZM21.3335 13.1102L17.8335 11.7102V6.28984L21.3335 4.88984V13.1102Z" fill="var(--primary)"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}                         
                            </div>
                            <div className="table-pagenation mb-3">
                                <p className="ms-0">Showing <span>1-12</span>from <span>20</span>data</p>
                                <nav>
                                    <ul className="pagination pagination-gutter pagination-primary no-bg mb-0">
                                        <li className="page-item page-indicator">
                                            <Link to={"#"} className="page-link">
                                                <i className="fa-solid fa-angle-left" />
                                            </Link>
                                        </li>
                                        <li className="page-item active"><Link to={"#"} className="page-link">1</Link></li>
                                        <li className="page-item "><Link to={"#"} className="page-link">2</Link></li>                                        
                                        <li className="page-item page-indicator me-0">
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
            <Modal show={openModal} onHide={setOpenModal}>                
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Add Contact</h1>
                    <button type="button" className="btn-close" onClick={()=>setOpenModal(false)}></button>
                </div>
                <div className="modal-body">
                    <div className="mb-3 d-block">
                        <label  className="form-label d-block mb-2">Name</label>
                        <input type ="text" className="form-control" placeholder="Enter Name" />
                    </div>
                    <div className="mb-3 d-block">
                        <label  className="form-label d-block mb-2">Email id</label>
                        <input type ="text" className="form-control" placeholder="Jhon@gmail.com" />
                    </div>
                    <div className="mb-3 d-block">
                        <label  className="form-label d-block mb-2">Number</label>
                        <input type = "number" className="form-control" placeholder="+123456789" />
                    </div>
                    <div className="mb-3 d-block">
                        <label  className="form-label d-block mb-2">Message</label>
                        <textarea className="form-control" rows="2" defaultValue={'message'} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger light" onClick={()=>setOpenModal(false)}>Close</button>
                    <button type="button" className="btn btn-primary">Save changes</button>
                </div>                    
            </Modal>
        </>
    );
};

export default Contact;