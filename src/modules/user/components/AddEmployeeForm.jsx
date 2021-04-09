import { Button, Divider, Form, Input } from 'antd'
import { func } from 'prop-types'
import React from 'react'

const AddEmployeeForm = ({ onSubmit }) => {
  const [form] = Form.useForm()

  return (
    <div className="container-fluid">
      <Form layout="vertical" form={form} onFinish={(v) => onSubmit(v, form)}>
        <Form.Item
          name="fullName"
          label="Họ Tên:"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>
        <Form.Item
          name="code"
          label="Mã Số:"
          rules={[{ required: true, message: 'Vui lòng nhập mã số' }]}
        >
          <Input placeholder="Nhập mã số" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email:"
          rules={[{ required: true, message: 'Vui lòng nhập email' }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Divider />
        <div className="d-flex justify-content-end">
          <Button htmlType="submit" type="primary">
            <i className="fas fa-plus me-2" />
            THÊM
          </Button>
        </div>
      </Form>
    </div>
  )
}

AddEmployeeForm.propTypes = {
  onSubmit: func.isRequired,
}

export default AddEmployeeForm
