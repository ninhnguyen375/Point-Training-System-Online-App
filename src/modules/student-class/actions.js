import { createAction } from '@reduxjs/toolkit'
import { MODULE_NAME as MODULE_STUDENT_CLASS } from './model'

export const addStudentsInClass = createAction(
  `${MODULE_STUDENT_CLASS}_ADD_STUDENTS_IN_CLASS`,
)
