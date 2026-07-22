
import React, { useState } from "react";
import {Link} from 'react-router-dom';
import { DragDropContext } from "@hello-pangea/dnd";
import  Column  from "./Column";
import { Dropdown } from "react-bootstrap";
import { SVGICON } from "../../../constant/theme";

function HeadOne({title}){   
    return(
        <>
            <div className={`sub-card align-items-center d-flex justify-content-between mb-2`}>
                <div>
                    <h3 className="heading">{title}</h3>
                </div>
                <Dropdown className="custom-dropdown ms-2">
                    <Dropdown.Toggle as="div" className="btn sharp btn-primary tp-btn sharp-sm i-false">
                      {SVGICON.DropdownIcon}                        
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu-end" align="end">
                        <Dropdown.Item>Option 1</Dropdown.Item>
                        <Dropdown.Item>Option 2</Dropdown.Item>
                        <Dropdown.Item>Option 3</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="plus-bx">
                <Link to={"#"} >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 0C4.05 0 0 4.05 0 9C0 13.95 4.05 18 9 18C13.95 18 18 13.95 18 9C18 4.05 13.95 0 9 0ZM9 16.125C5.1 16.125 1.875 12.9 1.875 9C1.875 5.1 5.1 1.875 9 1.875C12.9 1.875 16.125 5.1 16.125 9C16.125 12.9 12.9 16.125 9 16.125Z" fill="#2A353A"/>
                        <path d="M13.3498 8.02503H9.9748V4.65003C9.9748 4.12503 9.52481 3.67503 8.99981 3.67503C8.47481 3.67503 8.02481 4.12503 8.02481 4.65003V8.02503H4.6498C4.1248 8.02503 3.6748 8.47503 3.6748 9.00003C3.6748 9.52503 4.1248 9.97503 4.6498 9.97503H8.02481V13.35C8.02481 13.875 8.47481 14.325 8.99981 14.325C9.52481 14.325 9.9748 13.875 9.9748 13.35V9.97503H13.3498C13.8748 9.97503 14.3248 9.52503 14.3248 9.00003C14.3248 8.47503 13.8748 8.02503 13.3498 8.02503Z" fill="#2A353A"/>
                    </svg>
                    {" "}Add new card
                </Link>
            </div>           
        </>
    )
}


const reorderColumnList = (sourceCol, startIndex, endIndex) => {
  const newTaskIds = Array.from(sourceCol.taskIds);
  const [removed] = newTaskIds.splice(startIndex, 1);
  newTaskIds.splice(endIndex, 0, removed);

  const newColumn = {
    ...sourceCol,
    taskIds: newTaskIds,
  };

  return newColumn;
};


const initialData = {
    tasks: {
      1: { id: 1, dropid:'101', content: "Create Empty State",maintitle:'Illustration',  select:'secondary'},
      2: { id: 2, dropid:'102', content: "Homepage Illustration ",maintitle:'Design',  select:'danger' },
      3: { id: 3, dropid:'103', content: "Doing Research",maintitle:'Development',  select:'pink' },
      4: { id: 4, dropid:'104', content: "Debugging" ,maintitle:'Illustration',  select:'secondary'},
      5: { id: 5, dropid:'105', content: "Create a Content",maintitle:'Copywriting',  select:'danger' },
      6: { id: 6, dropid:'106', content: "Create a Caption",maintitle:'Design',  select:'pink' },
      7: { id: 7, dropid:'107', content: "Create Empty State",maintitle:'Development',  select:'secondary' },
      8: { id: 8, dropid:'108', content: "Doing Research",maintitle:'Illustration',  select:'danger' },
      9: { id: 9, dropid:'109', content: "Homepage Illustration",maintitle:'Copywriting',  select:'pink' },
      10: { id: 10, dropid:'110', content: "Debugging",maintitle:'Design',  select:'secondary'},
      11: { id: 11, dropid:'111', content: "Create a Content",maintitle:'Development',  select:'danger' },
      12: { id: 12, dropid:'112', content: "Create a Caption",maintitle:'Copywriting',  select:'pink' },
      13: { id: 13, dropid:'113', content: "Homepage Illustration",maintitle:'Design',  select:'secondary' },
      14: { id: 14, dropid:'114', content: " Doing Research",maintitle:'Illustration',  select:'danger' },
    },
    columns: {
      "column-1": {
        id: "column-1",
        title: <HeadOne title="To Do"/>,
        taskIds: [1, 2],
      },
      "column-2": {
        id: "column-2",
        title: <HeadOne title="On Progress"/>,
        taskIds: [3,4, 5],
      },
      "column-3": {
        id: "column-3",
        title:<HeadOne title="Quality Control"/>,
        taskIds: [6,7],
      },
      "column-4": {
        id: "column-4",
        title:<HeadOne title="Completed"/>,        
        taskIds: [8,9],
      },
   
    },  
    columnOrder: ["column-1", "column-2", "column-3","column-4"],
  };
  


export default function TaskSummaryBlog() {
  const [state, setState] = useState(initialData);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    // If user tries to drop in an unknown destination
    if (!destination) return;
   
    const sourceCol = state.columns[source.droppableId];
    const destinationCol = state.columns[destination.droppableId];

    if (sourceCol.id === destinationCol.id) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      );

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };
      setState(newState);
      return;
    }

    const startTaskIds = Array.from(sourceCol.taskIds);
    const [removed] = startTaskIds.splice(source.index, 1);
    const newStartCol = {
      ...sourceCol,
      taskIds: startTaskIds,
    };

    const endTaskIds = Array.from(destinationCol.taskIds);
    endTaskIds.splice(destination.index, 0, removed);
    const newEndCol = {
      ...destinationCol,
      taskIds: endTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      },
    };

    setState(newState);
  };

  return (
    <>
        <DragDropContext onDragEnd={onDragEnd}>        
            {state.columnOrder.map((columnId, id) => {
                const column = state.columns[columnId];
                const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);
                return(
                  <Column key={column.id} 
                    column={column} 
                    tasks={tasks} 
                  />  
                )
            })}    
        </DragDropContext>
    </>
  );
}