import * as todos from './todos'
import * as visibilityFilter from './visibilityFilter'

import  { combineReducers } from 'redux-reducer-functions'

const todoApp = combineReducers({
  todos,
  visibilityFilter
})

export default todoApp
