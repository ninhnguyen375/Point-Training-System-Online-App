import React from 'react'
import { Button } from 'antd'
import * as XLSX from 'xlsx'
import PropTypes from 'prop-types'

const ExportCSV = ({ jsonData, fileName, children, style, ...props }) => {
  const fileExtension = '.xlsx'

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(jsonData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    XLSX.writeFile(wb, fileName + fileExtension)
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
