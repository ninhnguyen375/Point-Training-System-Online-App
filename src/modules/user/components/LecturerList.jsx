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
import { ROLE, userStatus, userStatusColor } from '../model'
import {
  blockUserService,
  getAllLecturersService,
  resetPasswordService,
  unblockUserService,
} from '../services'

const LecturerList = () => {
  // state
  const [lecturers, setLecturers] = useState([])
  const [filteredLecturers, setFilteredLecturers] = useState([])
  const [search, setSearch] = useState({})

  const getLecturers = useCallback(async () => {
    try {
      const { data } = await getAllLecturersService()

      setLecturers(data.data)
      setFilteredLecturers(data.data)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  useEffect(() => {
    getLecturers()
  }, [getLecturers])

  const blockUser = async (userId, roleName) => {
    try {
      await blockUserService({ userId, roleName })

      notification.success({
        message: 'Khóa tài khoản',
        description: 'Thành công',
      })

      getLecturers()
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

      getLecturers()
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
      getLecturers()
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const columns = [
    {
      key: 'code',
      title: 'Mã Số',
      render: (r) => r.code,
    },
    {
      key: 'fullName',
      title: 'Họ Tên',
      dataIndex: 'fullName',
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
    },
    {
      key: 'status',
      title: 'Trạng Thái',
      align: 'center',
      render: (r) => <Tag color={userStatusColor[r.status]}>{r.status}</Tag>,
    },
    {
      key: 'action',
      title: 'Hành Động',
      align: 'right',
      render: (r) => {
        const actions = []

        actions.push(
          <Popconfirm
            title="Reset mật khẩu tài khoản này?"
            onConfirm={() => resetPassword(r.id, ROLE.lecturer)}
            key="reset-password"
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
                onConfirm={() => blockUser(r.id, ROLE.lecturer)}
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
                onConfirm={() => unblockUser(r.id, ROLE.lecturer)}
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

        return actions.map((a) => a)
      },
    },
  ]

  const applySearch = useCallback(() => {
    let newLecturers = [...lecturers]

    if (search.fullName) {
      newLecturers = newLecturers.filter(
        (e) =>
          e.fullName.toLowerCase().indexOf(search.fullName.toLowerCase()) > -1,
      )
    }

    if (search.code) {
      newLecturers = newLecturers.filter(
        (e) => e.code.indexOf(search.code) > -1,
      )
    }

    if (search.lecturerClass) {
      newLecturers = newLecturers.filter((e) => {
        if (
          e.lecturerClass &&
          e.lecturerClass.id &&
          e.lecturerClass.id === search.lecturerClass
        ) {
          return true
        }
        return false
      })
    }

    if (search.course) {
      newLecturers = newLecturers.filter((e) => {
        if (
          e.lecturerClass &&
          e.lecturerClass.course &&
          e.lecturerClass.course === search.course
        ) {
          return true
        }
        return false
      })
    }

    setFilteredLecturers(newLecturers)
  }, [search, lecturers])

  useEffect(() => {
    applySearch()
  }, [applySearch])

  return (
    <Card title={<b>DANH SÁCH GIẢNG VIÊN</b>}>
      <div className="d-flex justify-content-between flex-wrap">
        <div className="d-flex flex-wrap">
          <Input
            onChange={(e) => setSearch({ ...search, code: e.target.value })}
            allowClear
            className="me-2 mb-2"
            style={{ width: 200 }}
            placeholder="Mã GV"
          />
          <Input
            onChange={(e) => setSearch({ ...search, fullName: e.target.value })}
            allowClear
            className="me-2 mb-2"
            style={{ width: 200 }}
            placeholder="Họ Tên GV"
          />
          <Button onClick={getLecturers} className="me-2 mb-2">
            <i className="fas fa-sync me-2" />
            LÀM MỚI
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        rowKey={(r) => r.id}
        dataSource={filteredLecturers}
        scroll={{ x: 600 }}
        size="small"
      />
    </Card>
  )
}

export default LecturerList
