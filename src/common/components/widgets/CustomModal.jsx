import React, {Component} from 'react'
import {Modal} from 'antd'

class CustomModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShow: false,
      content: '',
      options: {},
    }
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)
    this.isVisible = this.isVisible.bind(this)
  }

  show(content, options = {}) {
    this.setState({isShow: true, content, options})
  }

  hide() {
    this.setState({isShow: false})
  }

  clear() {
    console.log('clear')
    this.setState({isShow: false, content: '', options: {}})
  }

  isVisible() {
    const {isShow} = this.state
    return isShow
  }

  render() {
    const {isShow, content, options} = this.state

    return (
      <Modal
        zIndex={options.zIndex}
        visible={isShow}
        footer={null}
        onCancel={() => this.clear()}
        style={{width: '99vw'}}
        {...options}
        bodyStyle={{padding: 10, ...(options.bodyStyle || {})}}
      >
        <div key={options.key || 'default'}>
          {content}
        </div>
      </Modal>
    )
  }
}
export default CustomModal