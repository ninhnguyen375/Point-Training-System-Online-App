import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import { MODULE_NAME as MODULE_USER, ROLE } from '../modules/user/model'
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
import EvaluationListOfStudentPage from '../pages/EvaluationListOfStudentPage'
import EvaluationListOfStudentClassPage from '../pages/EvaluationListOfStudentClassPage'
import ManagerListPage from '../pages/ManagerListPage'
import EmployeeListPage from '../pages/EmployeeListPage'
import DeputyDeanListPage from '../pages/DeputyDeanListPage'
import LecturerListPage from '../pages/LecturerListPage'
import PointTrainingGroupPage from '../pages/PointTrainingGroupPage'
import FirstLogin from '../pages/FirstLogin'

const Routes = () => {
  const profile = useSelector((state) => state[MODULE_USER].profile)

  if (profile && profile.roleName === ROLE.student && !profile.isMonitor) {
    return (
      <Switch>
        <Route exact path="/">
          <Redirect to="/make-evaluation" />
        </Route>

        <Route
          exact
          path="/evaluation-list-of-student"
          component={EvaluationListOfStudentPage}
        />

        <Route exact path="/make-evaluation" component={MakeEvaluationPage} />

        <Route
          exact
          path="/evaluation-list-of-class"
          component={EvaluationListOfStudentClassPage}
        />

        <Route exact path="*" component={NotFound} />
      </Switch>
    )
  }

  if (profile && profile.isMonitor) {
    return (
      <Switch>
        <Route exact path="/">
          <Redirect to="/make-evaluation" />
        </Route>

        <Route
          exact
          path="/evaluation-list-of-student"
          component={EvaluationListOfStudentPage}
        />

        <Route exact path="/make-evaluation" component={MakeEvaluationPage} />

        <Route exact path="/evaluation" component={EvaluationListPage} />

        <Route
          exact
          path="/evaluation/confirm"
          component={ConfirmEvaluationPage}
        />

        <Route exact path="*" component={NotFound} />
      </Switch>
    )
  }

  if (profile && profile.roleName === ROLE.lecturer) {
    return (
      <Switch>
        <Route exact path="/">
          <Redirect to="/evaluation" />
        </Route>

        <Route exact path="/evaluation" component={EvaluationListPage} />

        <Route
          exact
          path="/evaluation/confirm"
          component={ConfirmEvaluationPage}
        />

        <Route exact path="*" component={NotFound} />
      </Switch>
    )
  }

  if (profile && profile.roleName === ROLE.deputydean) {
    return (
      <Switch>
        <Route exact path="/">
          <Redirect to="/evaluation" />
        </Route>

        <Route exact path="/evaluation" component={EvaluationListPage} />

        <Route
          exact
          path="/evaluation/confirm"
          component={ConfirmEvaluationPage}
        />

        <Route exact path="*" component={NotFound} />
      </Switch>
    )
  }

  if (profile && profile.roleName === ROLE.employee) {
    return (
      <Switch>
        <Route exact path="/">
          <Redirect to="/dashboard" />
        </Route>

        <Route exact path="/dashboard" component={Dashboard} />

        <Route
          exact
          path="/evaluation/create"
          component={CreateEvaluationPage}
        />

        <Route
          exact
          path="/evaluation-batch"
          component={EvaluationBatchListPage}
        />

        <Route exact path="/evaluation" component={EvaluationListPage} />

        <Route
          exact
          path="/evaluation/confirm"
          component={ConfirmEvaluationPage}
        />

        <Route
          exact
          path="/evaluation-batch/detail"
          component={EvaluationBatchPage}
        />

        <Route exact path="/student-class" component={StudentClassListPage} />

        <Route exact path="/student" component={StudentListPage} />

        <Route exact path="/lecturer" component={LecturerListPage} />

        <Route
          exact
          path="/point-training-group"
          component={PointTrainingGroupPage}
        />

        <Route
          exact
          path="/student-class/import"
          component={ImportStudentClassPage}
        />

        <Route exact path="/student/import" component={ImportStudentPage} />

        <Route exact path="*" component={NotFound} />
      </Switch>
    )
  }

  if (profile && profile.roleName === ROLE.manager) {
    return (
      <Switch>
        <Route exact path="/">
          <Redirect to="/manager" />
        </Route>

        <Route exact path="/manager" component={ManagerListPage} />

        <Route exact path="/employee" component={EmployeeListPage} />

        <Route exact path="/deputydean" component={DeputyDeanListPage} />

        <Route exact path="*" component={NotFound} />
      </Switch>
    )
  }

  return (
    <Switch>
      <Route exact path="/first-login" component={FirstLogin} />
      <Route exact path="*" component={Login} />
    </Switch>
  )
}

export default Routes
