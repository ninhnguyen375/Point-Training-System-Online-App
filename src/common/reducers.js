import * as actions from './actions'

const { createReducer } = require('@reduxjs/toolkit')

const initialState = {
  layout: {
    siderMenu: {
      selectedKeys: ['dashboard'],
      openKeys: [],
    },
  },
}

const reducerMap = {
  [actions.clearAll]: () => ({ ...initialState }),
  [actions.setSiderMenu]: (state, action) => ({
    ...state,
    layout: {
      ...state.layout,
      siderMenu: action.payload,
    },
  }),
}

export default createReducer(initialState, reducerMap)
