import React, { useContext } from "react";
/// React router dom
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";
import { navtoggle } from "../../../store/actions/AuthActions";
import { useDispatch, useSelector } from "react-redux";


const NavHader = ({nvhader, openSidebar}) => {  
  const {  openMenuToggle, } = useContext(
    ThemeContext
  );
  	const dispatch = useDispatch();
    const sideMenu = useSelector(state => state.sideMenu);
    const handleToogle = () => {
      dispatch(navtoggle());
    };	
  return (
    <div className="nav-header">
      <Link to="/" className="brand-logo">
			<svg  className="logo-abbr" width="40" height="40" viewBox="0 0 576 672" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path fillRule="evenodd" clipRule="evenodd" d="M4.00292 165C-30.9998 505 180 618 288.003 672C289.669 671.183 291.364 670.354 293.088 669.511C396.895 618.73 602.494 518.153 572.003 166L288.003 0L4.00292 165ZM63.0234 202.7C35.6872 467.9 203.473 559.88 287.82 602C288.895 601.474 289.986 600.94 291.094 600.399C372.093 560.798 539.498 478.953 515.617 203.48L287.82 74L63.0234 202.7Z" fill="white"/>
				<path d="M499 392L235 238L289 204L514 336L499 392Z" fill="white"/>
				<path d="M499 392L235 238L289 204L514 336L499 392Z" stroke="white"/>
				<path d="M59 278L336 434L290 476L44 334L59 278Z" fill="white"/>
				<path d="M59 278L336 434L290 476L44 334L59 278Z" stroke="white"/>
			</svg>
			{nvhader === "first" ?
				<div className="brand-title">
					<h1 className="mb-0">NOVA</h1>
				</div> 			
				:
				''
			}
		</Link>

      <div
        className="nav-control"
        onClick={() => {
			handleToogle()
		  	openMenuToggle();        
        }}
      >
        <div className={`hamburger ${sideMenu ? "is-active" : ""} ${openSidebar ? 'd-none' : ''}` } >
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
		  	<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect x="22" y="11" width="4" height="4" rx="2" fill="#2A353A"/>
				<rect x="11" width="4" height="4" rx="2" fill="#2A353A"/>
				<rect x="22" width="4" height="4" rx="2" fill="#2A353A"/>
				<rect x="11" y="11" width="4" height="4" rx="2" fill="#2A353A"/>
				<rect x="11" y="22" width="4" height="4" rx="2" fill="#2A353A"/>
				<rect width="4" height="4" rx="2" fill="#2A353A"/>
				<rect y="11" width="4" height="4" rx="2" fill="#2A353A"/>
				<rect x="22" y="22" width="4" height="4" rx="2" fill="#2A353A"/>
				<rect y="22" width="4" height="4" rx="2" fill="#2A353A"/>
			</svg>
        </div>
      </div>
    </div>
  );
};

export default NavHader;
