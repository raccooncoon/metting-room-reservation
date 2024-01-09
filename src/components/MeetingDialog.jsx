import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useState} from "react";

const MeetingDialog = ({isOpen, onClose, onSave}) => {

  const [meetingContent, setMeetingContent] = useState('');

  const handleSave = () => {
    onSave({ meetingContent });
    setMeetingContent(''); // 저장 후 내용 초기화
    onClose(); // 다이얼로그 닫기
  };
  return (
      <React.Fragment>
        <Dialog open={isOpen} onClose={onClose}>
          <DialogTitle>예약</DialogTitle>
          <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="contents"
                label="회의 내용"
                fullWidth
                variant="standard"
                onChange={(event) => setMeetingContent(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            {onSave && <Button onClick={handleSave}>저장</Button>}
            {onClose && <Button onClick={onClose}>취소</Button>}
          </DialogActions>
        </Dialog>
      </React.Fragment>
  );
}

export default MeetingDialog;
