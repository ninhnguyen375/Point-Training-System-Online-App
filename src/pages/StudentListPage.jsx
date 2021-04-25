import React from 'react'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import StudentList from '../modules/user/components/StudentList'

const StudentListPage = () => (
  <MainLayout>
    <CustomBreadcrumb
      items={[
        {
          url: '/dashboard',
          title: 'Bảng Điều Khiển',
          icon: 'fas fa-home',
        },
        {
          url: '/student',
          title: 'Danh sách sinh viên',
          icon: 'fas fa-user-graduate',
        },
      ]}
    />
    <StudentList />
  </MainLayout>
)

export default StudentListPage
