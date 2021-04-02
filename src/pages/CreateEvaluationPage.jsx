import React from 'react'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import CreateEvaluationForm from '../modules/evaluation/components/CreateEvaluationForm'

const CreateEvaluationPage = () => (
  <MainLayout>
    <CustomBreadcrumb
      items={[
        {
          url: '/dashboard',
          title: 'Bảng Điều Khiển',
          icon: 'fas fa-home',
        },
        {
          url: '/evaluation/create',
          title: 'Bắt đầu đợt đánh giá rèn luyện',
          icon: '',
        },
      ]}
    />
    <CreateEvaluationForm />
  </MainLayout>
)

export default CreateEvaluationPage
