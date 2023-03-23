import React from 'react';
const { useState, useEffect } = React;
import { useLazyQuery } from '@apollo/client';
import Message from './Message.jsx';

const MessagesList = ({ roomId, messagesQuery, subscribeToNewMessages }) => {
  // Effects
  useEffect(() => subscribeToNewMessages(), []);

  // Elements
  return (
    <div>
      <div>
        {messagesQuery.data.getMessages.slice().sort((a, b) => a.time_created - b.time_created).map((message) => (
          <Message message={message} key={message.id}/>
        ))}
      </div>
    </div>
  )
};

export default MessagesList;
