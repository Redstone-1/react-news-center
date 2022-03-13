import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import TopHeader from '../../components/Sandbox/TopHeader';
import SideMenu from '../../components/Sandbox/SideMenu';
import Home from './Home/Home';
import UserList from './UserManage/UserList';
import RoleList from './RoleManage/RoleList';
import RightList from './RightManage/RightList';
import NotPermission from './NotPermission/NotPermission';
import { Layout } from 'antd';
import "./NewsSandbox.css";

export default class NewsSandbox extends Component {
  render() {
    const { Content } = Layout
    return (
      <Layout>
        <SideMenu></SideMenu>
        <Layout className="site-layout">
          <TopHeader></TopHeader>
          <Content
            style={{
              margin: '16px 16px',
              padding: 16,
              minHeight: 280,
              backgroundColor: "#fff",
              overflow: "auto"
            }}
          >
            <Switch>
              <Route path="/home" component={Home} />
              <Route path="/user-manage/list" component={UserList} />
              <Route path="/right-manage/role/list" component={RoleList} />
              <Route path="/right-manage/right/list" component={RightList} />
              <Redirect from="/" to="/home" exact />
              <Route path="*" component={NotPermission} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

