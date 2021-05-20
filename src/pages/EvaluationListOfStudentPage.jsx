import React from 'react'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import EvaluationListOfStudent from '../modules/evaluation/components/EvaluationListOfStudent'

const EvaluationListOfStudentPage = () => (
  <MainLayout>
    <CustomBreadcrumb
      items={[
        {
          url: `${window.location.pathname}`,
          title: 'Danh sách phiếu điểm rèn luyện',
          icon: 'fas fa-copy',
        },
      ]}
    />
    <EvaluationListOfStudent />
  </MainLayout>
)

export default EvaluationListOfStudentPage
