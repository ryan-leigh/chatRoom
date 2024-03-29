//import css from './style.css'
import React from 'react';
import { MantineProvider } from '@mantine/core';
import { createRoot } from 'react-dom/client';
import App from './components/App.jsx';
import { ApolloProvider } from '@apollo/client';
import { client } from './client.js'

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
  <MantineProvider>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </MantineProvider>
);
