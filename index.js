let cached = {}
const options = {
  defaultReducerFunctionName: 'other', //name of the reducer function which used  with standart reduce using  switch/case
  useCache: true,
  strictMode: true,//TO DO call only called reducer functions and skip other. When false need set initial state store
  defaultCommonReducer: (state = {}, action) => state
}
/**
 *
 *  when action type looks like reducerName.methodName will be called reducer with current name and with
 *  function methodName()
 *  when action type looks like [reducerName1,reducerName2].methodName will be called reducers with
 *  current names with functions reducerName1.methodName(), reducerName2.methodName()
 *  when action type not looks like reducerName.methodName will be called defaultMethodName from current reducer
 *
 *
 **/
export function combineReducers(reducers, opts) {
  const {defaultReducerFunctionName, useCache, defaultCommonReducer, strictMode} = {...options, ...opts}
  return (state = {}, action) => {
    const {type, ...payload} = action
    let targetReducers = []
    const [reducerName, method]  = type.split('.')
    if (!options.useCache || !cached[type]) {
      if (reducerName && method) {
        if (/^\[[^\]]*]$/g.test(reducerName)) {
          targetReducers = reducerName.substr(1).slice(0, -1).split(',').map(r => r.trim());
        } else {
          targetReducers = [reducerName];
        }
      }
    }

    let hasChanged = false
    let nextState = {}
    if (useCache && cached[type]) {
      const reducerKeys = Object.keys(cached[type])
      reducerKeys.forEach(key => {
        const actualReducer = cached[type][key]
        const previousStateForKey = state[key]
        const nextStateForKey = actualReducer(previousStateForKey, action)
        if (typeof nextStateForKey === 'undefined') {
          delete cached[type];
          const errorMessage = getUndefinedStateErrorMessage(key, action)
          throw new Error(errorMessage)
        }
        nextState[key] = nextStateForKey
        hasChanged = hasChanged || nextStateForKey !== previousStateForKey
      })
      if (hasChanged) {
        nextState = {...state, ...nextState}
      }
    } else {
      useCache && (cached[type] = {})
      const reducerKeys = Object.keys(reducers)
      reducerKeys.forEach(key => {
        const reducer = reducers[key]
        const previousStateForKey = state[key]
        const isReducerFunction = ~targetReducers.indexOf(key) && reducers[key] && reducers[key][method]
          const actualReducerFunc = reducers[key][isReducerFunction ? method : defaultReducerFunctionName] || defaultCommonReducer
          useCache &&  (strictMode && isReducerFunction || !strictMode) && (cached[type][key] = actualReducerFunc)
          const nextStateForKey = actualReducerFunc(previousStateForKey, action)
          if (typeof nextStateForKey === 'undefined') {
            useCache && (delete cached[type])
            const errorMessage = getUndefinedStateErrorMessage(reducer, action)
            throw new Error(errorMessage)
          }
          nextState[key] = nextStateForKey
          hasChanged = hasChanged || nextStateForKey !== previousStateForKey
      })
    }
    return hasChanged ? nextState : state
  }
}

/* getUndefinedStateErrorMessage copied from redux.combineReducer */
function getUndefinedStateErrorMessage(key, action) {
  const actionType = action && action.type
  const actionName = (actionType && `"${actionType.toString()}"`) || 'an action'

  return (
     `Given action ${actionName}, reducer "${key}" returned undefined. ` +
     `To ignore an action, you must explicitly return the previous state. ` +
     `If you want this reducer to hold no value, you can return null instead of undefined.`
  )
}
