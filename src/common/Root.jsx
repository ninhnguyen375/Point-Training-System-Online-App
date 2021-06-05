import React from 'react'
import { HashRouter } from 'react-router-dom'
import viVN from 'antd/lib/locale/vi_VN'
import { ConfigProvider } from 'antd'
import Routes from './Routes'
import PageLoading from './components/widgets/PageLoading'
import CustomModal from './components/widgets/CustomModal'

const Root = () => (
  <ConfigProvider locale={viVN}>
    <HashRouter>
      <Routes />
    </HashRouter>
    <PageLoading
      ref={(ref) => {
        window.PageLoading = ref
      }}
    />
    <CustomModal
      ref={(ref) => {
        window.Modal = ref
      }}
    />
  </ConfigProvider>
)

export default Root
