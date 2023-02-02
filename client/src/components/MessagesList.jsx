import React from 'react';
import Message from './Message.jsx';

const MessagesList = ({ messages }) => {
  return (
    <div>
      {messages.map((message) => (
        <Message message={message} />
      ))}
    </div>
  )
};

export default MessagesList;
