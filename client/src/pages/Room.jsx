import React from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { currentPage, currentUser, GET_ROOM_MESSAGES } from '../client';
import MessagesList from '../components/MessagesList.jsx';

const Room = ({ roomId }) => {
  console.log('room page')

  const { loading, error, data } = useQuery(GET_ROOM_MESSAGES);
  useReactiveVar(currentPage);

  return (
    <div>
      <div>Title</div>
      <MessagesList messages={messages} />
    </div>
  )
}

export default Room;