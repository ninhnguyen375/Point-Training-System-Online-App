import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import viVN from 'antd/lib/locale/vi_VN'
import {ConfigProvider} from 'antd'
import Routes from './Routes'
import PageLoading from './components/widgets/PageLoading'

const Root = () => (
  <ConfigProvider locale={viVN}>
    <Router>
      <Routes />
      <PageLoading ref={(ref) => { window.PageLoading = ref }} />
    </Router>
  </ConfigProvider>
)

export default Root
