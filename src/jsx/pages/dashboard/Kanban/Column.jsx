import React from "react";
import {Link} from 'react-router-dom';
import { Draggable } from "@hello-pangea/dnd";
import { Droppable } from "@hello-pangea/dnd";
import { Dropdown } from "react-bootstrap";
import { IMAGES } from "../../../constant/theme";

function DropdownBox(){
	return(
		<Dropdown>
			<Dropdown.Toggle variant="" as="div" className="i-false" >	
				<Link to={"#"} data-toggle="dropdown" aria-expanded="false">
				<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M4.58333 13.5207C3.19 13.5207 2.0625 12.3932 2.0625 10.9998C2.0625 9.6065 3.19 8.479 4.58333 8.479C5.97667 8.479 7.10417 9.6065 7.10417 10.9998C7.10417 12.3932 5.97667 13.5207 4.58333 13.5207ZM4.58333 9.854C3.95083 9.854 3.4375 10.3673 3.4375 10.9998C3.4375 11.6323 3.95083 12.1457 4.58333 12.1457C5.21583 12.1457 5.72917 11.6323 5.72917 10.9998C5.72917 10.3673 5.21583 9.854 4.58333 9.854Z" fill="#717579"/>
					<path d="M17.4168 13.5207C16.0235 13.5207 14.896 12.3932 14.896 10.9998C14.896 9.6065 16.0235 8.479 17.4168 8.479C18.8102 8.479 19.9377 9.6065 19.9377 10.9998C19.9377 12.3932 18.8102 13.5207 17.4168 13.5207ZM17.4168 9.854C16.7843 9.854 16.271 10.3673 16.271 10.9998C16.271 11.6323 16.7843 12.1457 17.4168 12.1457C18.0493 12.1457 18.5627 11.6323 18.5627 10.9998C18.5627 10.3673 18.0493 9.854 17.4168 9.854Z" fill="#717579"/>
					<path d="M10.9998 13.5207C9.6065 13.5207 8.479 12.3932 8.479 10.9998C8.479 9.6065 9.6065 8.479 10.9998 8.479C12.3932 8.479 13.5207 9.6065 13.5207 10.9998C13.5207 12.3932 12.3932 13.5207 10.9998 13.5207ZM10.9998 9.854C10.3673 9.854 9.854 10.3673 9.854 10.9998C9.854 11.6323 10.3673 12.1457 10.9998 12.1457C11.6323 12.1457 12.1457 11.6323 12.1457 10.9998C12.1457 10.3673 11.6323 9.854 10.9998 9.854Z" fill="#717579"/>
				</svg>
				</Link>
			</Dropdown.Toggle>	
			<Dropdown.Menu  className="dropdown-menu-right"  align="end">
				<Dropdown.Item >Edit </Dropdown.Item>		
				<Dropdown.Item >Delete </Dropdown.Item>
			</Dropdown.Menu>	
		</Dropdown>
	)
}

const Column = ({ column, tasks }) => {
	return (
    <>
        <div className="col-xl-3 col-md-6 ">
            <div className="kanbanPreview-bx">
               <div className="draggable-zone dropzoneContainer">  
                    {column.title}
                    <Droppable droppableId={column.id}>
                        {(droppableProvided, droppableSnapshot) => (
                          <div     
                            className="h-100"                    
                              ref={droppableProvided.innerRef}
                              {...droppableProvided.droppableProps}
                          >
                            {tasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                                  {(draggableProvided) => (
                                    <div className="card draggable-handle draggable"
                                        ref={draggableProvided.innerRef}
                                        {...draggableProvided.draggableProps}
                                        {...draggableProvided.dragHandleProps}
                                    >                                    
                                        <div className="card-body">
                                          <div className="kanban-user">
                                            <span className={`badge light badge-${task.select}`}>{task.maintitle}</span>
                                            <ul className="users-list">
												<li><img src={IMAGES.smallpic2} alt="" className="avtar avtar-xs rounded-circle" /></li>
												<li><img src={IMAGES.smallpic3} alt="" className="avtar avtar-xs rounded-circle" /></li>
												<li><img src={IMAGES.smallpic4} alt="" className="avtar avtar-xs rounded-circle" /></li>
												<li><img src={IMAGES.smallpic5} alt="" className="avtar avtar-xs rounded-circle" /></li>
												<li><span>5+</span></li>
                                            </ul>
                                          </div>
                                          <p className="font-w600 fs-18"><Link to={"#"} className="text-black">{task.content}</Link></p>
                                          <span>Task Done: <strong className={`text-${task.select}`}>5/10</strong></span>
                                          <div className="progress default-progress mb-3 mt-2">
                                            <div className={`progress-bar progress-animated bg-${task.select} `} style={{width: "45%", height:"8px" }}>
                                              <span className="sr-only">45% Complete</span>
                                            </div>
                                          </div>
                                          <div className="d-flex justify-content-between align-items-center ">
                                            <ul className="d-flex align-items-center share-tp">
                                              <li>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                	<path d="M18.0797 12.42L11.8997 18.61C11.0895 19.33 10.0348 19.7133 8.95139 19.6814C7.86797 19.6495 6.83767 19.2049 6.07124 18.4384C5.30482 17.672 4.86018 16.6417 4.82829 15.5583C4.7964 14.4749 5.17966 13.4202 5.89967 12.61L13.8997 4.61C14.3773 4.1563 15.0109 3.90333 15.6697 3.90333C16.3284 3.90333 16.962 4.1563 17.4397 4.61C17.905 5.08159 18.1659 5.71747 18.1659 6.38C18.1659 7.04253 17.905 7.67841 17.4397 8.15L10.5397 15.04C10.4714 15.1135 10.3893 15.1729 10.298 15.2147C10.2068 15.2565 10.1082 15.28 10.008 15.2837C9.90767 15.2874 9.80763 15.2713 9.71356 15.2364C9.61948 15.2014 9.53321 15.1483 9.45967 15.08C9.38613 15.0117 9.32676 14.9296 9.28495 14.8384C9.24314 14.7471 9.21971 14.6486 9.216 14.5483C9.21228 14.448 9.22836 14.348 9.2633 14.2539C9.29825 14.1598 9.35138 14.0735 9.41967 14L14.5497 8.88C14.738 8.6917 14.8438 8.4363 14.8438 8.17C14.8438 7.9037 14.738 7.6483 14.5497 7.46C14.3614 7.2717 14.106 7.16591 13.8397 7.16591C13.5734 7.16591 13.318 7.2717 13.1297 7.46L7.99967 12.6C7.74298 12.8547 7.53924 13.1577 7.4002 13.4915C7.26117 13.8253 7.18959 14.1834 7.18959 14.545C7.18959 14.9066 7.26117 15.2647 7.4002 15.5985C7.53924 15.9323 7.74298 16.2353 7.99967 16.49C8.52404 16.9895 9.22048 17.2681 9.94467 17.2681C10.6689 17.2681 11.3653 16.9895 11.8897 16.49L18.7797 9.59C19.5746 8.73695 20.0073 7.60867 19.9867 6.44286C19.9662 5.27706 19.4939 4.16475 18.6694 3.34027C17.8449 2.51579 16.7326 2.04352 15.5668 2.02295C14.401 2.00238 13.2727 2.43512 12.4197 3.23L4.41967 11.23C3.34087 12.4248 2.7647 13.9899 2.8112 15.599C2.85771 17.2081 3.5233 18.7372 4.66931 19.8678C5.81532 20.9983 7.35335 21.6431 8.96296 21.6677C10.5726 21.6923 12.1296 21.0949 13.3097 20L19.4997 13.82C19.5929 13.7268 19.6669 13.6161 19.7173 13.4942C19.7678 13.3724 19.7938 13.2419 19.7938 13.11C19.7938 12.9781 19.7678 12.8476 19.7173 12.7257C19.6669 12.6039 19.5929 12.4932 19.4997 12.4C19.4064 12.3068 19.2957 12.2328 19.1739 12.1823C19.0521 12.1319 18.9215 12.1059 18.7897 12.1059C18.6578 12.1059 18.5272 12.1319 18.4054 12.1823C18.2836 12.2328 18.1729 12.3068 18.0797 12.4V12.42Z" fill="#666666"/>
                                                </svg>
                                              </li>
                                              <li>
                                                <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M10.2378 1.15881L11.7564 5.83258C11.9906 6.55362 12.6626 7.0418 13.4207 7.0418H18.335C18.5772 7.0418 18.6779 7.3517 18.4819 7.49405L14.5062 10.3826C13.8928 10.8282 13.6362 11.6181 13.8705 12.3392L15.3891 17.0129C15.4639 17.2432 15.2003 17.4348 15.0044 17.2924L11.0286 14.4039C10.4153 13.9583 9.58473 13.9583 8.97138 14.4039L4.99564 17.2924C4.79971 17.4348 4.53609 17.2432 4.61093 17.0129L6.12952 12.3392C6.3638 11.6181 6.10715 10.8282 5.4938 10.3826L1.51806 7.49405C1.32213 7.3517 1.42283 7.0418 1.66501 7.0418H6.57929C7.33743 7.0418 8.00936 6.55362 8.24364 5.83258L9.76224 1.15881C9.83707 0.928484 10.1629 0.928488 10.2378 1.15881Z" stroke="#666666" strokeWidth="1.5"/>
                                                </svg>
                                              </li>
                                            </ul>
                                            <div className="col-6 d-flex justify-content-end">
                                              <DropdownBox />
                                            </div>
                                          </div>
                                        </div>
                                    </div>
                                  )}
                                </Draggable>
                            ))}
                          </div>
                        )}
                    </Droppable>
                </div>
            </div>
        </div>
          
    </>
  );
};

export default Column;
