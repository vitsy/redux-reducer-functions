import  { combineReducers } from '../redux-reducer-functions'
import {selectReddit} from './reducerFuncs'
import *  as  postsByReddit from './reducerFuncs'


const rootReducer = combineReducers({
  selectedReddit:{ selectReddit, other: (state = 'reactjs', action) => state},
  postsByReddit
})

export default rootReducer
