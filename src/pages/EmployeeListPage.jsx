import React from 'react'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import EmployeeList from '../modules/user/components/EmployeeList'

const EmployeeListPage = () => (
  <MainLayout>
    <CustomBreadcrumb
      items={[
        {
          url: '/employee',
          title: 'Danh Sách Nhân Viên',
          icon: 'fas fa-users',
        },
      ]}
    />
    <EmployeeList />
  </MainLayout>
)

export default EmployeeListPage
