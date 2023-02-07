import React from 'react';
const { useEffect } = React;
import Message from './Message.jsx';

const MessagesList = ({ messages, subscribeToNewMessages }) => {
  useEffect(() => subscribeToNewMessages(), []);
  return (
    <div>
      {messages.data.room.messages.map((message) => (
        <Message message={message} key={message.id}/>
      ))}
    </div>
  )
};

export default MessagesList;
