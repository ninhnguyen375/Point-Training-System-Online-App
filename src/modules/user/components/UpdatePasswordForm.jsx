import { Button, Divider, Form, Input } from 'antd'
import { func, string } from 'prop-types'
import React from 'react'

const UpdatePasswordForm = ({ onSubmit, email }) => {
  const [form] = Form.useForm()

  return (
    <div className="container-fluid">
      <Form layout="vertical" form={form} onFinish={(v) => onSubmit(v)}>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Vui lòng nhập email',
            },
          ]}
          label="Email:"
          initialValue={email}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item name="oldPassword" label="Mật khẩu cũ:">
          <Input.Password placeholder="Nhập mật khẩu cũ" />
        </Form.Item>
        <Form.Item name="newPassword" label="Mật khẩu mới:">
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>
        <Form.Item
          name="newPasswordConfirm"
          label="Xác nhận mật khẩu mới:"
          rules={[
            {
              validator: (_, value) => {
                if (form.getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }

                return Promise.reject(new Error('Mật khẩu không khớp'))
              },
            },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
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

UpdatePasswordForm.propTypes = {
  onSubmit: func.isRequired,
  email: string.isRequired,
}

export default UpdatePasswordForm
