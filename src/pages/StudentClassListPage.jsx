import React from 'react'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import StudentClassList from '../modules/student-class/components/StudentClassList'

const StudentClassListPage = () => (
  <MainLayout>
    <CustomBreadcrumb
      items={[
        {
          url: '/student',
          title: 'Danh sách lớp',
          icon: 'fas fa-suitcase',
        },
      ]}
    />
    <StudentClassList />
  </MainLayout>
)

export default StudentClassListPage
