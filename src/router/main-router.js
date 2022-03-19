import React, { useEffect, useState } from 'react';
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
import NewsPreview from '../views/NewsSandbox/NewsPreview/NewsPreview';

import { $get } from '../api/request';

const localRouterMap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/preview/:id": NewsPreview,
  "/news-manage/category": NewsCategory,
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublish,
  "/publish-manage/published": Publish,
  "/publish-manage/sunset": HasOffLine,
}

export default function MainRouter(props) {
  const [routesList, setRoutesList] = useState([])
  const { role: {rights} } = JSON.parse(localStorage.getItem("token"))

  useEffect(() => {
    Promise.all([
      $get("/rights"),
      $get("/children")
    ]).then(res => {
      if (res && res.length > 0) {
        console.log("res", res);
        setRoutesList([...res[0].data, ...res[1].data])
      }
    })
  }, [])


  const checkRoute = (item) => {
    return localRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
  }

  const checkUserPermission = (item) => {
    return rights.includes(item.key)
  }
  
  return (
    <Switch>
      {
        routesList.map(item => {
          if (checkRoute(item) && checkUserPermission(item)) {
            return <Route 
              exact 
              path={item.key} 
              key={item.key} 
              component={localRouterMap[item.key]} 
            />
          } else {
            return null
          }
        })
      }
      {/* <Route path="/home" component={Home} />
      <Route path="/user-manage/list" component={UserList} />
      <Route path="/right-manage/role/list" component={RoleList} />
      <Route path="/right-manage/right/list" component={RightList} /> */}
      <Redirect from="/" to="/home" exact />
      <Route path="*" component={NotPermission} />
    </Switch>
  )
}
