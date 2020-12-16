import React from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.css'
import Chat from './pages/Chat'

function App() {
  return (
    <Switch>
      <Route exact path='/' component={Chat} />
      <Route exact path='/chat' component={Chat} />
    </Switch>
  )
}

export default App
