//import css from './style.css'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import { ApolloProvider } from '@apollo/client';
import { client } from './client.js'

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('app')
);
