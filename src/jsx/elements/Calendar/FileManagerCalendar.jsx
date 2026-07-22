import React, { Component } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Alert from "sweetalert2";

class FileManagerCalendar extends Component {
	state = {
		calendarEvents: [
            {
				title: "Atlanta Monster",
				start: new Date("2024-02-07 00:00"),
				id: "99999991",
			},
			{
				title: "My Favorite Movie",
				start: new Date("2024-02-19 00:00"),
				id: "99999992",
			},
			{
				title: "Enggement Function",
				start: new Date("2024-02-25 00:00"),
				id: "99999993",
			},
			{
				title: "Marrige Function",
				start: new Date("2024-03-23 00:00"),
				id: "99999994",
			},
			{
				title: "Party With Friends",
				start: new Date("2024-03-26 00:00"),
				id: "99999995",
			},
			{
				title: "Atlanta Monster",
				start: new Date("2024-03-07 00:00"),
				id: "99999991",
			},
			{
				title: "My Favorite Movie",
				start: new Date("2024-03-15 00:00"),
				id: "99999992",
			},
			{
				title: "Enggement Function",
				start: new Date("2024-03-22 00:00"),
				id: "99999993",
			},
			{
				title: "Marrige Function",
				start: new Date("2024-03-28 00:00"),
				id: "99999994",
			},
			{
				title: "Party With Friends",
				start: new Date("2024-04-01 00:00"),
				id: "99999995",
			},
		 
		],
		events: [
			{ title: "Event 1", id: "1" },
			{ title: "Event 2", id: "2" },
			{ title: "Event 3", id: "3" },
			{ title: "Event 4", id: "4" },
			{ title: "Event 5", id: "5" },
		],
   };

  

  
   eventClick = (eventClick) => {
      Alert.fire({
         title: eventClick.event.title,
         html:
            `<div className="table-responsive">
      <table className="table">
      <tbody>
      <tr >
      <td>Title</td>
      <td><strong>` +
            eventClick.event.title +
            `</strong></td>
      </tr>
      <tr >
      <td>Start Time</td>
      <td><strong>
      ` +
            eventClick.event.start +
            `
      </strong></td>
      </tr>
      </tbody>
      </table>
      </div>`,

         showCancelButton: true,
         confirmButtonColor: "#d33",
         cancelButtonColor: "#3085d6",
         confirmButtonText: "Remove Event",
         cancelButtonText: "Close",
      }).then((result) => {
         if (result.value) {
            eventClick.event.remove(); // It will remove event from the calendar
            Alert.fire("Deleted!", "Your Event has been deleted.", "success");
         }
      });
   };

   render() {
      return (
         <>
			<div className="app-fullcalendar" id="calendar">
			   <FullCalendar
				  defaultView="dayGridMonth"
					headerToolbar={{
						start: "prev,next today",
						center: "title",
						end:"dayGridMonth,timeGridWeek,timeGridDay",
					}}
				  rerenderDelay={10}
				  eventDurationEditable={false}
				  editable={true}
				  droppable={true}
				  plugins={[
					 dayGridPlugin,
					 timeGridPlugin,
					 interactionPlugin,
				  ]}
				  ref={this.calendarComponentRef}
				  weekends={this.state.calendarWeekends}
				  events={this.state.calendarEvents}
				  eventDrop={this.drop}
				  // drop={this.drop}
				  eventReceive={this.eventReceive}
				  eventClick={this.eventClick}
				  // selectable={true}
			   />
			</div>
         </>
      );
   }
}

export default FileManagerCalendar;
