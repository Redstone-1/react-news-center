import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import TopHeader from '../../components/Sandbox/TopHeader';
import SideMenu from '../../components/Sandbox/SideMenu';
import Home from './Home/Home';
import UserList from './Home/UserList';
import RoleList from './Home/RoleList';
import RightList from './Home/RightList';
import NotPermission from './NotPermission/NotPermission';

export default class NewsSandbox extends Component {
  render() {
    return (
      <div>
        <SideMenu></SideMenu>
        <TopHeader></TopHeader>

        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/user-manage-list" component={UserList} />
          <Route path="/right-manage/role/list" component={RoleList} />
          <Route path="/right-manage/right/list" component={RightList} />
          <Redirect from="/" to="/home" exact />
          <Route path="*" component={NotPermission} />
        </Switch>
      </div>
    )
  }
}

