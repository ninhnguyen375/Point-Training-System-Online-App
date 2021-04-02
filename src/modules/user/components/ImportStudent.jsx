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
import { importStudentsService } from '../services'

const ImportStudent = () => {
  // state
  const [students, setStudents] = useState([])
  const [failStudents, setFailStudents] = useState([])

  const history = useHistory()

  const demoData = [
    {
      MSSV: '3117410180',
      'Họ Tên': 'Nguyễn Văn A',
      Email: 'nguyenvana@gmail.com',
      Lớp: 'DCT0000',
      Khoá: 'K17',
    },
    {
      MSSV: '3117410181',
      'Họ Tên': 'Nguyễn Văn B',
      Email: 'nguyenvanb@gmail.com',
      Lớp: 'DCT0000',
      Khoá: 'K17',
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
          MSSV: {
            prop: 'code',
            type: String,
            required: true,
          },
          'Họ Tên': {
            prop: 'fullName',
            type: String,
            required: true,
          },
          Email: {
            prop: 'email',
            type: String,
            required: false,
          },
          Lớp: {
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

      setStudents(rows)
      setFailStudents(
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
      key: 'code',
      title: 'MSSV',
      dataIndex: 'code',
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
      key: 'studentClassTitle',
      title: 'Lớp',
      dataIndex: 'studentClassTitle',
    },
    {
      key: 'studentClassCourse',
      title: 'Khóa',
      dataIndex: 'studentClassCourse',
    },
  ]

  const handleImportStudent = async () => {
    try {
      await importStudentsService(students)

      notification.success({ message: 'Nhập sinh viên thành công' })
      history.push('/student')
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  return (
    <Card size="small" title={<b>NHẬP SINH VIÊN</b>}>
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
            <div className="text-secondary">
              Tải lên danh sách Sinh Viên (.xlsx)
            </div>
          </Dragger>
        </div>
        <div className="col">
          <ExportCSV
            jsonData={demoData}
            fileName="demo_SinhVien"
            type="primary"
          >
            <i className="fas fa-file-download me-2" />
            TẢI XUỐNG FILE MẪU
          </ExportCSV>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-lg-8">
          <Table
            rowKey={(r) => r.code}
            dataSource={students}
            size="small"
            columns={columns}
            scroll={{ x: 600 }}
            bordered
          />
        </div>
        <div className="col-lg-4">
          {failStudents.map((f) => (
            <div className="text-danger" key={f}>
              {f}
            </div>
          ))}
          <Divider />
          <div className="d-flex justify-content-end">
            <b>
              TỔNG:
              {students.length}
            </b>
          </div>
          <div
            className="d-flex justify-content-end mt-3"
            style={{ position: 'sticky', top: 10 }}
          >
            <Tooltip
              disabled={failStudents.length > 0}
              title={
                failStudents.length > 0
                  ? 'Vui lòng xử lý lỗi trên file excel'
                  : ''
              }
            >
              <Popconfirm
                placement="rightTop"
                disabled={failStudents.length > 0 || students.length === 0}
                title="Xác nhận"
                okButtonProps={{ className: 'success' }}
                onConfirm={handleImportStudent}
              >
                <Button
                  disabled={failStudents.length > 0 || students.length === 0}
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
      </div>
    </Card>
  )
}

export default ImportStudent
