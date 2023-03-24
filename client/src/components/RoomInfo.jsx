import React from 'react';

const RoomInfo = ({ roomQuery }) => {
  if (roomQuery.loading) {
    return (
      <div>Loading...</div>
    );
  } else if (roomQuery.error) {
    return (
      <div>There was an issue getting the room name</div>
    );
  } else {
    return (
      <div className="roomTitle">
        <p>{roomQuery.data.name}</p>
      </div>
    )
  }
}

export default RoomInfo;