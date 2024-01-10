import * as React from 'react';
import {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Avatar} from "@mui/material";
import dayjs from "dayjs";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import {DemoContainer} from "@mui/x-date-pickers/internals/demo/index.js";
import {DatePicker} from "@mui/x-date-pickers";

const MeetingDialog = ({isOpen, onClose, onSave, onDelete, data}) => {

  const [meetingContent, setMeetingContent] = useState(data.meetingContent); // 회의 내용
  const [attendees, setAttendees] = useState(data.attendees); // 참석자
  const [startStr, setStartStr] = useState(data.startStr);
  const [endStr, setEndStr] = useState(data.endStr);


  const init = () => {
    //초기화
    setMeetingContent('');
    setAttendees('');
    setStartStr('')
    setEndStr('')

    onClose();
  }

  const handleSave = () => {
    onSave({meetingContent,attendees,startStr,endStr });
    init();
  };

  const handleCancel = () => {
    onClose(); // 다이얼로그 닫기
    init();
  }

  const handleDelete = () => {
    onDelete();
    init();
  }

  const handleDateTimeChange = (newDateTime, type) => {
    if (dayjs(newDateTime).isBefore(dayjs())) {
      alert('현재 날짜 또는 시간 이전으로는 예약할 수 없습니다.');
      return;
    }

    type === 'start' ? setStartStr(newDateTime) : setEndStr(newDateTime);
  };

  const renderPicker = (label, value, type, pickerType) => (
      <DemoContainer components={[pickerType]}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {pickerType === 'DatePicker' ? (
              <DatePicker
                  label={label}
                  value={dayjs(value)}
                  format="YYYY년 M월 D일"
                  onChange={(newDate) => handleDateTimeChange(dayjs(newDate).format('YYYY-MM-DD HH:mm:ss'), type)}
                  readOnly
              />
          ) : (
              <TimePicker
                  label={label}
                  value={dayjs(value)}
                  onChange={(newTime) => handleDateTimeChange(dayjs(newTime).format('YYYY-MM-DD HH:mm:ss'), type)}
                  readOnly
              />
          )}
        </LocalizationProvider>
      </DemoContainer>
  );

  const renderPickerPair = (dateLabel, dateValue, timeLabel, timeValue, type) => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          {renderPicker(dateLabel, dateValue, type, 'DatePicker')}
          {renderPicker(timeLabel, timeValue, type, 'TimePicker')}
        </div>
      </div>
  );

  return (
      <React.Fragment>
        <Dialog
            open={isOpen}
            onClose={handleCancel}
        >
          <DialogTitle>회의실 예약</DialogTitle>
          <DialogContent>
            {renderPickerPair('시작 일', startStr, '시작 시간', startStr, 'start')}
            {renderPickerPair('종료 일', endStr, '종료 시간', endStr, 'end')}
            <div style={{
              display: 'flex',
              overflowX: 'auto'
            }}>
              {attendees && attendees.split(';').map((attendee, index) => (
                  <Avatar key={index} style={{margin: '4px'}}>
                    {attendee.trim().charAt(0)}
                  </Avatar>
              ))}
            </div>
            <TextField
                autoFocus
                margin="dense"
                id="attendee"
                label="참석자"
                placeholder="; 으로 사용자 구분"
                value={attendees}
                fullWidth
                variant="standard"
                onChange={(event) => setAttendees(event.target.value)}
            />
            <TextField
                autoFocus
                margin="dense"
                id="contents"
                label="회의 내용"
                fullWidth
                value={meetingContent}
                onChange={(event) => setMeetingContent(event.target.value)}
                multiline
                rows={4}
            />
          </DialogContent>
          <DialogActions>
            {onDelete && <Button onClick={handleDelete} color="error">삭제</Button>}
            {onClose && <Button onClick={handleCancel}>취소</Button>}
            {onSave && <Button onClick={handleSave}>저장</Button>}
          </DialogActions>
        </Dialog>
      </React.Fragment>
  );
}

export default MeetingDialog;
