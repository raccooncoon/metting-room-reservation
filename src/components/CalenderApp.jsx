import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import koLocale from '@fullcalendar/core/locales/ko';
import MeetingDialog from "./MeetingDialog.jsx";
import {useRef, useState} from "react";
import {v4 as uuidv4} from 'uuid'
import dayjs from "dayjs";
import {generateClient} from "aws-amplify/api";
import {
  createReservation,
  deleteReservation,
  updateReservation
} from "../graphql/mutations";

const client = generateClient()

const CalenderApp = ({initReservations}) => {
  console.log("initReservations =>> ", initReservations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const calendarRef = useRef(null);

  const getGitBranch = () => {
    // 이 함수는 브라우저의 개발자 도구에서 보이는 환경 변수 중
    // REACT_APP_GIT_BRANCH 값을 반환합니다.
    return import.meta.env.REACT_APP_GIT_BRANCH || 'DefaultBranch';
  };

  const meetingRoom = getGitBranch();

  const handleDateSelect = async (selectInfo) => {

    if (dayjs(selectInfo.startStr).isBefore(dayjs())) {
      alert('현재 날짜 또는 시간 이전으로는 예약할 수 없습니다.');
      setSelectedInfo(null);
      setSelectedEvent(null);
      return;
    }

    setIsModalOpen(true);
    setSelectedInfo(selectInfo);

  };

  const handleDialogClose = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedInfo(null);
    setSelectedEvent(null);
  };

  const handleDialogDelete = async () => {

    const calendarApi = calendarRef.current.getApi();

    if (selectedEvent) {
      const eventId = selectedEvent.id;
      const deletedEvent = calendarApi.getEventById(eventId);
      if (deletedEvent) {
        deletedEvent.remove();
      }
    }

    handleDialogClose();
  };

  const handleDialogSave = (data) => {

    const calendarApi = calendarRef.current.getApi();
    if (selectedEvent) {
      // If there is a selected event, update its properties
      selectedEvent.setProp('title', data.meetingContent);
      selectedEvent.setExtendedProp('attendees', data.attendees);
      selectedEvent.setStart(data.startStr);
      selectedEvent.setEnd(data.endStr);
    } else {
      const eventId = uuidv4();
      const newEvent = {
        id: eventId,
        title: data.meetingContent,
        start: data.startStr,
        end: data.endStr,
        allDay: false,
        extendedProps: {
          attendees: data.attendees,
        },
      };
      calendarApi.addEvent(newEvent);
    }
    handleDialogClose();
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setIsEditModalOpen(true);
  };

  const handleEventAdd = async (data) => {
    await client.graphql({
      query: createReservation,
      variables: {
        input: {
          "id": data.event.id,
          "meetingContent": data.event.title,
          "attendees": data.event.extendedProps.attendees,
          "startStr": dayjs(data.event.startStr).toISOString(),
          "endStr": dayjs(data.event.endStr).toISOString()
        }
      }
    });

  }
  const handleEventRemove = async (data) => {
    await client.graphql({
      query: deleteReservation,
      variables: {
        input: {
          id: data.event.id
        }
      }
    });

  }
  const handleEventChange = async (data) => {
    await client.graphql({
      query: updateReservation,
      variables: {
        input: {
          "id": data.event.id,
          "meetingContent": data.event.title,
          "attendees": data.event.extendedProps.attendees,
          "startStr": dayjs(data.event.startStr).toISOString(),
          "endStr": dayjs(data.event.endStr).toISOString()
        }
      }
    });
  }

  // eventsSet 콜백 함수 정의
  const handleEventsSet = (events) => {
    console.log('이벤트가 설정되었습니다:', events);
    // 추가적인 작업 수행 가능
  };

  return (
      <div className='demo-app min-h-screen flex justify-center items-center'>
        <div className='demo-app-main mx-auto max-w-[1200px] min-h-[800px]  '>
          <h1 className="text-3xl font-semibold mb-4 text-center pb-4">- {meetingRoom} 호
            회의실 예약 📅 -</h1>
          <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev,next',
                center: 'title',
                //right: 'dayGridMonth,timeGridWeek,timeGridDay'
                right: 'today'
              }}
              initialView='timeGridWeek'
              allDaySlot={false}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={false}
              weekends={false}
              contentHeight="auto" // 콘텐츠 높이를 자동으로 조절
              initialEvents={initReservations} // alternatively, use the `events` setting to fetch from a feed
              select={handleDateSelect}
              //eventContent={renderEventContent} // custom render function
              eventsSet={handleEventsSet} // called after events are initialized/added/changed/removed
              locale={koLocale}  // 한국어 locale 적용
              nowIndicator={true}  // 현재 시간 표시 활성화
              scrollTime={dayjs().format('HH:mm')} // 현재 시간 포커싱
              eventAdd={handleEventAdd}
              eventChange={handleEventChange}
              eventRemove={handleEventRemove}
              eventClick={handleEventClick}
              views={{
                timeGridWeek: {
                  //slotDuration: "00:15:00", // 15분 간격으로 설정
                  slotMinTime: "09:00:00", // 시간 범위 시작 (오전 7시)
                  slotMaxTime: "22:00:00", // 시간 범위 종료 (24시)
                },
              }}
          />
        </div>
        {isModalOpen &&
            <MeetingDialog
                isOpen={isModalOpen}
                onClose={handleDialogClose}
                onSave={handleDialogSave}
                data={{
                  startStr: selectedInfo ? selectedInfo.startStr : '',
                  endStr: selectedInfo ? selectedInfo.endStr : '',
                  meetingContent: '',
                  attendees: ''
                }}
            />}
        {isEditModalOpen &&
            <MeetingDialog
                isOpen={isEditModalOpen}
                onClose={handleDialogClose}
                onSave={handleDialogSave}
                onDelete={handleDialogDelete}
                data={{
                  meetingContent: selectedEvent ? selectedEvent.title : '',
                  attendees: selectedEvent
                      ? selectedEvent.extendedProps.attendees : '',
                  startStr: selectedEvent ? selectedEvent.startStr : '',
                  endStr: selectedEvent ? selectedEvent.endStr : '',
                }}
            />}
      </div>
  );
};

export default CalenderApp;
