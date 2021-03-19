import {createReducer, current} from '@reduxjs/toolkit'
import {clearAll} from '../../common/actions'
import * as actions from './actions'

const initialState = {
  studentsInClass: null,
}

const map = {
  [clearAll]: () => (initialState),
  [actions.addStudentInClass]: (state, action) => ({...current(state), studentsInClass: action.payload}),
}

export default createReducer(initialState, map)