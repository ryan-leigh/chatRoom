import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { currentUserVar } from '../client';

const App = () => {
  const currentUser = useReactiveVar(currentUserVar);
  return (
    <div>Hello</div>
  )
}

export default App;