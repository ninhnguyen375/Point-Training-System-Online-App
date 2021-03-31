import {
  Button,
  Card,
  notification,
  Table,
} from 'antd'
import React, {useCallback, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import handleError from '../../../common/utils/handleError'
import {getStudentClassListService} from '../services'

const StudentClassList = () => {
  // state
  const [studentClasses, setStudentClasses] = useState([])

  const getStudentClassList = useCallback(async () => {
    try {
      const {data} = await getStudentClassListService()

      setStudentClasses(data.data)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  useEffect(() => {
    getStudentClassList()
  }, [getStudentClassList])

  const columns = [
    {
      key: 'title',
      title: 'Lớp',
      dataIndex: 'title',
    },
    {
      key: 'monitor',
      title: 'Lớp Trưởng',
      render: (r) => r.monitor ? (
        <div>
          <div>{r.monitor.fullName}</div>
          <div>{r.monitor.email}</div>
        </div>
      ) : '--',
    },
    {
      key: 'lecturer',
      title: 'Cố Vấn Học Tập',
      render: (r) => r.lecturer ? (
        <div>
          <div>{r.lecturer.fullName}</div>
          <div>{r.lecturer.email}</div>
        </div>
      ) : '--',
    },
    {
      key: 'course',
      title: 'Khóa',
      dataIndex: 'course',
    },
  ]

  return (
    <Card size="small" title={<b>DANH SÁCH LỚP</b>}>
      <div className="d-flex justify-content-end">
        <Link to="/student-class/import">
          <Button type="primary">
            <i className="fas fa-file-import me-2" />
            NHẬP LỚP
          </Button>
        </Link>
      </div>

      <Table
        columns={columns}
        rowKey={(r) => r.id}
        dataSource={studentClasses}
        size="small"
        scroll={{x:600}}
        className="mt-3"
      />
    </Card>
  )
}

export default StudentClassList
