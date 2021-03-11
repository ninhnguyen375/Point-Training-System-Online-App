import React from 'react'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import EvaluationTicket from '../modules/evaluation/components/EvaluationTicket'

const MakeEvaluationPage = () => (
  <MainLayout>
    <CustomBreadcrumb
      items={[
        {
          url: '/dashboard',
          title: 'Bảng Điều Khiển',
          icon: 'fas fa-home',
        },
        {
          url: '/make-evaluation',
          title: 'Tự đánh giá rèn luyện',
          icon: '',
        },
      ]}
    />
    <EvaluationTicket />
  </MainLayout>

)

export default MakeEvaluationPage
