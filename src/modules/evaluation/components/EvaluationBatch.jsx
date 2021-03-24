import {Button, Card, DatePicker, Form, notification} from 'antd'
import moment from 'moment'
import React, {useEffect, useState} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import handleError from '../../../common/utils/handleError'
import {cloneObj} from '../../../common/utils/object'
import {updateEvaluationBatchService} from '../services'

const EvaluationBatch = () => {
  const location = useLocation()
  const {state} = location
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

      history.push(location.pathname, {...state, ...data})
      notification.success({message: 'Cập nhật thành công'})
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const validator = (name) => (_, date) => {
    let type = ''
    if (name === 'deadlineDateForStudent') {
      type = 'Sinh Viên'
    }
    if (name === 'deadlineDateForMonitor') {
      type = 'Lớp Trưởng'
    }
    if (name === 'deadlineDateForLecturer') {
      type = 'Cố Vấn Học Tập'
    }
    if (
      moment(date, 'YYYY-MM-DD').isBefore(
        moment(form.getFieldValue(name), 'YYYY-MM-DD').add(1, 'day'),
      )
    ) {
      return Promise.reject(new Error(`Phải lớn hơn hạn chót cho ${type}`))
    }
    return Promise.resolve()
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
              Năm học:
              {' '}
              <b>{state.year.title}</b>
            </div>
            <div className="mt-2">
              Học kỳ:
              {' '}
              <b>{state.semester.title}</b>
            </div>
            <div className="mt-3">
              <Form.Item
                rules={[
                  {required: true, message: 'Bắc buộc'},
                  {
                    validator: (_, value) =>
                      moment(value, 'YYYY-MM-YYYY').isBefore(moment())
                        ? Promise.reject(
                          new Error('Phải lớn hơn ngày hiện tại'),
                        )
                        : Promise.resolve(),
                  },
                ]}
                label="Hạn chót đánh giá dành cho sinh viên:"
                name="deadlineDateForStudent"
              >
                <DatePicker style={{width: '100%'}} />
              </Form.Item>
              <Form.Item
                rules={[
                  {required: true, message: 'Bắc buộc'},
                  {
                    validator: validator('deadlineDateForStudent'),
                  },
                ]}
                label="Hạn chót đánh giá dành cho lớp trưởng:"
                name="deadlineDateForMonitor"
              >
                <DatePicker style={{width: '100%'}} />
              </Form.Item>
              <Form.Item
                rules={[
                  {required: true, message: 'Bắc buộc'},
                  {
                    validator: validator('deadlineDateForMonitor'),
                  },
                ]}
                label="Hạn chót đánh giá dành cho cố vấn học tập:"
                name="deadlineDateForLecturer"
              >
                <DatePicker style={{width: '100%'}} />
              </Form.Item>
              <Button htmlType="submit" type="primary" block>
                CẬP NHẬT
              </Button>
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
