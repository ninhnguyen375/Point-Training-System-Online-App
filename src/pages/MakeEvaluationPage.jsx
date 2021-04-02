import React from 'react'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import EvaluationTicket from '../modules/evaluation/components/EvaluationTicket'

const MakeEvaluationPage = () => (
  <MainLayout>
    <CustomBreadcrumb
      items={[
        {
          url: '/make-evaluation',
          title: 'Đánh Giá Rèn Luyện',
          icon: 'fas fa-list-alt',
        },
      ]}
    />
    <EvaluationTicket />
  </MainLayout>
)

export default MakeEvaluationPage
