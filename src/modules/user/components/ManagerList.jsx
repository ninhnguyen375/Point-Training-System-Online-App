import { Button, Card, Input, notification, Table, Tooltip } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import handleError from '../../../common/utils/handleError'
import { getString } from '../../../common/utils/object'
import { ROLE } from '../model'
import { addEmployeesService, getEmployeesService } from '../services'
import AddEmployeeForm from './AddEmployeeForm'

const ManagerList = () => {
  const [managers, setManagers] = useState([])
  const [filteredManagers, setFilteredManagers] = useState([])
  const [search, setSearch] = useState({})

  const getManagers = useCallback(async () => {
    try {
      let { data } = await getEmployeesService()
      data = data.data
      data = data.filter((d) => d.privateRole === ROLE.manager)

      setManagers(data)
      setFilteredManagers(data)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  useEffect(() => {
    getManagers()
  }, [getManagers])

  const applyFilter = useCallback(() => {
    if (!search) {
      return
    }

    let filtered = [...managers]

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

    setFilteredManagers(filtered)
  }, [search, managers])

  useEffect(() => {
    applyFilter()
  }, [applyFilter])

  const addManager = async (values, form) => {
    try {
      await addEmployeesService({
        fullName: values.fullName,
        code: values.code,
        email: values.email,
        password: values.code,
        privateRole: ROLE.manager,
      })

      await getManagers()
      window.Modal.clear()
      notification.success({
        message: 'Thêm quản lý',
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

  const handleClickAddManager = () => {
    window.Modal.show(<AddEmployeeForm onSubmit={addManager} />, {
      style: { top: 10 },
      title: <b>THÊM QUẢN LÝ</b>,
      key: 'add-manager-modal',
    })
  }

  return (
    <Card size="small" title={<b>DANH SÁCH QUẢN LÝ</b>}>
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
            <Button onClick={getManagers} className="me-2 mb-2">
              <i className="fas fa-sync" />
            </Button>
          </Tooltip>
        </div>
        <Button onClick={handleClickAddManager} type="primary">
          <i className="fas fa-plus me-2" />
          THÊM QUẢN LÝ
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
        ]}
        size="small"
        scroll={{ x: 500 }}
        rowKey={(r) => r.id}
        dataSource={filteredManagers}
      />
    </Card>
  )
}

export default ManagerList
