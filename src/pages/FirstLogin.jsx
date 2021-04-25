/* eslint-disable react/jsx-curly-newline */
import { Button, Card, Divider, Form, Input, notification } from 'antd'
import React from 'react'
import qs from 'query-string'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import handleError from '../common/utils/handleError'
import { updateEmployeesService } from '../modules/user/services'
import { login } from '../modules/user/actions'
import { ROLE } from '../modules/user/model'

const FirstLogin = () => {
  const [form] = Form.useForm()
  const history = useHistory()
  const { search } = useLocation()
  const query = qs.parse(search)
  const user = { ...query, id: parseInt(query.id, 10) }
  const dispatch = useDispatch()

  const handleSubmit = async (values) => {
    try {
      await updateEmployeesService({
        token: user.token,
        userCode: user.code,
        userEmail: values.email,
        userRoleName: user.roleName,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })

      notification.success({
        message: 'Thay đổi mật khẩu',
        description: 'Thành công',
      })

      history.push('/')
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  return (
    <div className="login-form--container">
      <Card className="login-form">
        <div className="container-fluid">
          <div className="d-flex justify-content-between">
            <div>
              <div>
                <h4>
                  <b>ĐĂNG NHẬP LẦN ĐẦU</b>
                </h4>
              </div>
              <div>
                <b>Thay đổi mật khẩu</b>
              </div>
            </div>
            <Button
              type="text"
              onClick={() => {
                if (user.roleName === ROLE.monitor) {
                  dispatch(
                    login({ ...user, roleName: ROLE.student, isMonitor: true }),
                  )
                } else if (user.roleName === ROLE.student) {
                  dispatch(login({ ...user, isMonitor: false }))
                } else {
                  dispatch(login(user))
                }

                history.push('/')
              }}
            >
              <i
                className="fas fa-times"
                style={{ fontSize: '1.2em', color: 'gray' }}
              />
            </Button>
          </div>
          <Divider />
          <div className="row mt-4">
            <Form onFinish={handleSubmit} form={form}>
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Vui lòng nhập email' }]}
                label="Email:"
                initialValue={user.email}
                className="text-end"
              >
                <Input style={{ width: 300 }} placeholder="Nhập email" />
              </Form.Item>
              <Form.Item
                name="oldPassword"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                label="Mật khẩu cũ:"
                className="text-end"
              >
                <Input.Password
                  style={{ width: 300 }}
                  placeholder="Nhập mật khẩu cũ"
                />
              </Form.Item>
              <Form.Item
                name="newPassword"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                label="Mật khẩu mới:"
                className="text-end"
              >
                <Input.Password
                  style={{ width: 300 }}
                  placeholder="Nhập mật khẩu mới"
                />
              </Form.Item>
              <Form.Item
                name="confirmNewPassword"
                dependencies={['newPassword']}
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
                label="Xác nhận mật khẩu mới:"
                className="text-end"
              >
                <Input.Password
                  style={{ width: 300 }}
                  placeholder="Xác nhận mật khẩu mới"
                />
              </Form.Item>

              <Button size="large" htmlType="submit" type="primary" block>
                THAY ĐỔI MẬT KHẨU
              </Button>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default FirstLogin
