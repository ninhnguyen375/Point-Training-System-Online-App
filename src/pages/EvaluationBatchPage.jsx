import React from 'react'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import EvaluationStatistic from '../modules/evaluation/components/EvaluationStatistic'

const EvaluationBatchPage = () => {
  const { search } = useLocation()
  const { yearId, semesterId } = qs.parse(search)

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
            url: '/evaluation-batch/detail',
            title: 'Đợt đánh giá rèn luyện đã tạo',
            icon: '',
          },
        ]}
      />
      <EvaluationStatistic
        yearIdProp={parseInt(yearId, 10)}
        semesterIdProp={parseInt(semesterId, 10)}
      />
    </MainLayout>
  )
}

export default EvaluationBatchPage
