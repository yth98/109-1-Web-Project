import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ApolloClient, InMemoryCache, split, HttpLink, ApolloProvider } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import 'antd/dist/antd.css'

const URL_BASE = process.env.URL_BASE || 'localhost'
const PORT_GQL = process.env.PORT_GQL || 4200
const httpLink = new HttpLink({ uri: `http://${URL_BASE}:${PORT_GQL}/` })
const wsLink = new WebSocketLink({ uri: `ws://${URL_BASE}:${PORT_GQL}/`, options: {reconnect: true} })
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (definition.kind === 'OperationDefinition' && definition.operation === 'subscription')
  },
  wsLink,
  httpLink
)
const client = new ApolloClient({ link, cache: new InMemoryCache().restore({}) })

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
