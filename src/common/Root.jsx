import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import viVN from 'antd/lib/locale/vi_VN'
import {ConfigProvider} from 'antd'
import Routes from './Routes'

const Root = () => (
  <ConfigProvider locale={viVN}>
    <Router>
      <Routes />
    </Router>
  </ConfigProvider>
)

export default Root
