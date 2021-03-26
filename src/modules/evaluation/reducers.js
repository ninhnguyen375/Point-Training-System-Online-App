import {createReducer, current} from '@reduxjs/toolkit'
import {clearAll} from '../../common/actions'
import * as actions from './actions'

const initialState = {
  pointTrainingGroup: [],
}

const map = {
  [clearAll]: () => initialState,
  [actions.addPointTrainingGroup]: (state, action) => ({
    ...current(state),
    pointTrainingGroup: action.payload,
  }),
}

export default createReducer(initialState, map)