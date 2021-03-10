import { combineReducers } from '@reduxjs/toolkit'
import { MODULE_NAME as moduleUser } from './user/model'
import userReducers from './user/reducers'
import commonReducers from '../common/reducers'

export default combineReducers({
  common: commonReducers,
  [moduleUser]: userReducers,
})
