import React from 'react'
import {Card, Breadcrumb} from 'antd'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'

const CustomBreadcrumb = ({items = []}) => (
  <Card bodyStyle={{padding: 10}} style={{marginBottom: 5}}>
    <Breadcrumb>
      {items
            && items.map((item) => (
              <Breadcrumb.Item key={item}>
                <Link to={item.url || ''}>
                  {item.icon ? (
                    <i className={item.icon} />
                  ) : (
                    ''
                  )}
                  {' '}
                  {item.title || ''}
                </Link>
              </Breadcrumb.Item>
            ))}
    </Breadcrumb>
  </Card>
)

CustomBreadcrumb.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default CustomBreadcrumb
