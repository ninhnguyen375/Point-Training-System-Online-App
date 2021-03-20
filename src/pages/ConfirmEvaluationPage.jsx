import {notification} from 'antd'
import React, {useCallback, useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import EvaluationTicket from '../modules/evaluation/components/EvaluationTicket'

const ConfirmEvaluationPage = () => {
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  console.log('~ data', data)

  useEffect(() => {
    const {location} = history
    const {state} = location
    if (!state) {
      notification.error({message: 'SV không hợp lệ'})
    } else {
      setData(state)
      setLoading(false)
    }
  }, [])

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
            url: '/make-evaluation',
            title: 'Phiếu điểm rèn luyện',
            icon: '',
          },
        ]}
      />
      {loading ? (
        'Đang tải...'
      ) : (
        <EvaluationTicket
          student={data.student}
          yearIdProp={data.yearId}
          semesterIdProp={data.semesterId}
        />
      )}
    </MainLayout>
  )
}

export default ConfirmEvaluationPage
