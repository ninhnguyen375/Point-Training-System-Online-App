import { Button, Divider, Form, Input, InputNumber } from 'antd'
import { bool, func, number, objectOf, string } from 'prop-types'
import React from 'react'

const AddGroupForm = ({ onSubmit, isGroup, editMode, data }) => {
  const [form] = Form.useForm()

  if (editMode) {
    const titleSplit = isGroup
      ? data.title.split(' _ ')
      : data.title.split('. ')

    form.setFieldsValue({
      ...data,
      title: titleSplit.length === 1 ? titleSplit[0] : titleSplit[1],
    })
  }

  return (
    <Form
      layout="vertical"
      onFinish={(v) => onSubmit(v)}
      className="container-fluid"
      form={form}
    >
      <Form.Item
        label="Tiêu đề mục:"
        name="title"
        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề mục' }]}
      >
        <Input placeholder="Nhập tiêu đề mục" />
      </Form.Item>
      {((editMode && data.point !== null) || !editMode) && (
        <Form.Item
          label={isGroup ? 'Điểm tối đa:' : 'Điểm'}
          name={isGroup ? 'maxPoint' : 'point'}
          rules={[{ required: true, message: 'Vui lòng nhập Điểm' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder={isGroup ? 'Điểm tối đa' : 'Điểm'}
            min={-100}
            max={100}
          />
        </Form.Item>
      )}

      <Divider />
      <div className="d-flex justify-content-end">
        <Button htmlType="submit" type="primary">
          {editMode ? 'CẬP NHẬT' : 'THÊM'}
        </Button>
      </div>
    </Form>
  )
}

AddGroupForm.propTypes = {
  onSubmit: func.isRequired,
  isGroup: bool.isRequired,
  editMode: bool,
  data: objectOf({
    title: string,
    point: number,
    maxPoint: number,
  }),
}

AddGroupForm.defaultProps = {
  editMode: false,
  data: {},
}

export default AddGroupForm
