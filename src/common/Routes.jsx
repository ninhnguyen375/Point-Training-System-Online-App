import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {useSelector} from 'react-redux'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import {MODULE_NAME as MODULE_USER, ROLE} from '../modules/user/model'
import Dashboard from '../pages/Dashboard'
import MakeEvaluationPage from '../pages/MakeEvaluationPage'
import CreateEvaluationPage from '../pages/CreateEvaluationPage'

const Routes = () => {
  const profile = useSelector(state => state[MODULE_USER].profile)

  if (profile && profile.roleName === ROLE.student) {
    return (
      <Switch>
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/make-evaluation" component={MakeEvaluationPage} />
        <Route exact path="/">
          <Redirect to="/dashboard" />
        </Route>
        <Route exact path="*" component={NotFound} />
      </Switch>
    )
  }

  if (profile && profile.roleName === ROLE.employee) {
    return (
      <Switch>
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/evaluation/create" component={CreateEvaluationPage} />
        <Route exact path="/">
          <Redirect to="/dashboard" />
        </Route>
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
