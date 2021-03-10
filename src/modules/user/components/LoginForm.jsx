import { Button, Card, Divider, Form, Input } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux'
import Logo from '../../../assets/images/sgu-logo.png'
import { login } from '../actions'
import { services } from '../services'

const LoginForm = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  const handleSubmit = async (values) => {
    const { data } = await services.login(values)

    dispatch(login(data.data))
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
                <i className="fas fa-sign-in-alt mr-5" />
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
