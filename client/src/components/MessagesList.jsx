import React from 'react';
const { useState, useEffect } = React;
import { useLazyQuery } from '@apollo/client';
import RoomMessagesLoader from './RoomMessagesLoader.jsx';
import Message from './Message.jsx';

const MessagesList = ({ roomId, messagesQuery, subscribeToNewMessages }) => {
  // State
  const [showLoader, setShowLoader] = useState(false);

  // Effects
  useEffect(() => subscribeToNewMessages(), []);

  // Elements
  if (messagesQuery.loading) {
    return (
      <div>Loading...</div>
    )
  } else if (messagesQuery.error) {
    return (
      <div>We had an issue getting messages</div>
    )
  } else {
    return (
      <div>
        <div className="MessagesList">
          <RoomMessagesLoader showLoader={showLoader} />
          {messagesQuery.data.getMessages.slice().sort((a, b) => a.time_created - b.time_created).map((message) => (
            <Message message={message} key={message.id}/>
          ))}
        </div>
      </div>
    )
  }
};

export default MessagesList;
