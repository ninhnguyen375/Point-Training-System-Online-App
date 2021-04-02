import { Card } from 'antd'
import qs from 'query-string'
import React from 'react'
import { useLocation } from 'react-router-dom'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import EvaluationTicket from '../modules/evaluation/components/EvaluationTicket'

const ConfirmEvaluationPage = () => {
  let { search } = useLocation()
  search = qs.parse(search)

  return (
    <MainLayout>
      <CustomBreadcrumb
        items={[
          {
            url: '/dashboard',
            title: 'Bảng Điều Khiển',
            icon: 'fas fa-home',
          },
          {
            url: '/evaluation/confirm',
            title: 'Phiếu điểm rèn luyện',
            icon: '',
          },
        ]}
      />
      {search.studentId && search.yearId && search.semesterId ? (
        <EvaluationTicket
          studentIdProp={parseInt(search.studentId, 10)}
          yearIdProp={parseInt(search.yearId, 10)}
          semesterIdProp={parseInt(search.semesterId, 10)}
        />
      ) : (
        <Card>Không hợp lệ</Card>
      )}
    </MainLayout>
  )
}

export default ConfirmEvaluationPage
