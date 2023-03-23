import React from 'react';
const { useState } = React;
import { useQuery, useSubscription, useReactiveVar } from '@apollo/client';
import { client, currentPage, GET_ROOM, GET_MESSAGES, MESSAGES_SUBSCRIPTION, READ_MESSAGES } from '../client';
import MessagesList from '../components/MessagesList.jsx';
import SubmitNewMessage from '../components/SubmitNewMessage.jsx';

const Room = ({ roomId }) => {
  // State
  useReactiveVar(currentPage);

  // Queries & Mutations
  const roomQuery = useQuery(GET_ROOM, {variables: { id: roomId, offset: 0}});
  const messagesQuery = useQuery(GET_MESSAGES, {fetchPolicy: 'network-only', variables: {id: roomId, offset: 0}});

  // Elements
  if (roomQuery.loading || messagesQuery.loading) {
    return (
      <div>loading...</div>
    )
  } else if (roomQuery.error || messagesQuery.error) {
    <div>We had trouble accessing the room</div>
  } else {
    return (
      <div>
        <h1>{roomQuery.data.room.name}</h1>
        <MessagesList roomId={roomId} messagesQuery={messagesQuery} subscribeToNewMessages={() => messagesQuery.subscribeToMore({
          document: MESSAGES_SUBSCRIPTION,
          variables: { roomId },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            // *** Try replacing this with just subscriptionData.data.newMessage ***
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
            const returnObj = Object.assign({}, prev, {
              getMessages: [newMessage]
            })
            return returnObj;
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
}

export default Room;