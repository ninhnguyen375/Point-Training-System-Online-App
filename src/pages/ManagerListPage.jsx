import React from 'react'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import ManagerList from '../modules/user/components/ManagerList'

const ManagerListPage = () => (
  <MainLayout>
    <CustomBreadcrumb
      items={[
        {
          url: '/manager',
          title: 'Danh Sách Quản Lý',
          icon: 'fas fa-users',
        },
      ]}
    />
    <ManagerList />
  </MainLayout>
)

export default ManagerListPage
