import { Button, Card, Input, notification, Select, Table, Tooltip } from 'antd'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import handleError from '../../../common/utils/handleError'
import { getStudentClassListService } from '../../student-class/services'
import { ROLE } from '../model'
import { getAllUsersService } from '../services'

const StudentList = () => {
  // state
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [search, setSearch] = useState({})
  const [studentClasses, setStudentClasses] = useState([])
  const [courses, setCourses] = useState([])

  const getStudentClasses = useCallback(async () => {
    try {
      const { data } = await getStudentClassListService()

      setStudentClasses(data.data)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  useEffect(() => {
    getStudentClasses()
  }, [getStudentClasses])

  const getStudents = useCallback(async () => {
    try {
      const { data } = await getAllUsersService()

      setStudents(data.data)
      setFilteredStudents(data.data)
      setCourses(
        data.data.reduce(
          (prev, curr) =>
            prev.includes(curr.studentClass.course)
              ? prev
              : [...prev, curr.studentClass.course],
          [],
        ),
      )
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
      key: 'dateOfBirth',
      title: 'Ngày Sinh',
      render: (r) => moment(r.dateOfBirth).format('DD/MM/YYYY'),
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

    if (search.studentClass) {
      newStudents = newStudents.filter((e) => {
        if (
          e.studentClass &&
          e.studentClass.id &&
          e.studentClass.id === search.studentClass
        ) {
          return true
        }
        return false
      })
    }

    if (search.course) {
      newStudents = newStudents.filter((e) => {
        if (
          e.studentClass &&
          e.studentClass.course &&
          e.studentClass.course === search.course
        ) {
          return true
        }
        return false
      })
    }

    setFilteredStudents(newStudents)
  }, [search, students])

  useEffect(() => {
    applySearch()
  }, [applySearch])

  return (
    <Card size="small" title={<b>DANH SÁCH SINH VIÊN</b>}>
      <div className="d-flex justify-content-between flex-wrap">
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
          <Select
            onChange={(v) => setSearch({ ...search, studentClass: v })}
            className="me-2 mb-2"
            style={{ width: 100 }}
            allowClear
            placeholder="Lớp"
          >
            {studentClasses &&
              studentClasses.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.title}
                </Select.Option>
              ))}
          </Select>
          <Select
            onChange={(v) => setSearch({ ...search, course: v })}
            className="me-2 mb-2"
            style={{ width: 100 }}
            allowClear
            placeholder="Khóa"
          >
            {courses &&
              courses
                .sort(
                  (a, b) =>
                    parseInt(b.replace(/\D+/g, ''), 10) -
                    parseInt(a.replace(/\D+/g, ''), 10),
                )
                .map((c) => (
                  <Select.Option key={c} value={c}>
                    {c}
                  </Select.Option>
                ))}
          </Select>
          <Button onClick={getStudents} className="me-2 mb-2">
            <i className="fas fa-sync me-2" />
            LÀM MỚI
          </Button>
        </div>
        <Link to="/student/import">
          <Button className="mb-2" type="primary">
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
