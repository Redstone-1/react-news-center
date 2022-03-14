import React, { Component } from 'react'
import { Form, Button, Input, message, Spin } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { $get } from '../../api/request';
import "./login.css"

const { Item } = Form

export default class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  onFinish = async (values) => {
    this.setState({
      loading: true
    })
    const { username, password } = values
    const res = await $get(`/users?username=${username}&password=${password}&roleState=true&_expand=role`)
    if (res.data.length === 0) {
      message.error("用户名或密码错误！")
      this.setState({
        loading: false
      })
    } else {
      console.log("res", res);
      localStorage.setItem("token", JSON.stringify(res.data[0]))
      this.props.history.push("/home")
      message.success("登录成功")
    }
  }

  render() {
    return (
      <Spin spinning={this.state.loading} tip="登录中...">
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
            >
              <Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                  {
                    max: 12,
                    min: 2,
                    message: '用户名长度为 2 到 12',
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
                    message: '请输入密码!',
                  },
                  {
                    max: 12,
                    min: 3,
                    message: '密码长度为 3 到 12',
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
      </Spin>
      
    )
  }
}

