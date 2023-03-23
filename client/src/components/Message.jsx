import React from 'react';

const Message = ({ message }) => {
  return (
    <div>{`${message.author.name}: '${message.body}'`}</div>
  )
}

export default Message;
