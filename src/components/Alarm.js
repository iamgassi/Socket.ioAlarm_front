import React from 'react'
import ListItemIcon from '@mui/material/ListItemIcon';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Avatar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';



function generate(element) {
    return [0, 1, 2].map((value) =>
      React.cloneElement(element, {
        key: value,
      }),
    );
  }
  
  const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));

const Alarm = () => {
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
  
  return (
    <>
             <Grid item xs={12} md={6}>
     <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
       Avatar with text and icon
     </Typography>
     <Demo>
       <List dense={dense}>
         {generate(
           <ListItem
             secondaryAction={
               <IconButton edge="end" aria-label="delete">
                 <DeleteIcon />
               </IconButton>
             }
           >
             <ListItemAvatar>
               <Avatar>
                 <FolderIcon />
               </Avatar>
             </ListItemAvatar>
             <ListItemText
               primary="Single-line item"
               secondary={secondary ? 'Secondary text' : null}
             />
           </ListItem>,
         )}
       </List>
     </Demo>
   </Grid>

    </>
  )
}

export default Alarm
