import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {useSelector} from 'react-redux'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import {MODULE_NAME as MODULE_USER, ROLE} from '../modules/user/model'
import Dashboard from '../pages/Dashboard'
import MakeEvaluationPage from '../pages/MakeEvaluationPage'
import CreateEvaluationPage from '../pages/CreateEvaluationPage'
import ConfirmEvaluationPage from '../pages/ConfirmEvaluationPage'
import EvaluationListPage from '../pages/EvaluationListPage'
import EvaluationBatchListPage from '../pages/EvaluationBatchListPage'
import EvaluationBatchPage from '../pages/EvaluationBatchPage'
import StudentListPage from '../pages/StudentListPage'
import ImportStudentPage from '../pages/ImportStudentPage'
import StudentClassListPage from '../pages/StudentClassListPage'
import ImportStudentClassPage from '../pages/ImportStudentClassPage'
import Home from '../pages/Home'
import ClassStatistic from '../pages/ClassStatistic'

const Routes = () => {
  const profile = useSelector(state => state[MODULE_USER].profile)

  if (profile && profile.roleName === ROLE.student) {
    return (
      <Switch>
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/make-evaluation" component={MakeEvaluationPage} />
        <Route exact path="/evaluation" component={EvaluationListPage} />
        <Route exact path="/evaluation/confirm" component={ConfirmEvaluationPage} />
        <Route exact path="/class-statistic" component={ClassStatistic} />

        <Route exact path="/">
          <Redirect to="/make-evaluation" />
        </Route>
        <Route exact path="*" component={NotFound} />
      </Switch>
    )
  }

  if (profile && profile.roleName === ROLE.lecturer) {
    return (
      <Switch>
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/evaluation" component={EvaluationListPage} />
        <Route exact path="/evaluation/confirm" component={ConfirmEvaluationPage} />

        <Route exact path="/">
          <Redirect to="/evaluation" />
        </Route>
        <Route exact path="*" component={NotFound} />
      </Switch>
    )
  }

  if (profile && profile.roleName === ROLE.employee) {
    return (
      <Switch>
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/evaluation/create" component={CreateEvaluationPage} />
        <Route exact path="/evaluation-batch" component={EvaluationBatchListPage} />
        <Route exact path="/evaluation-batch/detail" component={EvaluationBatchPage} />
        <Route exact path="/student" component={StudentListPage} />
        <Route exact path="/student/import" component={ImportStudentPage} />
        <Route exact path="/student-class" component={StudentClassListPage} />
        <Route exact path="/student-class/import" component={ImportStudentClassPage} />
        <Route exact path="/class-statistic" component={ClassStatistic} />

        <Route exact path="/">
          <Redirect to="/evaluation-batch" />
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
