import React from 'react';
const { useState } = React;
import { useReactiveVar } from '@apollo/client';
import { currentPage, currentUser } from '../client.js';

const Login = () => {
  console.log('login page')
  useReactiveVar(currentPage);
  const [ username, setUsername ] = useState('');
  const handleUsernameSubmit = () => {
    currentUser(username);
    currentPage('room');
  }

  return (
    <div>
      <input type="text" value={username} onChange={(e) => {setUsername(e.target.value)}} />
      <button onClick={() => handleUsernameSubmit()}>Enter</button>
    </div>
  )
}

export default Login;
