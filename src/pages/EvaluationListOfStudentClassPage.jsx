import React from 'react'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import EvaluationListOfStudentClass from '../modules/evaluation/components/EvaluationListOfStudentClass'

const EvaluationListOfStudentClassPage = () => (
  <MainLayout>
    <CustomBreadcrumb
      items={[
        {
          url: `${window.location.pathname}`,
          title: 'Danh sách phiếu điểm rèn luyện của lớp',
          icon: 'fas fa-copy',
        },
      ]}
    />
    <EvaluationListOfStudentClass />
  </MainLayout>
)

export default EvaluationListOfStudentClassPage
