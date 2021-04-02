import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Form,
  notification,
  Popconfirm,
  Select,
  Table,
} from 'antd'
import moment from 'moment'
import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import handleError from '../../../common/utils/handleError'
import {semesters} from '../model'
import {startEvaluationService} from '../services'

const CreateEvaluationForm = () => {
  const [form] = Form.useForm()
  const history = useHistory()
  const [isValidate, setIsValidate] = useState(true)

  const handleSubmit = async (values) => {
    try {
      await startEvaluationService({...values, studentClassesId: [1]})
      notification.success({message: 'Bắt đầu thành công'})
      history.push('/evaluation-batch')
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const currentYear = moment().year()

  const years = [
    `${currentYear - 1}-${currentYear}`,
    `${currentYear}-${currentYear + 1}`,
  ]

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
    <Card title={<b>BẮT ĐẦU ĐỢT ĐÁNH GIÁ RÈN LUYỆN</b>}>
      <div className="row">
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
            rules={
              isValidate
                ? [
                  {required: true, message: 'Bắc buộc'},
                  {
                    validator: (_, value) =>
                      moment(value, 'YYYY-MM-YYYY').isBefore(moment())
                        ? Promise.reject(
                          new Error('Phải lớn hơn ngày hiện tại'),
                        )
                        : Promise.resolve(),
                  },
                ]
                : []
            }
            label="Hạn chót đánh giá dành cho sinh viên:"
            name="deadlineDateForStudent"
          >
            <DatePicker style={{width: '100%'}} />
          </Form.Item>
          <Form.Item
            rules={
              isValidate
                ? [
                  {required: true, message: 'Bắc buộc'},
                  {
                    validator: validator('deadlineDateForStudent'),
                  },
                ]
                : []
            }
            label="Hạn chót đánh giá dành cho lớp trưởng:"
            name="deadlineDateForMonitor"
          >
            <DatePicker style={{width: '100%'}} />
          </Form.Item>
          <Form.Item
            rules={
              isValidate
                ? [
                  {required: true, message: 'Bắc buộc'},
                  {
                    validator: validator('deadlineDateForMonitor'),
                  },
                ]
                : []
            }
            label="Hạn chót đánh giá dành cho cố vấn học tập:"
            name="deadlineDateForLecturer"
          >
            <DatePicker style={{width: '100%'}} />
          </Form.Item>
          <div>
            <Checkbox
              checked={isValidate}
              onClick={() => setIsValidate(!isValidate)}
            >
              Validate
            </Checkbox>
            <Popconfirm
              okButtonProps={{className: 'success'}}
              placement="topRight"
              title="Xác nhận"
              onConfirm={() => form.submit()}
            >
              <Button size="large" className="success" type="primary" block>
                <i className="fas fa-play-circle me-2" />
                BẮT ĐẦU
              </Button>
            </Popconfirm>
          </div>
        </Form>

        <div className="col-lg-4">
          <Button>CHỌN LỚP</Button>
          <Table
            size="small"
            rowKey={r => r.id}
            columns={[{
              key: 'studentClass',
              title: 'Lớp',
              dataIndex: '',
            }]}
          />
        </div>
      </div>


    </Card>
  )
}

export default CreateEvaluationForm
