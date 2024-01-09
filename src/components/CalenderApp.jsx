import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import koLocale from '@fullcalendar/core/locales/ko';
import MeetingDialog from "./MeetingDialog.jsx";
import {useRef, useState} from "react";
import {v4 as uuidv4} from 'uuid'

const CalenderApp = () => {
  const [dateEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const calendarRef = useRef(null);
  const handleDateSelect = (selectInfo) => {
    setIsModalOpen(true);
    setSelectedInfo(selectInfo);
  };

  const handleMeetingDialogClose = () => {
    console.log("handleMeetingDialogClose")
    setIsModalOpen(false);
  };

  const handleMeetingDialogSave = (data) => {
    console.log("handleMeetingDialogSave")

    console.log(data)

    const calendarApi = calendarRef.current.getApi();
    const eventId = uuidv4();
    const newEvent = {
      id: eventId,
      title: data.meetingContent,
      start: selectedInfo.startStr,
      end: selectedInfo.endStr,
      allDay: selectedInfo.allDay,
    };

    calendarApi.addEvent(newEvent);
    handleMeetingDialogClose();
  };
  const handleEventAdd = () => {
    console.log("handleEventAdd")
  }
  const handleEventRemove = () => {
    console.log("handleEventRemove")
  }
  const handleEventChange = () => {
    console.log("handleEventChange")
  }
  const handleEventClick = (clickInfo) => {
    if (confirm(`'${clickInfo.event.title}' 를 삭제 하시겠습니까?`)) {
      clickInfo.event.remove();
    }
  };

  return (
      <div className='demo-app min-h-screen flex justify-center items-center'>
        <div className='demo-app-main mx-auto min-w-[800px] flex flex-col'>
          <h1 className="text-3xl font-semibold mb-4 text-center p-2">- 905호
            회의실 예약 📅 -</h1>
          <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridThreeDay,timeGridDay'
              }}
              initialView='timeGridThreeDay'
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              initialEvents={dateEvents} // alternatively, use the `events` setting to fetch from a feed
              select={handleDateSelect}
              //eventContent={renderEventContent} // custom render function
              //eventClick={this.handleEventClick}
              //eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
              locale={koLocale}  // 한국어 locale 적용
              nowIndicator={true}  // 현재 시간 표시 활성화
              scrollTime={new Date().toLocaleTimeString([],
                  {hour: '2-digit', minute: '2-digit'})} // 현재 시간 포커싱
              //slotDuration='00:05:00'  // 5분 간격으로 설정 기본값 30분
              //you can update a remote database when these fire:
              eventAdd={handleEventAdd}
              eventChange={handleEventChange}
              eventRemove={handleEventRemove}
              eventClick={handleEventClick}  // 이벤트 클릭 이벤트 핸들러
              views={{
                timeGridThreeDay: { // 새로 추가된 뷰 옵션
                  type: 'timeGrid',
                  duration: {days: 3},
                  buttonText: '3일',
                },
              }}
          />
        </div>
        <MeetingDialog
            isOpen={isModalOpen}
            onClose={handleMeetingDialogClose}
            onSave={handleMeetingDialogSave}
        />
      </div>
  )
};

export default CalenderApp;


