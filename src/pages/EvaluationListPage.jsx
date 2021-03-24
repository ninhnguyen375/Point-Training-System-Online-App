import React from 'react'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import EvaluationList from '../modules/evaluation/components/EvaluationList'

const EvaluationListPage = () => (
  <MainLayout>
    <CustomBreadcrumb
      items={[
        {
          url: '/dashboard',
          title: 'Bảng Điều Khiển',
          icon: 'fas fa-home',
        },
        {
          url: '/evaluation',
          title: 'Danh sách phiếu điểm rèn luyện',
          icon: '',
        },
      ]}
    />
    <EvaluationList />
  </MainLayout>

)

export default EvaluationListPage
