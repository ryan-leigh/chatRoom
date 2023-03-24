import React from 'react';

const RoomMessagesLoader = ({ showLoader }) => {
  if (showLoader) {
    return (
      <div style={{height: "20px"}}>Loading...</div>
    )
  } else {
    return (
      <div style={{height: "20px"}}></div>
    )
  }
}

export default RoomMessagesLoader;
