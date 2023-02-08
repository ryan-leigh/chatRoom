import React from 'react';
import { useQuery, useSubscription, useReactiveVar } from '@apollo/client';
import { currentPage, currentUser, GET_ROOM, MESSAGES_SUBSCRIPTION } from '../client';
import MessagesList from '../components/MessagesList.jsx';

const Room = ({ roomId }) => {
  console.log('room page')
  const roomQuery = useQuery(GET_ROOM, {
    variables: { roomId }
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
        <MessagesList messages={roomQuery} subscribeToNewMessages={() => roomQuery.subscribeToMore({
          document: MESSAGES_SUBSCRIPTION,
          variables: { roomId },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const newMessage = {
              id: subscriptionData.data.newMessage.id,
              body: subscriptionData.data.newMessage.body,
              time_created: subscriptionData.data.newMessage.time_created,
              author: {
                id: subscriptionData.data.newMessage.author_id,
                name: subscriptionData.data.newMessage.author_name,
              }
            }
            return Object.assign({}, prev, {
              room: {
                messages: [...prev.room.messages, newMessage]
              }
            })
          },
          onError: (err) => console.log(err)
        })}/>
      </div>
    )
  }
}

export default Room;