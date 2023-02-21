import React from 'react';
const { useState } = React;
import { useQuery, useSubscription, useReactiveVar } from '@apollo/client';
import { currentPage, currentUser, GET_ROOM, MESSAGES_SUBSCRIPTION } from '../client';
import MessagesList from '../components/MessagesList.jsx';
import SubmitNewMessage from '../components/SubmitNewMessage.jsx';

const Room = ({ roomId }) => {
  console.log('room page')
  // State
  useReactiveVar(currentPage);
  useReactiveVar(currentUser);
  const [newMessageCount, setNewMessageCount] = useState(0);

  // Queries & Mutations
  const roomQuery = useQuery(GET_ROOM, {variables: { id: roomId }});
  const messagesSubscription = useSubscription(MESSAGES_SUBSCRIPTION, {variables: { id: roomId }});

  console.log(newMessageCount);

  // Elements
  if (roomQuery.loading) {
    return (
      <div>loading...</div>
    )
  } else if (roomQuery.error) {
    <div>We had trouble accessing the room</div>
  } else {
    return (
      <div>
        {/*Room name*/}
        <h1>{roomQuery.data.room.name}</h1>
        <MessagesList roomId={roomId} newMessageCount={newMessageCount} roomQuery={roomQuery} subscribeToNewMessages={() => roomQuery.subscribeToMore({
          document: MESSAGES_SUBSCRIPTION,
          variables: { roomId },
          updateQuery: (prev, { subscriptionData }) => {
            setNewMessageCount(newMessageCount + 1);
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
        <SubmitNewMessage roomId={roomId} />
      </div>
    )
  }
}

export default Room;