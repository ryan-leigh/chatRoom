import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { currentUser, currentPage } from '../client';

const Room = () => {
  useReactiveVar(currentPage);
  console.log('room page')
  return (
    <div>
      <div>{currentPage()}</div>
      <button onClick={() => {currentPage('login')}}>Login</button>
    </div>
  )
}

export default Room;