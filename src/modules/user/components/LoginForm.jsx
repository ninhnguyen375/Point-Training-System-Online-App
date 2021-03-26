import {Button, Card, Divider, Form, Input, notification} from 'antd'
import React from 'react'
import {useDispatch} from 'react-redux'
import Logo from '../../../assets/images/sgu-logo.png'
import handleError from '../../../common/utils/handleError'
import {addPointTrainingGroup} from '../../evaluation/actions'
import {getPointTrainingGroupsService} from '../../evaluation/services'
import {addStudentsInClass} from '../../student-class/actions'
import {getStudentsOfClassByMonitorIdService} from '../../student-class/services'
import {login} from '../actions'
import {ROLE} from '../model'
import {loginService} from '../services'

const LoginForm = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  const handleSubmit = async (values) => {
    try {
      let user = await loginService(values)
      user = user.data.data

      let pointTrainingGroups = await getPointTrainingGroupsService(user.token)
      pointTrainingGroups = pointTrainingGroups.data.data

      if(user.roleName === ROLE.student) {
        try {
          let students = await getStudentsOfClassByMonitorIdService(user.id, user.token)
          students = students.data.data
          dispatch(addStudentsInClass(students))
          dispatch(login({...user, isMonitor: true}))
        } catch (err) {
          dispatch(login({...user, isMonitor: false}))
        }
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
                rules={[{required: true, message: 'Vui lòng nhập mã số '}]}
                label="Mã số:"
              >
                <Input
                  style={{float: 'right', width: 300}}
                  placeholder="Nhập mã số"
                />
              </Form.Item>
              <Form.Item
                name="password"
                initialValue="3117410212"
                rules={[{required: true, message: 'Vui lòng nhập mật khẩu'}]}
                label="Mật khẩu:"
              >
                <Input.Password
                  style={{float: 'right', width: 300}}
                  placeholder="Nhập mật khẩu"
                />
              </Form.Item>
              <div className="mb-2">
                <Button
                  htmlType="button"
                  onClick={() =>
                    handleSubmit({code: '3117410002', password: '3117410002'})}
                >
                  Sinh viên D
                </Button>
                <Button
                  htmlType="button"
                  onClick={() =>
                    handleSubmit({code: '3117410212', password: '3117410212'})}
                >
                  Sinh viên A - lop truong
                </Button>
                <Button
                  htmlType="button"
                  onClick={() =>
                    handleSubmit({code: '54321', password: '54321'})}
                >
                  Giảng viên A
                </Button>
                <Button
                  htmlType="button"
                  onClick={() =>
                    handleSubmit({code: '12345', password: '12345'})}
                >
                  Nhân viên A
                </Button>
              </div>
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
