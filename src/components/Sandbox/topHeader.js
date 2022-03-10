import React, { Component } from 'react';
import { Layout, Menu, Dropdown, Avatar } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';

const menu = (
  <Menu>
    <Menu.Item>
      11111111111
    </Menu.Item>
    <Menu.Item danger>
      退出
    </Menu.Item>
  </Menu>
);


export default class TopHeader extends Component {

  constructor (props) {
    super(props)
    this.state = {
      collapsed: false
    }
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    const { Header } = Layout

    return (
      <Header style={{ 
        padding: "0 16px 0 16px", 
        backgroundColor: "#fff"
      }}>
        {
          this.state.collapsed
          ? <MenuUnfoldOutlined onClick={this.toggle} /> 
          : <MenuFoldOutlined onClick={this.toggle} />
        }
        <div style={{float: "right"}}>
          <span style={{marginRight: "10px"}}>{`欢迎回来`}</span>
          <Dropdown overlay={menu} placement="bottomRight">
            <Avatar
            style={{transform: "translateY(-4px)"}} 
              size="small" 
              src="https://joeschmoe.io/api/v1/random" 
              alt="头像" 
              shape="square"
              gap={4} />
          </Dropdown>
        </div>
      </Header>
    )
  }
}
