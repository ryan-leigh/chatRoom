import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { currentPage } from '../client.js';

const Login = () => {
  console.log('login page')
  useReactiveVar(currentPage);
  return (
    <div>
      <div>{currentPage()}</div>
      <button onClick={() => {currentPage('room')}} />
    </div>
  )
}

export default Login;
