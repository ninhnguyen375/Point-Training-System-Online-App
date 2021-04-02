import { Card } from 'antd'
import React from 'react'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'

const Home = () => (
  <MainLayout>
    <CustomBreadcrumb
      items={[
        {
          url: '/home',
          title: 'Trang Chủ',
          icon: 'fas fa-home',
        },
      ]}
    />
    <Card>sdfsf</Card>
  </MainLayout>
)

export default Home
