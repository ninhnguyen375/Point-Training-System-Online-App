/* eslint-disable react/jsx-curly-newline */
import { Button, Card, Divider, Form, Input, notification } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux'
import Logo from '../../../assets/images/sgu-logo.png'
import handleError from '../../../common/utils/handleError'
import { addPointTrainingGroup } from '../../evaluation/actions'
import { getPointTrainingGroupsService } from '../../evaluation/services'
import { login } from '../actions'
import { ROLE } from '../model'
import { loginService } from '../services'

const LoginForm = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  const handleSubmit = async (values) => {
    try {
      let user = await loginService(values)
      user = user.data.data

      let pointTrainingGroups = await getPointTrainingGroupsService(user.token)
      pointTrainingGroups = pointTrainingGroups.data.data

      if (user.roleName === ROLE.monitor) {
        dispatch(login({ ...user, roleName: ROLE.student, isMonitor: true }))
      } else if (user.roleName === ROLE.student) {
        dispatch(login({ ...user, isMonitor: false }))
      } else {
        dispatch(login(user))
      }

      dispatch(addPointTrainingGroup(pointTrainingGroups))
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  return (
    <div className="login-form--container">
      <Card className="login-form">
        <div className="container-fluid">
          <div className="row">
            <div
              className="col-lg-4 text-center"
              style={{ width: 100, height: 100 }}
            >
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

              <Card className="mt-3" title="Demo account" size="small">
                <div style={{ width: 400 }} className="d-flex flex-wrap">
                  <Button
                    htmlType="button"
                    onClick={() =>
                      handleSubmit({
                        code: '3117410001',
                        password: '3117410001',
                      })
                    }
                  >
                    Lớp trưởng
                  </Button>
                  <Button
                    htmlType="button"
                    onClick={() =>
                      handleSubmit({
                        code: '3117410000',
                        password: '3117410000',
                      })
                    }
                  >
                    Sinh viên
                  </Button>
                  <Button
                    htmlType="button"
                    onClick={() =>
                      handleSubmit({
                        code: '3115410000',
                        password: '3115410000',
                      })
                    }
                  >
                    SV Quá Hạn
                  </Button>
                  <Button
                    htmlType="button"
                    onClick={() =>
                      handleSubmit({ code: '9999', password: '9999' })
                    }
                  >
                    Giảng viên
                  </Button>
                  <Button
                    htmlType="button"
                    onClick={() =>
                      handleSubmit({ code: '11111', password: '11111' })
                    }
                  >
                    Phó khoa
                  </Button>
                  <Button
                    htmlType="button"
                    onClick={() =>
                      handleSubmit({ code: '12345', password: '12345' })
                    }
                  >
                    Nhân viên
                  </Button>
                  <Button
                    htmlType="button"
                    onClick={() =>
                      handleSubmit({ code: '00000', password: '00000' })
                    }
                  >
                    Manager
                  </Button>
                </div>
              </Card>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default LoginForm
