import React, { Component } from 'react';
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined
} from '@ant-design/icons';
import "./index.css"

export default class SideMenu extends Component {

  state = {
    collapsed: false,
  };

  render() {
    const { Sider } = Layout
    const { Item, SubMenu } = Menu  
    
    return (
      <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
        <div className="logo">全球新闻发布系统</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['sub1']}>
          <SubMenu key="sub1" title="Navigation Two">
            <Item key="1" icon={<UserOutlined />}>
              sub1
            </Item>
          </SubMenu>
          <Item key="2" icon={<VideoCameraOutlined />}>
            nav 2
          </Item>
          <Item key="3" icon={<UploadOutlined />}>
            nav 3
          </Item>
        </Menu>
      </Sider>
    )
  }
}
