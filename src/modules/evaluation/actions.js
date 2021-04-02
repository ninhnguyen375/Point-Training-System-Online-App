import { createAction } from '@reduxjs/toolkit'
import { MODULE_NAME } from './model'

export const addPointTrainingGroup = createAction(
  `${MODULE_NAME}_ADD_POINT_TRAINING_GROUP`,
)
