import {createReducer, current} from '@reduxjs/toolkit'
import {clearAll} from '../../common/actions'
import * as actions from './actions'

const initialState = {
  profile: null,
}

const map = {
  [clearAll]: () => (initialState),
  [actions.login]: (state, action) => ({...current(state), profile: action.payload}),
}

export default createReducer(initialState, map)
