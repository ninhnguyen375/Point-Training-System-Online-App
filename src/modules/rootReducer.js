import { combineReducers } from '@reduxjs/toolkit'
import { MODULE_NAME as moduleUser } from './user/model'
import userReducers from './user/reducers'

export default combineReducers({
  [moduleUser]: userReducers,
})
