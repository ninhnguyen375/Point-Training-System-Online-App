import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'

const Routes = () => {
  const user = false

  if (user) {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="*" component={NotFound} />
      </Switch>
    )
  }

  return (
    <Switch>
      <Route exact path="*" component={Login} />
    </Switch>
  )
}

export default Routes
