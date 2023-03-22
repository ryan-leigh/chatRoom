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
  const [numberOfFetches, setNumberOfFetches] = useState(1);


  // Queries & Mutations
  const roomQuery = useQuery(GET_ROOM, {fetchPolicy: 'network-only', variables: { id: roomId, offset: 0 }});

  // Elements
  if (roomQuery.loading) {
    console.log('loading...')
    return (
      <div>loading...</div>
    )
  } else if (roomQuery.error) {
    <div>We had trouble accessing the room</div>
  } else {
    return (
      <div>
        <h1>{roomQuery.data.room.name}</h1>
        <MessagesList roomId={roomId} roomQuery={roomQuery} subscribeToNewMessages={() => roomQuery.subscribeToMore({
          document: MESSAGES_SUBSCRIPTION,
          variables: { roomId },
          updateQuery: (prev, { subscriptionData }) => {
            console.log(subscriptionData);
            if (!subscriptionData.data) return prev;
            const newMessage = {
              id: subscriptionData.data.newMessage.id,
              body: subscriptionData.data.newMessage.body,
              time_created: subscriptionData.data.newMessage.time_created,
              author: {
                id: subscriptionData.data.newMessage.author.id,
                name: subscriptionData.data.newMessage.author.name,
                updated_at: subscriptionData.data.newMessage.author.updated_at
              }
            }
            return Object.assign({}, prev, {
              room: {
                id: prev.room.id,
                name: prev.room.name,
                messages: [...prev.room.messages, newMessage]
              }
            })
          },
          onError: (err) => {
            console.log('Subscription error');
            console.log(err);
          }
        })}/>
        <button onClick={() => {
          roomQuery.fetchMore({
            variables: {
              roomId,
              offset: numberOfFetches
            }
          });
          setNumberOfFetches(numberOfFetches + 1);
        }}>Get more messages</button>
        <SubmitNewMessage roomId={roomId} />
      </div>
    )
  }
}

export default Room;