import { Card, Form, notification } from 'antd'
import moment from 'moment'
import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import handleError from '../../../common/utils/handleError'
import { updateEvaluationBatchService } from '../services'

const EvaluationBatch = () => {
  const location = useLocation()
  const { state } = location
  const [form] = Form.useForm()
  const history = useHistory()

  useEffect(() => {
    if (state) {
      form.setFields([
        {
          name: 'deadlineDateForStudent',
          value: moment(state.deadlineDateForStudent, 'YYYY-MM-DD'),
        },
        {
          name: 'deadlineDateForMonitor',
          value: moment(state.deadlineDateForMonitor),
        },
        {
          name: 'deadlineDateForLecturer',
          value: moment(state.deadlineDateForLecturer),
        },
      ])
    }
  }, [state])

  const handleSubmit = async (values) => {
    try {
      const data = {
        deadlineDateForStudent: values.deadlineDateForStudent.format(
          'YYYY-MM-DD',
        ),
        deadlineDateForMonitor: values.deadlineDateForMonitor.format(
          'YYYY-MM-DD',
        ),
        deadlineDateForLecturer: values.deadlineDateForLecturer.format(
          'YYYY-MM-DD',
        ),
      }

      await updateEvaluationBatchService(state.semester.id, state.year.id, data)

      history.push(location.pathname, { ...state, ...data })
      notification.success({ message: 'Cập nhật thành công' })
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  return (
    <Card size="small" title={<b>CHI TIẾT ĐỢT ĐÁNH GIÁ</b>}>
      <Form
        className="col-lg-4"
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
      >
        {state ? (
          <div>
            <div className="mt-2">
              <span className="me-2">Năm học:</span>
              <b>{state.year.title}</b>
            </div>
            <div className="mt-2">
              <span className="me-2">Học kỳ:</span>
              <b>{state.semester.title}</b>
            </div>
          </div>
        ) : (
          'Không hợp lệ'
        )}
      </Form>
    </Card>
  )
}

export default EvaluationBatch
