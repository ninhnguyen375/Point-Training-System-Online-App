import React from 'react'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import ImportStudentClass from '../modules/student-class/components/ImportStudentClass'

const ImportStudentClassPage = () => (
  <MainLayout>
    <CustomBreadcrumb
      items={[
        {
          url: '/dashboard',
          title: 'Bảng Điều Khiển',
          icon: 'fas fa-home',
        },
        {
          url: '/student-class',
          title: 'Danh sách lớp',
          icon: 'fas fa-suitcase',
        },
        {
          url: '/student-class/import',
          title: 'Nhập Lớp',
          icon: 'fas fa-file-import',
        },
      ]}
    />
    <ImportStudentClass />
  </MainLayout>
)

export default ImportStudentClassPage
