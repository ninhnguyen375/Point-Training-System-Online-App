import {Button, Card, DatePicker, Form, notification, Popconfirm, Select} from 'antd'
import moment from 'moment'
import React from 'react'
import {useHistory} from 'react-router-dom'
import handleError from '../../../common/utils/handleError'
import {semesters} from '../model'
import {startEvaluationService} from '../services'

const CreateEvaluationForm = () => {
  const [form] = Form.useForm()
  const history = useHistory()

  const handleSubmit = async (values) => {
    try {
      await startEvaluationService(values)
      history.push('/dashboard')
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const currentYear = moment().year()
  console.log('~ currentYear', currentYear)

  const years = [
    `${currentYear - 1}-${currentYear}`,
    `${currentYear}-${currentYear + 1}`,
    `${currentYear + 1}-${currentYear + 2}`,
  ]

  return (
    <Card title={<b>BẮT ĐẦU ĐỢT ĐÁNH GIÁ RÈN LUYỆN</b>}>
      <Form
        className="col-lg-4"
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        scrollToFirstError
      >
        <Form.Item label="Năm Học:" name="yearTitle" initialValue={years[0]}>
          <Select>
            {years.map((y) => (
              <Select.Option key={y} value={y}>
                {y}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Học Kỳ:"
          name="semesterId"
          initialValue={semesters[0].id}
        >
          <Select>
            {semesters.map((s) => (
              <Select.Option value={s.id} key={s.id}>
                {s.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          rules={[{required: true, message: 'Bắc buộc'}]}
          label="Hạn chót đánh giá dành cho sinh viên:"
          name="deadlineDateForStudent"
        >
          <DatePicker style={{width: '100%'}} />
        </Form.Item>
        <Form.Item
          rules={[{required: true, message: 'Bắc buộc'}]}
          label="Hạn chót đánh giá dành cho lớp trưởng:"
          name="deadlineDateForMonitor"
        >
          <DatePicker style={{width: '100%'}} />
        </Form.Item>
        <Form.Item
          rules={[{required: true, message: 'Bắc buộc'}]}
          label="Hạn chót đánh giá dành cho cố vấn học tập:"
          name="deadlineDateForLecturer"
        >
          <DatePicker style={{width: '100%'}} />
        </Form.Item>
        <div className="d-flex justify-content-end">
          <Popconfirm
            title="Chắc chắn bắt đầu?"
            onConfirm={() => form.submit()}
          >
            <Button type="primary" block>
              BẮT ĐẦU
            </Button>
          </Popconfirm>
        </div>
      </Form>
    </Card>
  )
}

export default CreateEvaluationForm
