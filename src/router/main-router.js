import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from '../views/NewsSandbox/Home/Home';
import UserList from '../views/NewsSandbox/UserManage/UserList';
import RoleList from '../views/NewsSandbox/RoleManage/RoleList';
import RightList from '../views/NewsSandbox/RightManage/RightList';
import NotPermission from '../views/NewsSandbox/NotPermission/NotPermission';
import NewsAdd from '../views/NewsSandbox/NewsAdd/NewsAdd';
import NewsDraft from '../views/NewsSandbox/NewsDraft/NewsDraft';
import NewsCategory from '../views/NewsSandbox/NewsCategory/NewsCategory';
import Audit from '../views/NewsSandbox/Audit/Audit'
import AuditList from '../views/NewsSandbox/AuditList/AuditList'
import Unpublish from '../views/NewsSandbox/Unpublish/Unpublish'
import Publish from '../views/NewsSandbox/Publish/Publish'
import HasOffLine from '../views/NewsSandbox/HasOffLine/HasOffLine'

const localRouterMap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/category": NewsCategory,
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublish,
  "/publish-manage/published": Publish,
  "/publish-manage/sunset": HasOffLine,
}

export default function MainRouter(props) {
  return (
    <Switch>
      <Route path="/home" component={Home} />
      <Route path="/user-manage/list" component={UserList} />
      <Route path="/right-manage/role/list" component={RoleList} />
      <Route path="/right-manage/right/list" component={RightList} />
      <Redirect from="/" to="/home" exact />
      <Route path="*" component={NotPermission} />
    </Switch>
  )
}
