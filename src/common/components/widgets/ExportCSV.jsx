import React from 'react'
import {Button} from 'antd'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import PropTypes from 'prop-types'

const ExportCSV = ({jsonData, fileName, children, style, ...props}) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(jsonData)
    const wb = {Sheets: {data: ws}, SheetNames: ['data']}
    const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'})
    const data = new Blob([excelBuffer], {type: fileType})
    FileSaver.saveAs(data, fileName + fileExtension)
  }
  return (
    <Button onClick={exportToCSV} {...props}>
      {children}
    </Button>
  )
}
ExportCSV.propTypes = {
  jsonData: PropTypes.arrayOf(PropTypes.any).isRequired,
  style: PropTypes.objectOf(PropTypes.any),
  fileName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

ExportCSV.defaultProps = {
  style: {},
}
export default ExportCSV
