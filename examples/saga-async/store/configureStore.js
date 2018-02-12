import {createStore, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import rootReducer from '../reducers'
import sagaMonitor from '../sagaMonitor'

export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware({sagaMonitor})
  const store = createStore(
     rootReducer,
     initialState,
     applyMiddleware(sagaMiddleware, createLogger())
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return {...store, runSaga: sagaMiddleware.run}

}
