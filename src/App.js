import React from 'react'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css';
import {Routes,Route} from 'react-router-dom'
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';



function App() {
  return (
    <Routes>
    <Route exact path="/" element={ <Login/>}> </Route>
    <Route exact path="/register" element={ <Register/>}> </Route>

  </Routes>
  );
}

export default App;
