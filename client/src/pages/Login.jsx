import React from 'react';
const { useState, useEffect } = React;
import { useReactiveVar, useMutation } from '@apollo/client';
import { currentPage, currentUser, CREATE_USER } from '../client.js';

const Login = () => {
  console.log('login page')
  // State
  useReactiveVar(currentPage);
  const [username, setUsername] = useState('');

  // Queries & Mutations
  const [createUser, createUserResult] = useMutation(CREATE_USER);

  // Handlers
  const handleUsernameSubmit = () => {
    const currentTime = Math.floor(Date.now()/1000);
    createUser({
      variables: {
        username,
        updatedAt: currentTime
      }
    });
  }

  useEffect(() => {
    if (createUserResult.data?.createUser?.success) {
      currentUser(createUserResult.data.createUser.newUser);
      currentPage('room');
    }
  }, [createUserResult])

  return (
    <div>
      <div>
        <span>Username: </span>
        <input type="text" value={username} onChange={(e) => {setUsername(e.target.value)}} />
      </div>
      <button onClick={handleUsernameSubmit}>Enter</button>
      {createUserResult.error &&
        <div>An error occurred. Please try again later.</div>
      }
      {createUserResult.data?.createUser?.uniqueIssue &&
        <div>{createUserResult.data?.createUser?.message}</div>
      }
    </div>
  )
}

export default Login;
