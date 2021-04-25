import React from 'react'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import LecturerList from '../modules/user/components/LecturerList'

const LecturerListPage = () => (
  <MainLayout>
    <CustomBreadcrumb
      items={[
        {
          url: '/dashboard',
          title: 'Bảng Điều Khiển',
          icon: 'fas fa-home',
        },
        {
          url: '/lecturer',
          title: 'Danh sách giảng viên',
          icon: 'fas fa-user-graduate',
        },
      ]}
    />
    <LecturerList />
  </MainLayout>
)

export default LecturerListPage
