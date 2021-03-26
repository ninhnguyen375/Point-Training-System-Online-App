import React, {Component} from 'react'

class PageLoading extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShow: false,
    }
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)
    this.isVisible = this.isVisible.bind(this)
  }

  show() {
    this.setState({isShow: true})
  }

  hide() {
    this.setState({isShow: false})
  }

  isVisible() {
    const {isShow} = this.state
    return isShow
  }

  render() {
    const {isShow} = this.state
    if (!isShow) {
      return ''
    }

    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    )
  }
}
export default PageLoading