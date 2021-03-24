import React from 'react'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import EvaluationBatchList from '../modules/evaluation/components/EvaluationBatchList'

const EvaluationBatchListPage = () => (
  <MainLayout>
    <CustomBreadcrumb items={[
      {
        url: '/dashboard',
        title: 'Bảng Điều Khiển',
        icon: 'fas fa-home',
      },
      {
        url: '/evaluation/created',
        title: 'Đợt đánh giá rèn luyện đã tạo',
        icon: '',
      },
    ]}
    />
    <EvaluationBatchList />
  </MainLayout>
)

export default EvaluationBatchListPage
