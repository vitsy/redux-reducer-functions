import  { combineReducers } from './redux-reducer-functions'

const reducer1 ={
  funcAdd(state = defState, action){
    return {...state, ...action}
  }
  common(state = defState, action){
    return {...state, ...action}
  }
  other(state = defState, action){
}

const reducer2 ={
  funcAdd(state = {}, action){
    return {...state, ...action}
  }
}

const reducer = combineReducers({
  reducer1,
  reducer2
})


let rootReducer = combineReducers({ counter, todo })