import React, { Fragment, useState,useReducer, useContext } from "react";
import {Tab, Nav, Collapse} from 'react-bootstrap';
import {Link} from 'react-router-dom';


import NavHader from "./NavHader";
import Header from "./Header";
import ChatBox from "../ChatBox";

//Menus
import {MenuList2} from './Menus2'
// import {componentArray} from './Menus2'

//Icons
import { IMAGES, SVGICON } from "../../constant/theme";
import { ThemeContext } from "../../../context/ThemeContext";



const sidebarMenu = [
    {mainicon: SVGICON.HomeIcon, menuKey:"Dashboard"},
    {mainicon: SVGICON.HomeIcon2, menuKey:"FileManager"},
    {mainicon: SVGICON.SettingIcon, menuKey:"Cms"},
    {mainicon: SVGICON.AppsIcon, menuKey:"Apps"},
    {mainicon: SVGICON.BootstrapIcon, menuKey:"Charts"},
    {mainicon: SVGICON.FormIconSvg, menuKey:"Bootstrap"},
    {mainicon: SVGICON.TableIcon, menuKey:"Plugin"},
    {mainicon: SVGICON.PageIcon, menuKey:"Page"},
    {mainicon: SVGICON.ExtraSvgIcon, menuKey:"Form"},
    {mainicon: SVGICON.DashboardSvg, menuKey:"Table"},
];


const initialState = false;
const reducer = (state, action) =>{
    switch (action.type){
        case 'collpase0':
            return { ...state, collpase0: !state.collpase0 }
        case 'collpase1':
            return { ...state, collpase1: !state.collpase1 }
        case 'collpase2':
            return { ...state, collpase2: !state.collpase2 }
        case 'collpase3':
            return { ...state, collpase3: !state.collpase3 }
        default:
            return state;
    }
}

const updateReducer = (previousState, updatedState) => ({
    ...previousState,
    ...updatedState,
  });
  
const menuInitial = {
    active : "",
    activeSubmenu : "",
}


const Deflayout = ({ title, onClick: ClickToAddEvent }) => {
    const [toggle, setToggle] = useState("");
    const onClick = (name) => setToggle(toggle === name ? "" : name);

    const [activeMenu, setActiveMenu] = useState(0)
    const [state, 
        // dispatch
    ] = 
    useReducer(reducer, initialState);

    const [menustate, setMenustate] = useReducer(updateReducer, menuInitial);
    const handleMenuActive = status => {		
        setMenustate({active : status});			
        if(menustate.active === status){				
            setMenustate({active : ""});
        }   
    }
    const handleSubmenuActive = (status) => {		
        setMenustate({activeSubmenu : status})
        if(menustate.activeSubmenu === status){
            setMenustate({activeSubmenu : ""})			
        }    
    }


    const [openSidebar, setOpenSidebar] = useState(false);
    const [closeSidebar, setCloseSidebar] = useState(0);
    function handleMenuOpen(ind){
        if(ind=== closeSidebar){
            setOpenSidebar(!openSidebar);
        }
    }
    //Light and Dark mode
    const {changeBackground} = useContext(ThemeContext);
    function  handleChangeMode(e){        
        if(e.target.checked){
            changeBackground({ value: "dark", label: "Dark" });
        }else{
            changeBackground({ value: "light", label: "Light" });
        }
    }
  return (
    <Fragment>
        <NavHader openSidebar={openSidebar}/>
        <ChatBox onClick={() => onClick("chatbox")} toggle={toggle} />
        <Tab.Container defaultActiveKey={"Dashboard"}>
            <div className= {`fixed-content-box ${openSidebar ? "active" : ""}`}>
                <div className="head-name">
                    NOVA
                    <Link to={"#"} className="close-fixed-content fa-left d-lg-none"
                        onClick={()=>setOpenSidebar(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 448 512">
                            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                        </svg>
                    </Link>
                </div>
                <div className="fixed-content-body dz-scroll d-flex flex-column justify-content-between" id="DZ_W_Fixed_Contant">                
                    <Tab.Content>    
                        {
                            MenuList2[activeMenu].classStyle !=="blank" ?        
                                <div className="tab-pane show active">
                                    <ul className="metismenu tab-nav-menu">		                               
                                        <>                                        
                                            {
                                                MenuList2[activeMenu].name === "doubleArray" ? 
                                                <>
                                                    <li className="nav-label">{MenuList2[activeMenu].title}</li>
                                                    {MenuList2[activeMenu].mainArray.map((item, ind)=>(
                                                        <li key={ind} className={`${item.title === menustate.active ? "mm-active" : ""}`}>
                                                            <Link to={"#"} className="has-arrow"
                                                                onClick={() => {handleMenuActive(item.title)}}
                                                            >
                                                                {item.iconStyle}                                                            
                                                                <span className="nav-text">{item.title}</span>                                                            
                                                            </Link>
                                                            <Collapse in={menustate.active === item.title ? true :false}>
                                                                <ul>
                                                                    {item?.content?.map((data, ind)=>{
                                                                        if(data.metisMenu==="has-menu"){
                                                                            return(                                                                        
                                                                                <li key={ind}>
                                                                                    <Link to={"#"} className="has-arrow"
                                                                                        onClick={() => { handleSubmenuActive(data.title)}}
                                                                                    >{data.title}</Link>
                                                                                    <Collapse  in={menustate.activeSubmenu === data.title ? true :false}>
                                                                                        <ul>
                                                                                            {data?.content?.map((data, ind)=>(
                                                                                                <li key={ind}><Link to={data.to}>{data.title}</Link></li>  
                                                                                            ))}
                                                                                        </ul>
                                                                                    </Collapse>
                                                                                </li>
                                                                            )
                                                                        }else{
                                                                            return(                                                                           
                                                                                <li key={ind}><Link to={data.to}>
                                                                                    {data.title}
                                                                                    </Link>
                                                                                </li>          
                                                                            )
                                                                        }
                                                                    })}                                                                
                                                                </ul>
                                                            </Collapse>
                                                        </li>
                                                    ))}                                                
                                                </>
                                                :
                                                <>
                                                    <li className="nav-label">{MenuList2[activeMenu].title}</li> 
                                                    <li className={`${state.collpase1 ? "mm-active" : ""}`}>
                                                        {/* <Link to={"#"} className="has-arrow" 
                                                            onClick={() => dispatch({type:'collpase1'})}
                                                        >   
                                                            {MenuList2[activeMenu]?.iconStyle}{" "}
                                                            <span className="nav-text">{MenuList2[activeMenu]?.title}</span>                                                        
                                                        </Link>
                                                        <Collapse in={state.collpase1}> */}
                                                            <ul>                                            
                                                                {MenuList2[activeMenu]?.content.map((data, ind)=>(                                                               
                                                                    <li key={ind}>
                                                                        <Link to={data?.to}>{data?.title}</Link>                                                            
                                                                        <ul>
                                                                            {data?.content?.map((item,i) => (
                                                                                <li key={i}><Link to={item.to}>{item.title}</Link></li>
                                                                            ))}                                                                
                                                                        </ul>
                                                                    </li> 
                                                                ))}

                                                            </ul>   
                                                        {/* </Collapse> */}
                                                    </li>
                                                </>                        
                                            }
                                        </>    
                                    </ul>
                                </div>    
                                :
                                ""
                            }                    
                    </Tab.Content>
                    <div>
                        <div className="dz-progress-bx">
                            <div className="progress-bar-content">
                                <h6 className="font-w500 mb-0">27.65 GB Used</h6>
                                <p className="info-content mb-2">82% used - 3.72 GB free</p>
                                <div className="progress default-progress">
                                    <div className="progress-bar bg-gradient1 progress-animated" 
                                        style={{width: "80%", height:"6px", backgroundColor:'var(--primary)'}}
                                    >
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="support-box">
                            <div className="support-info">
                                <span className="eclips"></span>
                                <h4 className="text-white fs-20">Upgrade to Pro</h4>
                                <p className="fs-14 info-content mb-2">Get one month free on annual subscruption</p>
                                <p className="text-white fs-14">Upgrade Today!</p>
                            </div>
                            <div className="support-media">
                                <img src={IMAGES.SupportMedia} alt="" />
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <Header
                onNote={() => onClick("chatbox")}
                onNotification={() => onClick("notification")}
                onProfile={() => onClick("profile")}
                toggle={toggle}
                title={title}
                onBox={() => onClick("box")}
                onClick={() => ClickToAddEvent()}                
            />
       
            <div className="deznav style-1">
                <div className="deznav-scroll d-flex justify-content-between flex-column d-flex justify-content-between flex-column">
                    <Nav as="ul" className="nav menu-tabs">
                        {sidebarMenu.map((item, index)=>(
                            <Nav.Item as="li" key={index}                                
                                onClick={()=>{
                                    setOpenSidebar(true)
                                    handleMenuOpen(index)
                                    setCloseSidebar(index)
                                }}
                                
                            >
                                <Nav.Link className="ai-icon" eventKey={item.menuKey}
                                    onClick={()=>{
                                        setActiveMenu(index)                                                                            
                                    }}
                                >
                                    {item.mainicon}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                    <div className="dz-dark-mode">
					    <input type="checkbox" className="checkbox" id="chk" 
                            onChange={handleChangeMode}
                        />
                        <label className="label" htmlFor="chk">
                            <span className="dz-light">light</span>
                            <span  className="dz-dark">Dark</span>
                            <span className="ball"></span>
                        </label>
                    </div>
                </div>
            </div>
        </Tab.Container>
    </Fragment>
  );
};

export default Deflayout;
