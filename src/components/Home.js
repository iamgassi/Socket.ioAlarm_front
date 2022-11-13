import React, { useEffect, useState } from 'react'
import './Home.css'
import { AlertTitle, Avatar } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { Alert } from '@mui/material';
import moment from 'moment'
import home from './new.jpg'
import ScrollToBottom from 'react-scroll-to-bottom';

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
import AlartMessage from './AlartMessage';
 
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
    const [alartTitle, setalartTitle] = useState('Success')
    const [alertMsg,setAlertMsg]=useState('')

    useEffect(()=>{
        socket=io(ENDPOINT);

        socket.on('reminder',(msg)=>{
              console.log(msg)
              return  (setAlert(true),setAlertMsg(msg),setalartTitle('Success'))
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
      setAlert(true)
      setAlertMsg("Alarm set successfully")
      setnotification('success')
      setalartTitle('Success')

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
      setAlertMsg('Date time must be greater than current Time')
      setAlert(true);
      setopenAlarmPopup(false)
      setnotification("error")
      setalartTitle('Failed')
    }
    else{
      console.log(recievedDateTime,'onchange')
      handleAlarm()
    }
  }
  
  return (
    <div className="app" style={{backgroundImage:`url(${home})`, backgroundPosition: "center",    backgroundRepeat: "no-repeat" ,}}>
    <div className="app__container" >
      <div className='alarm'  >
      <div className='nav'>
    
       <span className='username'>Hello , {user.username}</span>
    

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

     

      </div>
      

  
       {fetchalarm.length?( 
         
         <List className='listItems' sx={{ width: '100%', maxWidth: 1520, bgcolor: 'background.paper' }}>

          {
            fetchalarm.map(alarm=>
              {   
                return (
                  <>
    
           <ListItem disabled={(new Date(alarm.alarmTime)>new Date())?false:true} key={alarm.alarmTime} alignItems="flex-start" style={{cursor:"pointer"}}>
           <ListItemAvatar>
           {(new Date(alarm.alarmTime)>new Date())?(<AccessAlarmIcon fontSize='large'></AccessAlarmIcon>):<AlarmOffIcon fontSize='large' ></AlarmOffIcon>}
           </ListItemAvatar>
           <ListItemText 
           disableTypography={true}
           className='ListUsername'
           primary={
            moment((alarm.alarmTime.split('G')[0])).format('Do MMM YYYY || h:mm:ss A')
          }
           secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body1"
                color="text.primary"
              >
           {(new Date(alarm.alarmTime)>new Date())?<p><strong>{(moment((alarm.alarmTime.split('G')[0])).calendar())}</strong></p>:<p> <strong>Alarm Reached 😴</strong></p>}

             
              </Typography>
             
            </React.Fragment>
          }
          />
      </ListItem>
    
      <Divider variant="inset" component="li" />
                 
                  </>

                )
              })
          }
    </List>
    // , <Alarm/>    
    ):
    (
      
      <List sx={{ width: '100%', maxWidth: 1520, bgcolor: 'background.paper' }}>
 
      <ListItem alignItems="flex-start" style={{cursor:"pointer"}}>
           <ListItemAvatar>
           <AccessAlarmIcon fontSize='large'></AccessAlarmIcon>
           </ListItemAvatar>
           <ListItemText
             disableTypography={true}
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
              <p><strong>New Alarm</strong> </p>
              </Typography>
             
            </React.Fragment>
          }
          onClick={()=>setopenAlarmPopup(true)}
          
          />
      </ListItem>
      </List>

)
}


<div className='alert' style={{ boxShadow: "0 0 10px 5px rgb(55 47 51 / 56%)"}}>
       {alert?(
         setTimeout(() => {
          setAlert(false)
         }, 4000) ,
        // <Alert icon={<CheckIcon fontSize="inherit" />}  severity={notification}>{alertMsg}</Alert>
        <Alert severity={notification} style={{}}>
        <AlertTitle>{alartTitle}</AlertTitle>
        {alertMsg} — <strong>check it out!</strong>
      </Alert>
      // <AlartMessage/>
      ):null}
      </div>

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
    (<div className='alert'>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
     
        <MobileDateTimePicker
          open={openAlarmPopup}
          onAccept={e=>{handleDateTime(value)}}
          onClose={e=>{setopenAlarmPopup(false)}}
          // closeOnSelect={false}
          disablePast={true}
          openTo={'day' || 'hours' || 'seconds' || 'minutes' || 'month' || 'year' }
          label="Set Alarm"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          renderInput={(params) => <TextField  {...params} />}
        />
      
        </LocalizationProvider>
        </div>
        )}
      </div>
  )
}

export default Home

