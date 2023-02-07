import React from 'react';
import Message from './Message.jsx';

const MessagesList = ({ messages }) => {
  console.log(messages.data);
  return (
    <div>
      {messages.data.room.messages.map((message) => (
        <Message message={message} key={message.id}/>
      ))}
    </div>
  )
};

export default MessagesList;
