import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { currentUser, currentPage } from '../client';
import Login from '../pages/Login.jsx';
import Room from '../pages/Room.jsx'

const App = () => {
  useReactiveVar(currentPage);
  useReactiveVar(currentUser);
  console.log('App page')

  // Pages: 'login', 'room'
  switch (currentPage()) {
    case 'login':
      return (
        <>
          <Login />
        </>
      )
    case 'room':
      return (
        <>
          <Room />
        </>
      )
    default:
      return (
        <div>
          <Login />
        </div>
      )
  }
}

export default App;