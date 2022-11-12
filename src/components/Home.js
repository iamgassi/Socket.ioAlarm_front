import React, { useEffect, useState } from 'react'
import './Home.css'
import { Avatar } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { Alert } from '@mui/material';
import moment from 'moment'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

import Typography from '@mui/material/Typography';


import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Cookies from 'universal-cookie';
import { useNavigate} from 'react-router-dom'

import axios from 'axios';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';

import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import Stack from '@mui/material/Stack';

import io from 'socket.io-client'
import Alarm from './Alarm';
 
const cookies = new Cookies();

const options = [
  "Create Alram",
  "Logout"
];

const ITEM_HEIGHT = 48;

  let socket;

  const Home = () => {
  const [value, setValue] = React.useState(dayjs(new Date()));
    const [alert,setAlert]=useState(false)
    const [alertMsg,setAlertMsg]=useState('')

    useEffect(()=>{
        socket=io(ENDPOINT);

        socket.on('reminder',(msg)=>{
              console.log(msg)
              return  (setAlert(true),setAlertMsg(msg))
        })         
        return ()=>{
          socket.disconnect();
          socket.off()
        }
      },[])



  const ENDPOINT='http://localhost:5000'
  const [allUsers, setallUsers] = useState([])
  const [user, setuser] = useState([])
  const [alarm, setAlarm] = useState('')
  const [fetchalarm, setfetchAlarm] = useState([])
  const userId=cookies.get("userId")
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const [open1, setOpen1] = React.useState(false);
  const [openAlarmPopup, setopenAlarmPopup] = useState(false)
  const [notification, setnotification] = useState("success")

  const handleClickOpen = (scrollType) => () => {
    setOpen1(true);

  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open1) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open1]);



  useEffect(function(){
    onLoad()
    socket.emit("user join",userId)
    console.log("user join emited in on load")

   },[openAlarmPopup]);

  
  const onLoad=async()=>{
   
    const response1=await axios.get(`${ENDPOINT}/user`)
    const result1=response1.data
     setallUsers(result1)

   const response2=await axios.get(`${ENDPOINT}/user/${userId}`)
    const result2=response2.data
        setuser(result2)

    const response3=await axios.get(`${ENDPOINT}/alarm/${userId}`)
    const result3=response3.data
    setfetchAlarm(result3)     

   }

  const optionDot = (event) => {
    setAnchorEl(event.currentTarget);

  };
  const handleClose = (option) => {

    setAnchorEl(null);
   if(option==="Logout")
   {
     cookies.remove("loggedIn",{ path: '/'});
     cookies.remove("userId",{ path: '/'});
     navigate('/');
   }
     else if(option==='Create Alram')
   {
     setopenAlarmPopup(true)
   }
    
  };



  if (!allUsers && !user) return

  const handleAlarm=()=>{
    // e.preventDefault()
    console.log("insode alartm",value)
    if (value) {

     let obj={
      username:user.username,
      alarmId:userId,
      alarmTime:value.$d
      
    }
     try {
    
       fetch(`${ENDPOINT}/alarm`,{
        mode: 'cors',
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
          "Content-Type":"application/json",
        }
      })
     } catch (error) {
      console.log(error)
     }

      }
    setAlarm("")
  }

  const handleDateTime=(recievedDateTime)=>{
    const currentDateTime = new Date();
    console.log(currentDateTime,recievedDateTime)
    if(currentDateTime > new Date(recievedDateTime)){
      setAlertMsg('Date time should be grater than ')
      setAlert(true);
      setopenAlarmPopup(false)
      setnotification("error")
    }
    else{
      console.log(recievedDateTime,'onchange')
      handleAlarm()
    }
  }
  
  return (
    <div className="app">
    <div className="app__top"></div>
    <div className="app__container">
      <div className='alarm'>
      <div className='nav'>
      <IconButton>
      <Avatar  alt="A Sharp" />
  
      </IconButton>
     
       <span className='username'> {user.username}</span>
    

      <IconButton   
        style={{ color: 'white' }}      
        className='optionDot'     
        aria-label="more"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={optionDot}
        >
      <MoreVertIcon />

      </IconButton>
      <Menu

        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} onClick={()=>handleClose(option)}>
            {option}
          </MenuItem>
        ))}

      </Menu>

      <div className='alert'>
       {alert?(
         setTimeout(() => {
          setAlert(false)
         }, 2000) ,
        <Alert icon={<CheckIcon fontSize="inherit" />}  severity={notification}>{alertMsg}</Alert>
      ):null}
      </div>

      </div>

       {fetchalarm.length?( <List sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>

          {
            fetchalarm.map(alarm=>
              {   
                return (
                  <div  key={alarm.alarmTime}>
    
        
           <ListItem alignItems="flex-start" style={{cursor:"pointer"}}>
           <ListItemAvatar>
           {(new Date(alarm.alarmTime)>new Date())?(<AccessAlarmIcon></AccessAlarmIcon>):<AlarmOffIcon></AlarmOffIcon>}
           </ListItemAvatar>
           <ListItemText 
           className='ListUsername'
           primary={
            moment((alarm.alarmTime.split('G')[0])).format('h:mm:ss A || MMM Do YYYY')
          }
           secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
           {(new Date(alarm.alarmTime)>new Date())?(moment((alarm.alarmTime.split('G')[0])).calendar()):("Alarm Reached 😴")}

             
              </Typography>
             
            </React.Fragment>
          }
          />
      </ListItem>
    
      <Divider variant="inset" component="li" />
                 
                  </div>

                )
              })
          }
    </List>
    // , <Alarm/>    
    ):
    (
   
    <List sx={{ width: '100%', maxWidth: 620, bgcolor: 'background.paper' }}>
 
      <ListItem alignItems="flex-start" style={{cursor:"pointer"}}>
           <ListItemAvatar>
           <Avatar alt={"S"} src="#" />
           </ListItemAvatar>
           <ListItemText
           className='ListUsername'
          primary={"Create Alarm"}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
                
              >
               New Alarm
              </Typography>
             
            </React.Fragment>
          }
          onClick={handleClickOpen('paper')}
          
          />
      </ListItem>
      </List>

    )
    }

      </div>

    <div>

    
   
    </div>

          



      
       
          {/* <form onSubmit={handleAlarm}>
         <label for="alarmdaytime">Set Alarm</label>
        <input type='datetime-local'id="alarmdaytime" name="alarmdaytime" onChange={e=>handleDateTime(e)} />
        <button type='submit'>Done</button>
        </form> */}
      </div>

      {openAlarmPopup &&
    (<LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <MobileDateTimePicker
          open={openAlarmPopup}
          onAccept={e=>{handleDateTime(value)}}
          onClose={e=>{setopenAlarmPopup(false)}}
          // closeOnSelect={false}
          disablePast={true}
          openTo={'day' || 'hours' || 'minutes' || 'month' || 'year' || 'seconds'}
          label="For mobile"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
        </Stack>
        </LocalizationProvider>
        )}
      </div>
  )
}

export default Home

