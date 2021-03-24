import React from 'react'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import EvaluationBatch from '../modules/evaluation/components/EvaluationBatch'

const EvaluationBatchPage = () => (
  <MainLayout>
    <CustomBreadcrumb items={[
      {
        url: '/dashboard',
        title: 'Bảng Điều Khiển',
        icon: 'fas fa-home',
      },
      {
        url: '/evaluation-batch/detail',
        title: 'Đợt đánh giá rèn luyện đã tạo',
        icon: '',
      },
    ]}
    />
    <EvaluationBatch />
  </MainLayout>
)

export default EvaluationBatchPage
