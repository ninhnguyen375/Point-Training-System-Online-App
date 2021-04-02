import { createAction } from '@reduxjs/toolkit'
import { MODULE_NAME } from './model'

export const login = createAction(`${MODULE_NAME}_LOGIN`)
