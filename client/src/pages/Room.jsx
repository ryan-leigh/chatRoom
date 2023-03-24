import React from 'react';
const { useState } = React;
import { useQuery, useSubscription, useReactiveVar } from '@apollo/client';
import { client, currentPage, GET_ROOM, GET_MESSAGES, MESSAGES_SUBSCRIPTION, READ_MESSAGES } from '../client';
import RoomInfo from '../components/RoomInfo.jsx';
import MessagesList from '../components/MessagesList.jsx';
import SubmitNewMessage from '../components/SubmitNewMessage.jsx';

const Room = ({ roomId }) => {
  // State
  useReactiveVar(currentPage);

  // Queries & Mutations
  const roomQuery = useQuery(GET_ROOM, {variables: { id: roomId, offset: 0}});
  const messagesQuery = useQuery(GET_MESSAGES, {fetchPolicy: 'network-only', variables: {id: roomId, offset: 0}});

  // Presentation
  return (
    <div>
      <RoomInfo roomQuery={roomQuery} />
      <MessagesList roomId={roomId} messagesQuery={messagesQuery} subscribeToNewMessages={() => messagesQuery.subscribeToMore({
        document: MESSAGES_SUBSCRIPTION,
        variables: { roomId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          } else {
            return Object.assign({}, prev, {
              getMessages: [subscriptionData.data.newMessage]
            });
          }
        },
        onError: (err) => {
          console.log('Subscription error');
          console.log(err);
        }
      })}/>
      <button onClick={() => {
        const messagesLength = client.readQuery({
          query: READ_MESSAGES,
          variables: {
            id: roomId
          }
        })?.getMessages?.length || 0;
        messagesQuery.fetchMore({
          variables: {
            roomId,
            offset: messagesLength
          }
        });
      }}>Get more messages</button>
      <SubmitNewMessage roomId={roomId} />
    </div>
  )
}

export default Room;