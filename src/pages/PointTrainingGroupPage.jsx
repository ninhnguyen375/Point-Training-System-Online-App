import React from 'react'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import PointTrainingGroup from '../modules/point-training-group/components/PointTrainingGroup'

const PointTrainingGroupPage = () => (
  <MainLayout>
    <CustomBreadcrumb
      items={[
        {
          url: '/dashboard',
          title: 'Bảng Điều Khiển',
          icon: 'fas fa-home',
        },
        {
          url: '/point-training-group',
          title: 'Mục đánh giá rèn luyện',
          icon: 'fas fa-list',
        },
      ]}
    />
    <PointTrainingGroup />
  </MainLayout>
)

export default PointTrainingGroupPage
