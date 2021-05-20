import React from 'react'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import EvaluationTicket from '../modules/evaluation/components/EvaluationTicket'

const MakeEvaluationPage = () => {
  let { search } = useLocation()
  search = qs.parse(search)

  return (
    <MainLayout>
      <CustomBreadcrumb
        items={[
          {
            url: '/make-evaluation',
            title: 'Đánh giá điểm rèn luyện',
            icon: 'fas fa-list-alt',
          },
        ]}
      />
      <EvaluationTicket
        semesterIdProp={parseInt(search.semesterId, 10)}
        yearIdProp={parseInt(search.yearId, 10)}
        studentIdProp={parseInt(search.studentId, 10)}
      />
    </MainLayout>
  )
}

export default MakeEvaluationPage
