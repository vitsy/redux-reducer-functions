import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import rootSaga from './sagas'
import App from './containers/App'
import configureStore from './store/configureStore'

const store = configureStore()
store.runSaga(rootSaga)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
