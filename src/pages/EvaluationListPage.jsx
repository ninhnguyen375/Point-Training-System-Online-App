import React from 'react'
import { useSelector } from 'react-redux'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import EvaluationList from '../modules/evaluation/components/EvaluationList'
import { MODULE_NAME as MODULE_USER, ROLE } from '../modules/user/model'


const EvaluationListPage = () => {
  // store
  const profile = useSelector((state) => state[MODULE_USER].profile)

  const items = []

  if (profile.roleName === ROLE.employee) {
    items.push({
      url: '/dashboard',
      title: 'Bảng Điều Khiển',
      icon: 'fas fa-home',
    })
  }

  // Default item
  items.push({
    url: '/evaluation',
    title: 'Danh sách phiếu điểm rèn luyện',
    icon: 'fas fa-copy',
  })

  return (
    <MainLayout>
      <CustomBreadcrumb
        items={items}
      />
      <EvaluationList />
    </MainLayout>
  );
}

export default EvaluationListPage
