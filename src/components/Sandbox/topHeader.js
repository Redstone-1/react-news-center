import React, { Component } from 'react';
import { Layout, Menu, Dropdown, Avatar } from "antd";
import { withRouter } from 'react-router-dom';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';

class TopHeader extends Component {

  constructor (props) {
    super(props)
    this.state = {
      collapsed: false,
      user: JSON.parse(localStorage.getItem("token"))
    }
  }

  menu = () => {
    const { role } = this.state.user
    return <Menu>
      <Menu.Item key="1">
        { role?.roleName }
      </Menu.Item>
      <Menu.Item key="2" danger onClick={() => this.logout()}>
        退出
      </Menu.Item>
    </Menu>
  }

  logout = async () => {
    await localStorage.removeItem("token")
    this.props.history.replace("/login")
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
          <span style={{marginRight: "10px"}}>
            {
              <>
                <span>欢迎回来</span>
                <b style={{ color: "tomato", marginLeft: "6px" }}>{this.state?.user?.username}</b>
              </>
            }
          </span>
          <Dropdown overlay={this.menu} placement="bottomRight">
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

export default withRouter(TopHeader)
