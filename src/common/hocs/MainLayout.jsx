import React, { useState, useEffect } from 'react'
import propTypes from 'prop-types'
import { Layout, Menu, Dropdown, Tag, notification } from 'antd'

import { useHistory, useLocation } from 'react-router-dom'
import SubMenu from 'antd/lib/menu/SubMenu'
import { useDispatch, useSelector } from 'react-redux'
import siderMenu from '../constants/siderMenu'
import userIcon from '../../assets/images/user.svg'
import logo from '../../assets/images/sgu-logo_cntt_small.png'
import { clearAll, setSiderMenu } from '../actions'
import { MODULE_NAME as MODULE_USER, ROLE } from '../../modules/user/model'
import UpdatePasswordForm from '../../modules/user/components/UpdatePasswordForm'
import handleError from '../utils/handleError'
import { updateEmployeesService } from '../../modules/user/services'

const { Header, Sider, Content } = Layout

const MainLayout = ({ children }) => {
  // store
  const moduleUser = useSelector((state) => state[MODULE_USER])
  const { selectedKeys, openKeys } = useSelector(
    (state) => state.common.layout.siderMenu,
  )

  // states
  const [collapsed, setCollapsed] = useState(false)

  const { profile } = moduleUser
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    dispatch(
      setSiderMenu({
        selectedKeys: location.pathname.slice(1),
        openKeys,
      }),
    )
  }, [location, dispatch, openKeys])

  const handleToggle = () => {
    setCollapsed(!collapsed)
  }

  const handleLogout = () => {
    history.push('/')
    dispatch(clearAll())
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

  const handleOpenChange = (keys) =>
    dispatch(
      setSiderMenu({
        selectedKeys,
        openKeys: keys,
      }),
    )

  const userRole = profile.isMonitor ? ROLE.monitor : profile.roleName
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
                      <span className="me-2">{i.title}</span>
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
                <span className="me-2">{i.title}</span>
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
                <span className="me-2">{i.title}</span>
                <i className={`${i.iconClass} icon`} />
              </span>
            </div>
          </Menu.Item>
        ),
      )
    })

  const updatePassword = async (values) => {
    try {
      await updateEmployeesService({
        userCode: profile.code,
        userEmail: values.email,
        userRoleName: profile.roleName,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })

      notification.success({
        message: 'Thay đổi mật khẩu',
        description: 'Thành công',
      })

      window.Modal.clear()
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const handleClickChangePassword = () => {
    window.Modal.show(
      <UpdatePasswordForm onSubmit={updatePassword} email={profile.email} />,
      {
        title: <b>THAY ĐỔI MẬT KHẨU</b>,
        key: 'change-password-modal',
      },
    )
  }

  const headerDropdown = (
    <Dropdown
      trigger={['click']}
      overlay={
        <Menu style={{ width: 200 }}>
          <Menu.Item onClick={handleClickChangePassword}>
            <i className="fas fa-key me-2" />
            Đổi mật khẩu
          </Menu.Item>
          <Menu.Item onClick={handleLogout}>
            <i className="fas fa-sign-out-alt me-2" />
            Đăng xuất
          </Menu.Item>
        </Menu>
      }
    >
      <div className="main-layout__dropdown-profile">
        <img src={userIcon} alt="avatar" />
        <div style={{ lineHeight: 1, fontSize: '0.9em' }}>
          <div>{userName || ''}</div>
          <Tag className="mt-1" color="geekblue">
            {userRole}
          </Tag>
        </div>
        <i className="fas fa-caret-down ms-2" />
      </div>
    </Dropdown>
  )

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
        <div className="main-layout__sider__logo">
          <img alt="logo" src={logo} height={56} />
        </div>
        <Menu
          onOpenChange={handleOpenChange}
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
        <Header className="main-layout__header">{headerDropdown}</Header>
        <Content
          style={{
            overflow: 'scroll',
            minWidth: '260px',
            background: '#f1f1f1',
          }}
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
