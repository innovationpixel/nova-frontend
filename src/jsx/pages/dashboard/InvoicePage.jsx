import React, {useState, useRef, useEffect} from 'react';
import { Link } from 'react-router-dom';
import InvoiceSlider from '../../elements/InvoiceSlider';
import { Dropdown, Modal } from 'react-bootstrap';
import { SVGICON } from '../../constant/theme';
import Select from 'react-select';



const invoiceData = [
    {invoice:'#INV-0001234', icon: SVGICON.ArrowRed,name:'Marilyn Workman', date:'March 1, 2024, 08:22 AM', status:'Complete', mail:'vita@mail.com ', color:'success', amount:'60.00'},
    {invoice:'#INV-0001235', icon: SVGICON.ArrowGreen,name:'Talan Siphron', date:'March 2, 2024, 08:22 AM', status:'Panding', mail:'ahmad@mail.com ', color:'primary', amount:'70.00'},
    {invoice:'#INV-0001237', icon: SVGICON.ArrowGreen,name:'Thomas Khun', date:'March 3, 2024, 08:22 AM', status:'Unpaid', mail:'kevin@mail.com', color:'pink', amount:'65.00'},
    {invoice:'#INV-0001238', icon: SVGICON.ArrowRed,name:'Soap Khun', date:'March 5, 2024, 08:22 AM', status:'Panding', mail:'soap@mail.com ', color:'primary', amount:'50.50'},
    {invoice:'#INV-0001229', icon: SVGICON.ArrowGreen,name:'Raja Ahmad', date:'March 10, 2024, 08:22 AM', status:'Complete', mail:'ahmad@mail.com', color:'success', amount:'70.00'},
    {invoice:'#INV-0001230', icon: SVGICON.ArrowRed,name:'Jorden Vill', date:'March 4, 2024, 08:22 AM', status:'Panding', mail:'jordan@mail.com ', color:'primary', amount:'63.00'},
    {invoice:'#INV-0001250', icon: SVGICON.ArrowGreen,name:'Manthan Khun', date:'March 7, 2024, 08:22 AM', status:'Unpaid', mail:'mantha@mail.com ', color:'pink', amount:'78.00'},
    {invoice:'#INV-0001118', icon: SVGICON.ArrowRed,name:'Soap Khun', date:'March 5, 2024, 08:22 AM', status:'Panding', mail:'soap@mail.com ', color:'primary', amount:'50.50'},
    {invoice:'#INV-0001333', icon: SVGICON.ArrowGreen,name:'Raja Ahmad', date:'March 10, 2024, 08:22 AM', status:'Complete', mail:'ahmad@mail.com', color:'success', amount:'70.00'},
    {invoice:'#INV-0001450', icon: SVGICON.ArrowRed,name:'Jorden Vill', date:'March 4, 2024, 08:22 AM', status:'Panding', mail:'jordan@mail.com ', color:'primary', amount:'63.00'},
    {invoice:'#INV-0001110', icon: SVGICON.ArrowGreen,name:'Manthan Khun', date:'March 7, 2024, 08:22 AM', status:'Unpaid', mail:'mantha@mail.com ', color:'pink', amount:'78.00'},
    {invoice:'#INV-0001501', icon: SVGICON.ArrowGreen,name:'Talan Siphron', date:'March 2, 2024, 08:22 AM', status:'Panding', mail:'ahmad@mail.com ', color:'primary', amount:'70.00'},
    {invoice:'#INV-0001213', icon: SVGICON.ArrowGreen,name:'Thomas Khun', date:'March 3, 2024, 08:22 AM', status:'Unpaid', mail:'kevin@mail.com', color:'pink', amount:'65.00'}
];

const theadData = [
    {heading: 'ID Invoice', sortingVale:"invoice"},
    {heading: 'Due Date', sortingVale:"date"},    
    {heading: 'Client', sortingVale:"name"},
    {heading: 'Contact', sortingVale:"mail"},
    {heading: 'Amount', sortingVale:"amount"},
    {heading: 'Status', sortingVale:"status"},
    {heading: 'edit', sortingVale:"color"},    
];

const options3 = [
    { value: '1', label: 'USA Doller' },
    { value: '2', label: 'Euro' },
    { value: '3', label: 'Indian Rupee' },
    { value: '4', label: 'Yen' },
]
const InvoicePage = () => {
    const sort = 10;
    const [data, setData] = useState(
        document.querySelectorAll('#example6_wrapper tbody tr')
    )
    
    const activePag = useRef(0)
    const [test, settest] = useState(0)    
    
    const chageData = (frist, sec) => {
        for (var i = 0; i < data.length; ++i) {
          if (i >= frist && i < sec) {
            data[i].classList.remove('d-none')
          } else {
            data[i].classList.add('d-none')
          }
        }
    }      
    useEffect(() => {
        setData(document.querySelectorAll('#example6_wrapper tbody tr'))        
    }, [test])
    
      
    activePag.current === 0 && chageData(0, sort)

    let paggination = Array(Math.ceil(data.length / sort))
        .fill()
        .map((_, i) => i + 1)
    
      
    const onClick = (i) => {
        activePag.current = i
        chageData(activePag.current * sort, (activePag.current + 1) * sort)
        settest(i)
    }
      
    const [feeData, setFeeDate] = useState([...invoiceData]);
    const [iconData, setIconDate] = useState({ complete: false ,ind : Number});


    function SotingData(name){
        const sortedPeople = [...feeData]; 
        switch (name) {
            case "rollno":
                sortedPeople.sort((a, b) => {
                return   a.rollno < b.rollno ? -1 : 1 });
            break;
            case "name":
                sortedPeople.sort((a, b) => {                    
                 return  iconData.complete ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)                    
                });
            break;            
            case "invoice":
                sortedPeople.sort((a, b) => {                    
                 return  iconData.complete ? a.invoice.localeCompare(b.invoice) : b.invoice.localeCompare(a.invoice)                    
                });
            break;            
            case "date":
                sortedPeople.sort((a, b) => {                    
                 return  iconData.complete ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)                    
                });
            break;            
            case "amount":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.amount.localeCompare(b.amount) : b.amount.localeCompare(a.amount)                    
                });
            break;        
            case "status":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)                    
                });
            break;        
            case "mail":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.mail.localeCompare(b.mail) : b.mail.localeCompare(a.mail)                    
                });
            break;        
            default:
                break;
        }            
        setFeeDate(sortedPeople);         
    }     
    
    const chackboxFun = (type) => {
        setTimeout(() => {
            const chackbox = document.querySelectorAll(".inv-table input");
            const motherChackBox = document.querySelector(".invoice_head input");
            for (let i = 0; i < chackbox.length; i++) {
               const element = chackbox[i];
               if (type === "all") {
                  if (motherChackBox.checked) {
                     element.checked = true;
                  } else {
                     element.checked = false;
                  }
               } else {
                  if (!element.checked) {
                     motherChackBox.checked = false;
                     break;
                  } else {
                     motherChackBox.checked = true;
                  }
               }
            }
        }, 100);
    };

    const [openModal, setOpenModal] = useState(false);
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
                                        <li className="breadcrumb-item active">Invoice</li>
                                    </ol>
                                </nav>
                                <div className="d-flex flex-wrap my-0 my-sm-0 py-sm-2 py-xl-0">
                                    <div className="input-group search-area">
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
                                    <div className="invoice-btn ">                                        
                                        <button type="button" className="btn btn-primary" onClick={()=>setOpenModal(true)} >New Invoice {" "}
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 3C7.05 3 3 7.05 3 12C3 16.95 7.05 21 12 21C16.95 21 21 16.95 21 12C21 7.05 16.95 3 12 3ZM12 19.125C8.1 19.125 4.875 15.9 4.875 12C4.875 8.1 8.1 4.875 12 4.875C15.9 4.875 19.125 8.1 19.125 12C19.125 15.9 15.9 19.125 12 19.125Z" fill="#FCFCFC"/>
                                                <path d="M16.3498 11.0251H12.9748V7.65009C12.9748 7.12509 12.5248 6.67509 11.9998 6.67509C11.4748 6.67509 11.0248 7.12509 11.0248 7.65009V11.0251H7.6498C7.1248 11.0251 6.6748 11.4751 6.6748 12.0001C6.6748 12.5251 7.1248 12.9751 7.6498 12.9751H11.0248V16.3501C11.0248 16.8751 11.4748 17.3251 11.9998 17.3251C12.5248 17.3251 12.9748 16.8751 12.9748 16.3501V12.9751H16.3498C16.8748 12.9751 17.3248 12.5251 17.3248 12.0001C17.3248 11.4751 16.8748 11.0251 16.3498 11.0251Z" fill="#FCFCFC"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                   <InvoiceSlider />
                   <div className="row">							
                        <div className="col-xl-12">
                            <div className="table-responsive  full-data">
                                <div id='example6_wrapper' className='dataTables_wrapper no-footer'>
                                    <table className="table-responsive-lg table display mb-4 dataTablesCard  text-black dataTable no-footer">
                                        <thead>
                                            <tr>
                                                <th className='invoice_head'>
                                                    <input type="checkbox" className="form-check-input" id="checkAll" required="" 
                                                        onClick={() => chackboxFun("all")}
                                                    />
                                                </th>
                                                {theadData.map((item, ind)=>(
                                                    <th key={ind}
                                                        onClick={()=>{SotingData(item.sortingVale); setIconDate(prevState => ({complete:!prevState.complete, ind: ind }) )}}
                                                    >{item.heading}
                                                        <span>
                                                            {ind !== iconData.ind &&
                                                                <i className="fa fa-sort ms-2 fs-12" style={{opacity: '0.3'}} />                                                                
                                                            }
                                                            {ind === iconData.ind && (
                                                                iconData.complete ? 
                                                                    <i className="fa fa-arrow-down ms-2 fs-12"  style={{opacity: '0.7'}} />
                                                                    :
                                                                    <i className="fa fa-arrow-up ms-2 fs-12" style={{opacity: '0.7'}} />                                                                    
                                                                )                                                            
                                                            }
                                                        </span>
                                                    </th>
                                                ))}                                                 
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {feeData.map((item, i)=>(
                                                <tr key={i}>
                                                    <td className='inv-table'>
                                                        <div className="checkbox me-0 align-self-center">
                                                            <div className="custom-control custom-checkbox ">
                                                                <input type="checkbox" className="form-check-input" id={`doctorinput${i+5}`} required="" 
                                                                    onClick={() => chackboxFun()}
                                                                />
                                                                <label className="custom-control-label" htmlFor={`doctorinput${i+5}`}></label>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{item.invoice}</td>
                                                    <td className="whitesp-no fs-14 font-w400">March 1, 2024, 08:22 AM</td>
                                                    <td className="whitesp-no p-0">
                                                        <div className="py-sm-3 py-1">
                                                            <div>
                                                                <h6 className="font-w500 fs-15 mb-0">{item.name}</h6>
                                                                <span className="fs-14 font-w400"><a href="app-profile.html">@thomaskhuncoro</a></span>
                                                            </div>												
                                                        </div>
                                                    </td> 
                                                    <td className="whitesp-no">
                                                        <Link to={"#"} className="tb-mail">
                                                            <svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M18 0.889911C18.0057 0.823365 18.0057 0.756458 18 0.689911L17.91 0.499911C17.91 0.499911 17.91 0.429911 17.86 0.399911L17.81 0.349911L17.65 0.219911C17.6062 0.175413 17.5556 0.138269 17.5 0.109911L17.33 0.0499115H17.13H0.93H0.73L0.56 0.119911C0.504246 0.143681 0.453385 0.177588 0.41 0.219911L0.25 0.349911C0.25 0.349911 0.25 0.349911 0.25 0.399911C0.25 0.449911 0.25 0.469911 0.2 0.499911L0.11 0.689911C0.10434 0.756458 0.10434 0.823365 0.11 0.889911L0 0.999911V12.9999C0 13.2651 0.105357 13.5195 0.292893 13.707C0.48043 13.8946 0.734784 13.9999 1 13.9999H10C10.2652 13.9999 10.5196 13.8946 10.7071 13.707C10.8946 13.5195 11 13.2651 11 12.9999C11 12.7347 10.8946 12.4803 10.7071 12.2928C10.5196 12.1053 10.2652 11.9999 10 11.9999H2V2.99991L8.4 7.79991C8.5731 7.92973 8.78363 7.99991 9 7.99991C9.21637 7.99991 9.4269 7.92973 9.6 7.79991L16 2.99991V11.9999H14C13.7348 11.9999 13.4804 12.1053 13.2929 12.2928C13.1054 12.4803 13 12.7347 13 12.9999C13 13.2651 13.1054 13.5195 13.2929 13.707C13.4804 13.8946 13.7348 13.9999 14 13.9999H17C17.2652 13.9999 17.5196 13.8946 17.7071 13.707C17.8946 13.5195 18 13.2651 18 12.9999V0.999911C18 0.999911 18 0.929911 18 0.889911ZM9 5.74991L4 1.99991H14L9 5.74991Z" fill="#01A3FF"/>
                                                            </svg>
                                                            {item.mail}	
                                                        </Link>	
                                                    </td>
                                                    <td className="doller">$ 650,036.34 </td>
                                                    <td>
                                                        <span className={`btn light btn-${item.color} btn-sm`}>
                                                            {item.color === "success" ?  SVGICON.DoubleRight : item.color === "primary" ?  
                                                                SVGICON.CircleQuestion
                                                                :
                                                                SVGICON.PinkQuestion
                                                            }                                                                        
                                                            {" "}{item.status}    
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <Dropdown>
                                                            <Dropdown.Toggle as="div" className="btn-link btn sharp tp-btn btn-primary pill i-false">
                                                            {SVGICON.DropdownIcon}
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu className="dropdown-menu-end" align="end">
                                                                <Dropdown.Item>Delete</Dropdown.Item>
                                                                <Dropdown.Item>Edit</Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>   
                                    </table> 
                                
                                    <div className='mt-3'>
                                        {/* <div className='dataTables_info'>
                                            Showing {activePag.current * sort + 1} to{' '}
                                            {data.length > (activePag.current + 1) * sort
                                                ? (activePag.current + 1) * sort
                                                : data.length}{' '}
                                            of {data.length} entries
                                        </div> */}                                    
                                        <div
                                            className='dataTables_paginate paging_simple_numbers'
                                            id='example5_paginate'
                                        >
                                            <Link
                                                className='paginate_button previous disabled'
                                                to='#'
                                                onClick={() =>
                                                    activePag.current > 0 && onClick(activePag.current - 1)
                                                }
                                            >                                                
                                                <i className='fa-solid fa-angle-left' />
                                            </Link>
                                            <span>
                                                {paggination.map((number, i) => (
                                                    <Link
                                                        key={i}
                                                        to='#'
                                                        className={`paginate_button  ${
                                                            activePag.current === i ? 'current' : ''
                                                        } `}
                                                        onClick={() => onClick(i)}
                                                    >
                                                        {number}
                                                    </Link>
                                                ))}
                                            </span>
                                            <Link
                                                className='paginate_button next'
                                                to='#'
                                                onClick={() =>
                                                    activePag.current + 1 < paggination.length &&
                                                    onClick(activePag.current + 1)
                                                }
                                            >                                                
                                                <i className='fa-solid fa-angle-right' />
                                            </Link>
                                        </div>
                                    </div>  
                                </div>  
                            </div>    
                        </div>    
                    </div>    
                </div>  
            </div>  
            <Modal show={openModal} onHide={setOpenModal} centered>                                   
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Add invoice</h1>
                    <button type="button" className="btn-close" onClick={()=>setOpenModal(false)}></button>
                </div>
                <div className="modal-body">
                    <div className="mb-3 d-block">
                        <label  className="form-label d-block mb-2">invoice</label>
                        <input type="text" className="form-control w-100 mb-0" />
                    </div>
                    <div className="mb-3 d-block">
                        <label  className="form-label d-block mb-2">issue Date</label>
                        <input type="date" className="form-control w-100 mb-0" />
                    </div>
                    <div className="mb-3 d-block">
                        <label  className="form-label d-block mb-2">Currency</label>                        
                        <Select 
                            options={options3} 
                            isSearchable={false}
                            defaultValue={options3[0]}
                            className="custom-react-select" 
                        />
                    </div>
                    <div className="mb-3 d-block">
                        <label  className="form-label d-block mb-2">Pricing</label>
                        <input type ="text" className="form-control" placeholder="Price will be based on time and expension" />                        
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

export default InvoicePage;
