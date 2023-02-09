import React from 'react';
const { useState } = React;
import { useMutation, useReactiveVar } from '@apollo/client';
import { currentUser, CREATE_MESSAGE } from '../client.js';


const NewMessage = ({ roomId }) => {
  // State
  useReactiveVar(currentUser);
  console.log(currentUser());
  const [newMessageText, setNewMessageText] = useState('');

  // Queries & Mutations
  const [createMessage, createMessageResult] = useMutation(CREATE_MESSAGE);

  // Handlers
  const handleMessageSubmit = () => {
    createMessage({
      variables: {
        userId: currentUser().id,
        roomId: roomId,
        body: newMessageText,
        timeCreated: Math.floor(Date.now()/1000)
      }
    })
  }

  // Elements
  return (
    <div>
      <input type="text" value={newMessageText} onChange={(e) => {setNewMessageText(e.target.value)}} />
      <button onClick={handleMessageSubmit}>Submit</button>
    </div>
  )
}

export default NewMessage;
