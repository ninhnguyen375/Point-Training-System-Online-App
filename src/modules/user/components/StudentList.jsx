import { Button, Card, Input, notification, Table, Tooltip } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import handleError from '../../../common/utils/handleError'
import { ROLE } from '../model'
import { getAllUsersService } from '../services'

const StudentList = () => {
  // state
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [search, setSearch] = useState({})

  const getStudents = useCallback(async () => {
    try {
      const { data } = await getAllUsersService()

      setStudents(data.data)
      setFilteredStudents(data.data)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  useEffect(() => {
    getStudents()
  }, [getStudents])

  const columns = [
    {
      key: 'code',
      title: 'MSSV',
      render: (r) => (
        <Tooltip title={r.roleName === ROLE.monitor ? 'Lớp Trưởng' : ''}>
          {r.roleName === ROLE.monitor && (
            <i className="fas fa-key me-2 text-secondary" />
          )}
          {r.code}
        </Tooltip>
      ),
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
      key: 'studentClass',
      title: 'Lớp',
      render: (r) => (r.studentClass ? r.studentClass.title : '--'),
    },
    {
      key: 'course',
      title: 'Khóa',
      render: (r) => (r.studentClass ? r.studentClass.course : '--'),
    },
  ]

  const applySearch = useCallback(() => {
    let newStudents = [...students]

    if (search.fullName) {
      newStudents = newStudents.filter(
        (e) =>
          e.fullName.toLowerCase().indexOf(search.fullName.toLowerCase()) > -1,
      )
    }
    if (search.code) {
      newStudents = newStudents.filter((e) => e.code.indexOf(search.code) > -1)
    }

    setFilteredStudents(newStudents)
  }, [search, students])

  useEffect(() => {
    applySearch()
  }, [applySearch])

  return (
    <Card size="small" title={<b>DANH SÁCH SINH VIÊN</b>}>
      <div className="d-flex justify-content-between">
        <div className="d-flex flex-wrap">
          <Input
            onChange={(e) => setSearch({ ...search, code: e.target.value })}
            allowClear
            className="me-2 mb-2"
            style={{ width: 200 }}
            placeholder="MSSV"
          />
          <Input
            onChange={(e) => setSearch({ ...search, fullName: e.target.value })}
            allowClear
            className="me-2 mb-2"
            style={{ width: 200 }}
            placeholder="Họ Tên SV"
          />
        </div>
        <Link to="/student/import">
          <Button type="primary">
            <i className="fas fa-file-import me-2" />
            NHẬP SINH VIÊN
          </Button>
        </Link>
      </div>

      <Table
        columns={columns}
        rowKey={(r) => r.id}
        dataSource={filteredStudents}
        scroll={{ x: 600 }}
        size="small"
      />
    </Card>
  )
}

export default StudentList
