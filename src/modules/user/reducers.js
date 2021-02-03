import { createReducer, current } from '@reduxjs/toolkit'
import * as actions from './actions'

const initialState = {
  user: null,
}

export default createReducer(initialState, {
  [actions.login]: (state, action) => {
    console.log('~ state, action', current(state), action)
    return initialState
  },
})
