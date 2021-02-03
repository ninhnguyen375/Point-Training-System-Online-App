/* eslint-disable react/jsx-filename-extension */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Root from './common/Root'
import reportWebVitals from './reportWebVitals'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import 'antd/dist/antd.less'
import './assets/styles/index.less'
import './assets/styles/custom.less'
import { store, persistor } from './common/store'

import './assets/styles/Home.scss'
import './assets/styles/Login.scss'

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Root />
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
