import React from 'react'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import DeputyDeanList from '../modules/user/components/DeputyDeanList'

const DeputyDeanListPage = () => (
  <MainLayout>
    <CustomBreadcrumb
      items={[
        {
          url: '/deputydean',
          title: 'Danh Sách Tài Khoản Phó Khoa',
          icon: 'fas fa-users',
        },
      ]}
    />
    <DeputyDeanList />
  </MainLayout>
)

export default DeputyDeanListPage
