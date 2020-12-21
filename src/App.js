import React from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Chat from './pages/Chat'

function App() {
  return (
    <Switch>
      <Route exact path='/' component={Login} />
      <Route exact path='/chat' component={Chat} />
    </Switch>
  )
}

export default App
