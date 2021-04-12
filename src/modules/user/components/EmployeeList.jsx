import {
  Button,
  Card,
  Input,
  notification,
  Popconfirm,
  Table,
  Tag,
  Tooltip,
} from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import handleError from '../../../common/utils/handleError'
import { getString } from '../../../common/utils/object'
import { ROLE, userStatus, userStatusColor } from '../model'
import {
  addEmployeesService,
  blockUserService,
  unblockUserService,
  getEmployeesService,
  updateEmployeesService,
  resetPasswordService,
} from '../services'
import AddEmployeeForm from './AddEmployeeForm'
import UpdateEmployeeForm from './UpdateEmployeeForm'

const EmployeeList = () => {
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [search, setSearch] = useState({})

  const getEmployees = useCallback(async () => {
    try {
      let { data } = await getEmployeesService()
      data = data.data
      data = data.filter((d) => d.roleName === ROLE.employee)

      setEmployees(data)
      setFilteredEmployees(data)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  useEffect(() => {
    getEmployees()
  }, [getEmployees])

  const applyFilter = useCallback(() => {
    if (!search) {
      return
    }

    let filtered = [...employees]

    if (search.fullName) {
      filtered = filtered.filter((f) =>
        f.fullName.toLowerCase().includes(search.fullName.toLowerCase()),
      )
    }
    if (search.code) {
      filtered = filtered.filter((f) => f.code.includes(search.code))
    }
    if (search.email) {
      filtered = filtered.filter(
        (f) => f.email && f.email.includes(search.email),
      )
    }

    setFilteredEmployees(filtered)
  }, [search, employees])

  useEffect(() => {
    applyFilter()
  }, [applyFilter])

  const addEmployee = async (values, form) => {
    try {
      await addEmployeesService({
        fullName: values.fullName,
        code: values.code,
        email: values.email,
        password: values.code,
        privateRole: ROLE.employee,
      })

      await getEmployees()
      window.Modal.clear()
      notification.success({
        message: 'Thêm nhân viên',
        description: 'Thành công',
      })
    } catch (err) {
      const errorMessage = getString(err, 'response.data.message')

      if (errorMessage.includes('Mã nhân viên')) {
        form.setFields([
          {
            name: 'code',
            errors: [errorMessage],
          },
        ])

        return
      }

      handleError(err, null, notification)
    }
  }

  const handleClickAddEmployee = () => {
    window.Modal.show(<AddEmployeeForm onSubmit={addEmployee} />, {
      style: { top: 10 },
      title: <b>THÊM NHÂN VIÊN</b>,
      key: 'add-employee-modal',
    })
  }

  const blockUser = async (userId, roleName) => {
    try {
      await blockUserService({ userId, roleName })

      notification.success({
        message: 'Khóa tài khoản',
        description: 'Thành công',
      })

      getEmployees()
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const unblockUser = async (userId, roleName) => {
    try {
      await unblockUserService({ userId, roleName })

      notification.success({
        message: 'Mở khóa tài khoản',
        description: 'Thành công',
      })

      getEmployees()
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const updateUser = (r) => async (values) => {
    try {
      await updateEmployeesService({
        userCode: r.code,
        userEmail: values.email,
        userRoleName: r.roleName,
      })

      notification.success({
        message: 'Cập nhật',
        description: 'Thành công',
      })
      window.Modal.clear()
      getEmployees()
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const resetPassword = async (userId, roleName) => {
    try {
      await resetPasswordService({
        userId,
        roleName,
      })

      notification.success({
        message: 'Reset mật khẩu',
        description: 'Thành công',
      })
      window.Modal.clear()
      getEmployees()
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const handleClickShowInfo = (r) => {
    window.Modal.show(
      <UpdateEmployeeForm onSubmit={updateUser(r)} employee={r} />,
      {
        title: <b>CHỈNH SỬA CHI TIẾT</b>,
        key: 'update-employee-modal',
      },
    )
  }

  return (
    <Card title={<b>DANH SÁCH NHÂN VIÊN</b>}>
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <Input
            className="me-2 mb-2"
            onChange={(e) => setSearch({ ...search, code: e.target.value })}
            placeholder="Tìm theo Mã Số"
            allowClear
          />
          <Input
            className="me-2 mb-2"
            onChange={(e) => setSearch({ ...search, fullName: e.target.value })}
            placeholder="Tìm theo Họ Tên"
            allowClear
          />
          <Input
            className="me-2 mb-2"
            onChange={(e) => setSearch({ ...search, email: e.target.value })}
            placeholder="Tìm theo Email"
            allowClear
          />
          <Tooltip title="Làm mới">
            <Button onClick={getEmployees} className="me-2 mb-2">
              <i className="fas fa-sync" />
            </Button>
          </Tooltip>
        </div>
        <Button onClick={handleClickAddEmployee} type="primary">
          <i className="fas fa-plus me-2" />
          THÊM NHÂN VIÊN
        </Button>
      </div>
      <Table
        columns={[
          {
            key: 'code',
            dataIndex: 'code',
            title: <b>Mã Số</b>,
          },
          {
            key: 'fullName',
            dataIndex: 'fullName',
            title: <b>Họ Tên</b>,
          },
          {
            key: 'email',
            dataIndex: 'email',
            title: <b>Email</b>,
          },
          {
            key: 'status',
            title: <b>Trạng Thái</b>,
            align: 'center',
            render: (r) => (
              <Tag color={userStatusColor[r.status]}>{r.status}</Tag>
            ),
          },
          {
            key: 'action',
            title: <b>Hành Động</b>,
            align: 'right',
            render: (r) => {
              const actions = []

              actions.push(
                <Popconfirm
                  title="Reset mật khẩu tài khoản này?"
                  onConfirm={() => resetPassword(r.id, r.roleName)}
                >
                  <Button className="mb-2 me-2">
                    <i className="fas fa-sync-alt me-2" />
                    RESET MẬT KHẨU
                  </Button>
                </Popconfirm>,
              )

              if (r.status === userStatus.acitve) {
                actions.push(
                  <Tooltip key="block" title="KHÓA">
                    <Popconfirm
                      title="Khóa tài khoản này?"
                      onConfirm={() => blockUser(r.id, r.roleName)}
                    >
                      <Button
                        className="mb-2 me-2"
                        type="primary"
                        danger
                        shape="circle"
                      >
                        <i className="fas fa-lock" />
                      </Button>
                    </Popconfirm>
                  </Tooltip>,
                )
              } else {
                actions.push(
                  <Tooltip key="block" title="MỞ KHÓA">
                    <Popconfirm
                      title="Mở khóa tài khoản này?"
                      onConfirm={() => unblockUser(r.id, r.roleName)}
                    >
                      <Button
                        type="primary"
                        className="mb-2 me-2 success"
                        shape="circle"
                      >
                        <i className="fas fa-unlock" />
                      </Button>
                    </Popconfirm>
                  </Tooltip>,
                )
              }

              actions.push(
                <Button
                  key="info"
                  onClick={() => handleClickShowInfo(r)}
                  className="mb-2 me-2"
                  shape="circle"
                >
                  <i className="fas fa-info" />
                </Button>,
              )

              return actions.map((a) => a)
            },
          },
        ]}
        size="small"
        scroll={{ x: 500 }}
        rowKey={(r) => r.id}
        dataSource={filteredEmployees}
      />
    </Card>
  )
}

export default EmployeeList
