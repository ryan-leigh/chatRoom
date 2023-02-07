import React from 'react';
import { useQuery, useSubscription, useReactiveVar } from '@apollo/client';
import { currentPage, currentUser, GET_ROOM, MESSAGES_SUBSCRIPTION } from '../client';
import MessagesList from '../components/MessagesList.jsx';

const Room = ({ roomId }) => {
  console.log('room page')
  console.log(GET_ROOM)

  const roomQuery = useQuery(GET_ROOM, {
    variables: {roomId: 1}
  });
  useReactiveVar(currentPage);

  const messagesSubscription = useSubscription(MESSAGES_SUBSCRIPTION, { variables: { roomId } })
  console.log(roomQuery.data)
  if (roomQuery.loading) {
    return (
      <div>loading...</div>
    )
  } else {
    return (
      <div>
        {/*Room name*/}
        <div>{roomQuery.data.room.name}</div>
        <MessagesList messages={roomQuery} subscribeToNewMessages={() => messagesQuery.subcribeToMore({
          document: MESSAGES_SUBSCRIPTION,
          variables: { roomId }
        })}/>
      </div>
    )
  }
}

export default Room;