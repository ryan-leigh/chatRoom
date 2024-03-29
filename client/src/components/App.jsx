import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { currentPage } from '../client';
import Login from '../pages/Login.jsx';
import Room from '../pages/Room.jsx'

const App = () => {
  // State
  useReactiveVar(currentPage);

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
          <Room roomId={1} />
        </>
      )
    default:
      return (
        <>
          <Login />
        </>
      )
  }
}

export default App;