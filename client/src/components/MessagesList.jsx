import React from 'react';
const { useState, useEffect } = React;
import { useLazyQuery } from '@apollo/client';
// import { GET_MORE_MESSAGES } from '../client';
import Message from './Message.jsx';

const MessagesList = ({ roomId, roomQuery, subscribeToNewMessages }) => {
  // State
  // const [messages, setMessages] = useState(roomQuery.data.room.messages);
  //const [messages, setMessages] = useState([]);
  //console.log(roomQuery.data.room.messages)
  //const [numberOfFetches, setNumberOfFetches] = useState(1);

  // Queries & Mutations
  //const [loadMoreMessages, getMoreMessagesResult] = useLazyQuery(GET_MORE_MESSAGES);
  //console.log('More messages: ');
  //console.log(getMoreMessagesResult);
  // Effects
  // useEffect(() => {
  //   if (roomQuery.error) {
  //     console.log('err');
  //   }
  //   if (roomQuery.data?.room.messages) {
  //     setMessages(messages.slice().concat(roomQuery.data.room.messages))
  //   }
  // }, [roomQuery]);

  // useEffect(() => {
  //   if (getMoreMessagesResult.error) {
  //     console.log('err');
  //   }
  //   if (getMoreMessagesResult.data?.messages) {
  //     //console.log(getMoreMessagesResult.data.messages)
  //     setMessages(messages.slice().concat(getMoreMessagesResult.data.messages));
  //     setNumberOfFetches(numberOfFetches + 1);
  //   }
  // },[getMoreMessagesResult]);

  useEffect(() => subscribeToNewMessages(), []);

  // Elements
  return (
    <div>
      <div>
        {roomQuery.data.room.messages.map((message) => (
          <Message message={message} key={message.id}/>
        ))}
      </div>
      {/* <button onClick={() => loadMoreMessages({variables: {
          id: roomId,
          offset: (numberOfFetches * 20) + newMessageCount
        }}
      )}>Get more messages</button> */}
    </div>
  )
};

export default MessagesList;
