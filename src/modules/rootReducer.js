import { combineReducers } from '@reduxjs/toolkit'
import { MODULE_NAME as moduleUser } from './user/model'
import { MODULE_NAME as moduleEvaluation } from './evaluation/model'

import userReducers from './user/reducers'
import commonReducers from '../common/reducers'
import evaluationReducers from './evaluation/reducers'

export default combineReducers({
  common: commonReducers,
  [moduleUser]: userReducers,
  [moduleEvaluation]: evaluationReducers,
})
