import { Button, Card, Divider, Form, Input, notification } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux'
import Logo from '../../../assets/images/sgu-logo.png'
import handleError from '../../../common/utils/handleError'
import { login } from '../actions'
import { loginService } from '../services'

const LoginForm = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  const handleSubmit = async (values) => {
    try {
      const { data } = await loginService(values)
      console.log('~ data', data)
      dispatch(login(data.data))
    } catch (err) {
      console.log('~ err', err)
      handleError(err, null, notification)
    }
  }

  return (
    <div className="login-form--container">
      <Card className="login-form">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 text-center">
              <img src={Logo} alt="logo" width={100} />
            </div>
            <div className="col-lg-8 text-secondary text-center">
              <b>HỆ THỐNG QUẢN LÝ ĐIỂM RÈN LUYỆN KHOA CNTT</b>
              <div className="pt-3">
                <h4>
                  <b>ĐĂNG NHẬP</b>
                </h4>
              </div>
            </div>
          </div>
          <Divider />
          <div className="row mt-4">
            <Form onFinish={handleSubmit} form={form}>
              <Form.Item
                name="code"
                initialValue="3117410212"
                rules={[{ required: true, message: 'Vui lòng nhập mã số ' }]}
                label="Mã số:"
              >
                <Input
                  style={{ float: 'right', width: 300 }}
                  placeholder="Nhập mã số"
                />
              </Form.Item>
              <Form.Item
                name="password"
                initialValue="3117410212"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                label="Mật khẩu:"
              >
                <Input.Password
                  style={{ float: 'right', width: 300 }}
                  placeholder="Nhập mật khẩu"
                />
              </Form.Item>
              <Button size="large" htmlType="submit" type="primary" block>
                <i className="fas fa-sign-in-alt me-2" />
                ĐĂNG NHẬP
              </Button>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default LoginForm
