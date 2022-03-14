import React, { Component } from 'react';
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  UnlockOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  CloudUploadOutlined 
} from "@ant-design/icons"
import { withRouter } from 'react-router-dom';
import { $get } from '../../api/request';
import "./index.css"

const { Sider } = Layout
const { Item, SubMenu } = Menu  
const user = JSON.parse(localStorage.getItem("token"))
const iconToRoute = {
  "/home": <HomeOutlined />,
  "/user-manage": <UserOutlined />,
  "/right-manage": <UnlockOutlined />,
  "/news-manage": <MessageOutlined />,
  "/audit-manage": <CheckCircleOutlined />,
  "/publish-manage": <CloudUploadOutlined />
}

// 下面两个属性控制菜单在刷新后恢复
const currentUrl = window.location.hash
const currentOpenKeys = ["/" + currentUrl.split("/")[1]]

class SideMenu extends Component {

  state = {
    collapsed: false,
    menuList: [],
    selectedKey: [] // 当前选中的菜单项 key 数组
  };

  // 请求左侧菜单
  componentDidMount () {
    $get("rights?_embed=children", "").then(res => {
      if (res.status === 200) {
        this.setState({
          menuList: res.data
        })
      }
    })
  }

  // 校验菜单是不是页面级路由，是才渲染到左侧
  checkPagePermission = (item) => {
    return item.pagepermisson && user?.role?.rights.includes(item.key)
  }

  // 控制左侧菜单的打开效果：一个打开另一个关闭，永远只能打开一个
  controlMenuOpen = key => {
    if (key.length > 1) {
      key.shift()
    }
  }

  render() {
    return (
      <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
        <div className="logo">全球新闻发布系统</div>
        <Menu 
          onOpenChange={this.controlMenuOpen}
          theme="dark" 
          mode="inline" 
          defaultOpenKeys={currentOpenKeys}
          defaultSelectedKeys={[`${currentUrl.slice(1)}`]}>
            {
              this.renderMenuList(this.state.menuList)
            }
        </Menu>
      </Sider>
    )
  }

  // 拿到 menuList 渲染 menu
  renderMenuList = (menuList) => {
    return menuList.map(item => {
      if (item?.children?.length > 0 && this.checkPagePermission(item)) {
        return (
          <SubMenu 
            title={item.title} 
            key={item.key} 
            icon={iconToRoute[item.key]}>
              {
                this.renderMenuList(item.children)
              }
          </SubMenu>
        )
      }
      return this.checkPagePermission(item) && <Item 
        onClick={() => this.props.history.push(item.key)}
        key={item.key}
        icon={iconToRoute[item.key]}
      >
          {item.title}
      </Item>
    })
  }
}

export default withRouter(SideMenu)
