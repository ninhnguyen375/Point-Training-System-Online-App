import {
  Button,
  Card,
  Divider,
  notification,
  Popconfirm,
  Table,
  Tooltip,
} from 'antd'
import Dragger from 'antd/lib/upload/Dragger'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import readExcelFile from 'read-excel-file'
import ExportCSV from '../../../common/components/widgets/ExportCSV'
import handleError from '../../../common/utils/handleError'
import { importStudentClassesService } from '../services'

const ImportStudentClass = () => {
  // state
  const [studentClasses, setStudentClasses] = useState([])
  const [failStudentClasses, setFailStudentClasses] = useState([])

  const history = useHistory()

  const demoData = [
    {
      'Họ Tên Lớp Trưởng': 'Sinh viên 1',
      'Mã Lớp Trưởng': '3117410212',
      'Email Lớp Trưởng': '',
      'Họ Tên CVHT': 'Giang Vien A',
      'Mã CVHT': '23456',
      'Email CVHT': 'giangviena@gmail.com',
      'Mã Lớp': 'DCT0012',
      Khoá: '17',
    },
  ]

  const handleReadFile = async (file) => {
    if (!file) {
      return
    }

    window.PageLoading.show()

    try {
      const reader = await readExcelFile(file, {
        schema: {
          'Mã Lớp Trưởng': {
            prop: 'monitorCode',
            type: String,
            required: true,
          },
          'Họ Tên Lớp Trưởng': {
            prop: 'monitorFullName',
            type: String,
            required: true,
          },
          'Email Lớp Trưởng': {
            prop: 'monitorEmail',
            type: String,
            required: false,
          },
          'Mã CVHT': {
            prop: 'lecturerCode',
            type: String,
            required: true,
          },
          'Họ Tên CVHT': {
            prop: 'lecturerFullName',
            type: String,
            required: true,
          },
          'Email CVHT': {
            prop: 'lecturerEmail',
            type: String,
            required: false,
          },
          'Mã Lớp': {
            prop: 'studentClassTitle',
            type: String,
            required: true,
          },
          Khóa: {
            prop: 'studentClassCourse',
            type: String,
            required: true,
          },
        },
      })
      const { errors } = reader
      let { rows } = reader

      rows = rows.map((r, i) => ({ ...r, row: i + 2 }))

      setStudentClasses(rows)
      setFailStudentClasses(
        errors.map(
          (e) => `vui lòng kiểm tra lại dòng ${e.row + 1}, cột "${e.column}".`,
        ),
      )
    } catch (err) {
      handleError(err, null, notification)
    }

    window.PageLoading.hide()
  }

  const handleChangeFileEvent = async (file) => {
    await handleReadFile(file.file.originFileObj)
  }

  const columns = [
    {
      key: 'row',
      title: 'Dòng',
      dataIndex: 'row',
    },
    {
      key: 'monitorCode',
      title: 'Mã Lớp Trưởng',
      dataIndex: 'monitorCode',
    },
    {
      key: 'monitorFullName',
      title: 'Họ Tên Lớp Trưởng',
      dataIndex: 'monitorFullName',
    },
    {
      key: 'monitorEmail',
      title: 'Email Lớp Trưởng',
      dataIndex: 'monitorEmail',
    },
    {
      key: 'lecturerCode',
      title: 'Mã CVHT',
      dataIndex: 'lecturerCode',
    },
    {
      key: 'lecturerFullName',
      title: 'Họ Tên CVHT',
      dataIndex: 'lecturerFullName',
    },
    {
      key: 'lecturerEmail',
      title: 'Email CVHT',
      dataIndex: 'lecturerEmail',
    },
    {
      key: 'studentClassTitle',
      title: 'Mã Lớp',
      dataIndex: 'studentClassTitle',
    },
    {
      key: 'studentClassCourse',
      title: 'Khóa',
      dataIndex: 'studentClassCourse',
    },
  ]

  const handleImportStudentClass = async () => {
    try {
      await importStudentClassesService(studentClasses)

      notification.success({ message: 'Nhập lớp thành công' })
      history.push('/student-class')
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  return (
    <Card size="small" title={<b>NHẬP LỚP</b>}>
      <div className="row">
        <div className="col-lg-4 mb-2">
          <Dragger
            showUploadList={false}
            customRequest={({ onSuccess }) => onSuccess()}
            onChange={handleChangeFileEvent}
            fileList={[]}
            accept=".xlsx,.xls"
          >
            <i className="fas fa-cloud-upload-alt fs-3 text-secondary" />
            <div className="text-secondary">Tải lên danh sách Lớp (.xlsx)</div>
          </Dragger>
        </div>
        <div className="col">
          <ExportCSV jsonData={demoData} fileName="demo_Lop" type="primary">
            <i className="fas fa-file-download me-2" />
            TẢI XUỐNG FILE MẪU
          </ExportCSV>
        </div>
      </div>

      <div className="row mt-3">
        <div>
          <Table
            rowKey={(r) => r.code}
            dataSource={studentClasses}
            size="small"
            columns={columns}
            scroll={{ x: 600 }}
            bordered
          />
        </div>
      </div>
      <div>
        {failStudentClasses.map((f) => (
          <div className="text-danger" key={f}>
            {f}
          </div>
        ))}
        <Divider />
        <div className="d-flex justify-content-end">
          <b>
            TỔNG:
            {studentClasses.length}
          </b>
        </div>
        <div
          className="d-flex justify-content-end mt-3"
          style={{ position: 'sticky', top: 10 }}
        >
          <Tooltip
            disabled={failStudentClasses.length > 0}
            title={
              failStudentClasses.length > 0
                ? 'Vui lòng xử lý lỗi trên file excel'
                : ''
            }
          >
            <Popconfirm
              placement="rightTop"
              disabled={
                failStudentClasses.length > 0 || studentClasses.length === 0
              }
              title="Xác nhận"
              okButtonProps={{ className: 'success' }}
              onConfirm={handleImportStudentClass}
            >
              <Button
                disabled={
                  failStudentClasses.length > 0 || studentClasses.length === 0
                }
                size="large"
                className="success"
                type="primary"
              >
                <i className="fas fa-file-import me-2" />
                NHẬP VÀO HỆ THỐNG
              </Button>
            </Popconfirm>
          </Tooltip>
        </div>
      </div>
    </Card>
  )
}

export default ImportStudentClass
