import React, { useState, useEffect, useRef } from 'react'
import propTypes from 'prop-types'
import { Layout, Menu, Dropdown, Tag, notification } from 'antd'

import { useHistory, useLocation } from 'react-router-dom'
import SubMenu from 'antd/lib/menu/SubMenu'
import { useDispatch, useSelector } from 'react-redux'
import siderMenu from '../constants/siderMenu'
import userIcon from '../../assets/images/user.svg'
import { clearAll, setSiderMenu } from '../actions'
import { MODULE_NAME as MODULE_USER, ROLE } from '../../modules/user/model'
import { configs } from '../../configs/dev'

const { Header, Sider, Content } = Layout

const MainLayout = ({ children }) => {
  // store
  const moduleUser = useSelector((state) => state[MODULE_USER])
  const { selectedKeys, openKeys } = useSelector(
    (state) => state.common.layout.siderMenu,
  )

  // states
  const [collapsed, setCollapsed] = useState(false)

  // ref
  const contentRef = useRef()

  const { profile } = moduleUser
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    if (contentRef && contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [contentRef, children])

  useEffect(() => {
    const splitArr = location.pathname.split('/')
    let selectedArr = []
    if (splitArr.length >= 2) {
      selectedArr = [location.pathname.slice(1)]
    } else {
      selectedArr = [location.pathname.split('/')[1]]
    }
    dispatch(
      setSiderMenu({
        selectedKeys: selectedArr,
        openKeys,
      }),
    )
  }, [location, dispatch, openKeys])

  const handleToggle = () => {
    setCollapsed(!collapsed)
  }

  const handleLogout = () => {
    dispatch(clearAll())
    notification.success({ message: 'Đăng xuất', description: 'Thành công' })
  }

  const handleClick = (value) => {
    dispatch(
      setSiderMenu({
        selectedKeys: [value.key],
        openKeys,
      }),
    )
    history.push(`/${value.key}`)
  }

  const userRole = profile ? profile.roleName : ROLE.student
  const userName = profile ? profile.fullName : 'user'

  const renderMenu = (menus = []) =>
    menus.map((item) => {
      if (item.itemGroup) {
        return (
          <Menu.ItemGroup key={item.itemGroup} title={item.itemGroup}>
            {item.items.map((i) =>
              i.children ? (
                <SubMenu
                  className="main-layout__sider__menu__submenu"
                  key={i.key}
                  title={
                    <span>
                      {i.title}
                      {' '}
                      <i className={`${i.iconClass} icon`} />
                    </span>
                  }
                >
                  {i.children.map((child) => (
                    <Menu.Item key={child.key}>{child.title}</Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item key={i.key}>
                  <div className="main-layout__menu-item">
                    <span>
                      {i.title}
                      {' '}
                    </span>
                    <i className={i.iconClass} />
                  </div>
                </Menu.Item>
              ),
            )}
          </Menu.ItemGroup>
        )
      }
      return item.items.map((i) =>
        i.children ? (
          <SubMenu
            key={i.key}
            className="main-layout__sider__menu__submenu"
            title={
              <span>
                {i.title}
                {' '}
                <i className={`${i.iconClass} icon`} />
              </span>
            }
          >
            {i.children.map((child) => (
              <Menu.Item key={child.key}>{child.title}</Menu.Item>
            ))}
          </SubMenu>
        ) : (
          <Menu.Item key={i.key}>
            <div className="main-layout__menu-item">
              <span>{i.title}</span>
              {' '}
              <i className={i.iconClass} />
            </div>
          </Menu.Item>
        ),
      )
    })

  return (
    <Layout className="main-layout">
      <Sider
        breakpoint="md"
        collapsedWidth="0"
        onCollapse={handleToggle}
        collapsed={collapsed}
        theme="light"
        className="main-layout__sider"
        width={255}
      >
        <div
          style={{
            height: 80,
            margin: '5px 0 5px 0',
            boxShadow: '0 0 5px 1px lightgrey',
            borderRadius: '0 5px 5px 0',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {!collapsed ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                width: '100%',
              }}
            >
              <div
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <img alt="logo" src={configs.LogoURL} height={48} />
              </div>
            </div>
          ) : null}
        </div>
        <Menu
          onOpenChange={(keys) =>
            dispatch(
              setSiderMenu({
                selectedKeys,
                openKeys: keys,
              }),
            )}
          onClick={handleClick}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          theme="light"
          mode="inline"
          className="main-layout__sider__menu"
        >
          {renderMenu(siderMenu[userRole])}
        </Menu>
      </Sider>
      <Layout>
        <Header className="main-layout__header">
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu style={{ width: 200 }}>
                <Menu.Item>
                  <div className="d-flex" style={{ paddingBottom: 5 }}>
                    <img
                      src={userIcon}
                      alt="avatar"
                      width={35}
                      style={{ marginRight: 10, paddingTop: 10 }}
                    />

                    <div>
                      <span>{userName || ''}</span>
                      <br />
                      <Tag color="darkslateblue">{userRole}</Tag>
                    </div>
                  </div>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  onClick={() => {
                    dispatch(
                      setSiderMenu({
                        selectedKeys,
                        openKeys: [...openKeys, 'data'],
                      }),
                    )
                    history.push('/profile')
                  }}
                >
                  <i className="fas fa-user mr-1" />
                  {' '}
                  Thông tin cá nhân
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt mr-1" />
                  {' '}
                  Đăng xuất
                </Menu.Item>
              </Menu>
            }
          >
            <div className="main-layout__dropdown-profile">
              <img src={userIcon} alt="avatar" width={35} />
              <i className="fas fa-caret-down" />
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            overflow: 'scroll',
            minWidth: '260px',
          }}
          ref={contentRef}
        >
          <div className="main-layout__content">{children}</div>
        </Content>
      </Layout>
    </Layout>
  )
}

MainLayout.propTypes = {
  children: propTypes.node.isRequired,
}

export default MainLayout
