import {
  Button,
  Card,
  DatePicker,
  Form,
  message,
  notification,
  Popconfirm,
  Select,
  Table,
  Tooltip,
} from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import handleError from '../../../common/utils/handleError'
import SelectStudentClassList from '../../student-class/components/SelectStudentClassList'
import { semesters } from '../model'
import { startEvaluationService } from '../services'

const CreateEvaluationForm = () => {
  const [form] = Form.useForm()
  const history = useHistory()
  const [selectedStudentClasses, setSelectedStudentClasses] = useState([])
  const [
    selectedOverdueStudentClasses,
    setSelectedOverdueStudentClasses,
  ] = useState([])

  const handleSubmit = async (values) => {
    if (
      selectedStudentClasses.length === 0 &&
      selectedOverdueStudentClasses.length === 0
    ) {
      message.error('Vui lòng chọn lớp')
      return
    }

    try {
      await startEvaluationService({
        ...values,
        deadlineDateForStudent: moment(values.deadlineDateForStudent).format(
          'yyyy/MM/DD',
        ),
        deadlineDateForLecturer: moment(values.deadlineDateForLecturer).format(
          'yyyy/MM/DD',
        ),
        deadlineDateForMonitor: moment(values.deadlineDateForMonitor).format(
          'yyyy/MM/DD',
        ),
        studentClassesId: selectedStudentClasses.map((c) => c.id),
        overdueStudentClassesId: selectedOverdueStudentClasses.map((c) => c.id),
      })
      notification.success({ message: 'Bắt đầu thành công' })
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
      moment(date).isBefore(
        moment(form.getFieldValue(name)).add(1, 'day'),
        'date',
      )
    ) {
      return Promise.reject(new Error(`Phải lớn hơn hạn chót cho ${type}`))
    }
    return Promise.resolve()
  }

  const handleClickSelectStudentClass = () => {
    window.Modal.show(
      <SelectStudentClassList
        key="handleClickSelectStudentClass"
        defaultSelectedKeys={selectedStudentClasses.map((c) => c.id)}
        onSelect={(keys, items) => setSelectedStudentClasses(items)}
        ignoreKeys={selectedOverdueStudentClasses.map((c) => c.id)}
      />,
      {
        title: <b>CHỌN LỚP</b>,
        style: { top: 10 },
        key: 'select-student-class-modal',
      },
    )
  }

  const handleClickSelectOverdueStudentClass = () => {
    window.Modal.show(
      <SelectStudentClassList
        key="handleClickSelectOverdueStudentClass"
        defaultSelectedKeys={selectedOverdueStudentClasses.map((c) => c.id)}
        onSelect={(keys, items) => setSelectedOverdueStudentClasses(items)}
        ignoreKeys={selectedStudentClasses.map((c) => c.id)}
      />,
      {
        title: <b>CHỌN LỚP QUÁ HẠN RA TRƯỜNG</b>,
        style: { top: 10 },
        key: 'select-overdue-student-class-modal',
      },
    )
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
            rules={[
              { required: true, message: 'Bắt buộc' },
              {
                validator: (_, value) =>
                  moment(value, 'YYYY-MM-YYYY').isBefore(moment())
                    ? Promise.reject(new Error('Phải lớn hơn ngày hiện tại'))
                    : Promise.resolve(),
              },
            ]}
            label="Hạn chót đánh giá dành cho sinh viên:"
            name="deadlineDateForStudent"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: 'Bắt buộc' },
              {
                validator: validator('deadlineDateForStudent'),
              },
            ]}
            label="Hạn chót đánh giá dành cho lớp trưởng:"
            name="deadlineDateForMonitor"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: 'Bắt buộc' },
              {
                validator: validator('deadlineDateForMonitor'),
              },
            ]}
            label="Hạn chót đánh giá dành cho cố vấn học tập:"
            name="deadlineDateForLecturer"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <div>
            <Popconfirm
              okButtonProps={{ className: 'success' }}
              placement="topRight"
              title="Xác nhận"
              onConfirm={() => form.submit()}
            >
              <Button size="large" className="success" type="primary" block>
                <i className="fas fa-play-circle me-2" />
                BẮT ĐẦU ĐỢT ĐÁNH GIÁ
              </Button>
            </Popconfirm>
          </div>
        </Form>

        <div className="col-lg-4">
          <Button onClick={handleClickSelectStudentClass}>
            <i className="fas fa-plus me-2" />
            CHỌN LỚP
          </Button>
          <Table
            bordered
            className="mt-2"
            size="small"
            rowKey={(r) => r.id}
            dataSource={selectedStudentClasses}
            columns={[
              {
                key: 'title',
                title: 'Lớp',
                dataIndex: 'title',
              },
              {
                key: 'course',
                title: 'Khóa',
                dataIndex: 'course',
              },
            ]}
          />
        </div>

        <div className="col-lg-4">
          <Tooltip title="Phiếu của lớp này do chuyên viên đánh giá">
            <Button
              className="warning"
              onClick={handleClickSelectOverdueStudentClass}
            >
              <i className="fas fa-plus me-2" />
              CHỌN LỚP QUÁ HẠN RA TRƯỜNG
            </Button>
          </Tooltip>
          <Table
            bordered
            className="mt-2"
            size="small"
            rowKey={(r) => r.id}
            dataSource={selectedOverdueStudentClasses}
            columns={[
              {
                key: 'title',
                title: 'Lớp',
                dataIndex: 'title',
              },
              {
                key: 'course',
                title: 'Khóa',
                dataIndex: 'course',
              },
            ]}
          />
        </div>
      </div>
    </Card>
  )
}

export default CreateEvaluationForm
