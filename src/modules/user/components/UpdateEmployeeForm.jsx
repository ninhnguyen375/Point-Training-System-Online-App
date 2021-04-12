import { Button, Divider, Form, Input } from 'antd'
import PropTypes, { func, objectOf } from 'prop-types'

import React, { useEffect } from 'react'

const UpdateEmployeeForm = ({ onSubmit, employee }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(employee)
  }, [employee])

  return (
    <div className="container-fluid">
      <Form layout="vertical" form={form} onFinish={(v) => onSubmit(v, form)}>
        <Form.Item
          name="code"
          label="Mã Số:"
          rules={[{ required: true, message: 'Vui lòng nhập mã số' }]}
        >
          <Input disabled placeholder="Nhập mã số" />
        </Form.Item>
        <Form.Item
          name="fullName"
          label="Họ Tên:"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input placeholder="Nhập họ tên" />
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
            <i className="fas fa-edit me-2" />
            CẬP NHẬT
          </Button>
        </div>
      </Form>
    </div>
  )
}

UpdateEmployeeForm.propTypes = {
  onSubmit: func.isRequired,
  employee: objectOf(PropTypes.any).isRequired,
}

export default UpdateEmployeeForm
