import React, { Component } from 'react'
import { Form, Button, Input } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import "./login.css"

const { Item } = Form

export default class Login extends Component {


  onFinish = (values) => {
    console.log(values)
  }

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  render() {
    return (
      <div className="login">
        <div className="login-wrapper">
        <div className="login-title">新闻发布管理中心</div>
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 24,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            autoComplete="off"
          >
            <Item
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} type="text" placeholder="请输入用户名" />
            </Item>

            <Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="请输入密码" />
            </Item>

            <Item
              wrapperCol={{
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                <b>登录</b>
              </Button>
            </Item>
          </Form>
        </div>
      </div>
    )
  }
}

