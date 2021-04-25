import React from 'react'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import ImportStudent from '../modules/user/components/ImportStudent'

const ImportStudentPage = () => (
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
        {
          url: '/student/import',
          title: 'Nhập sinh viên',
          icon: 'fas fa-file-import',
        },
      ]}
    />
    <ImportStudent />
  </MainLayout>
)

export default ImportStudentPage
