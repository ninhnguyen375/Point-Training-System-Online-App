import { Button, Table } from 'antd'
import { any, arrayOf, func, objectOf } from 'prop-types'
import React from 'react'

const ChoosePointTrainingItemId = ({ dataSource, onSubmit }) => (
  <div
    style={{
      height: '77vh',
      overflow: 'auto',
    }}
  >
    <Table
      rowKey={(r) => r.id}
      dataSource={dataSource}
      pagination={false}
      columns={[
        {
          key: 'title',
          title: 'Tiêu Đề',
          render: (r) => (
            <div className={r.class}>
              <div className="me-2 d-inline">{r.title}</div>
            </div>
          ),
        },
        {
          key: 'action',
          title: 'Chọn',
          render: (r) =>
            (r.point !== null && r.point !== undefined) || r.isAnotherItem ? (
              <Button type="primary" onClick={() => onSubmit(r.id)}>
                CHỌN
              </Button>
            ) : (
              ''
            ),
        },
      ]}
    />
  </div>
)

ChoosePointTrainingItemId.propTypes = {
  dataSource: arrayOf(objectOf(any)).isRequired,
  onSubmit: func.isRequired,
}

export default ChoosePointTrainingItemId
