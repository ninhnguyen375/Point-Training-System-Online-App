import { createReducer, current } from '@reduxjs/toolkit'
import { clearAll } from '../../common/actions'
import * as actions from './actions'

const initialState = {
  profile: null,
}

export default createReducer(initialState, {
  [clearAll]: () => (initialState),
  [actions.login]: (state, action) => ({ ...current(state), profile: action.payload }),
})
