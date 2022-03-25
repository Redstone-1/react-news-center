import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import Home from '../views/NewsSandbox/Home/Home';
import UserList from '../views/NewsSandbox/UserManage/UserList';
import RoleList from '../views/NewsSandbox/RightManage/RoleList/RoleList';
import RightList from '../views/NewsSandbox/RightManage/RightList/RightList';
import NotPermission from '../views/NewsSandbox/NotPermission/NotPermission';
import NewsAdd from '../views/NewsSandbox/NewsManage/NewsAdd/NewsAdd';
import NewsDraft from '../views/NewsSandbox/NewsManage/NewsDraft/NewsDraft';
import NewsCategory from '../views/NewsSandbox/NewsManage/NewsCategory/NewsCategory';
import AuditNews from '../views/NewsSandbox/AuditManage/AuditNews/AuditNews';
import AuditList from '../views/NewsSandbox/AuditManage/AuditList/AuditList';
import Unpublish from '../views/NewsSandbox/PublishManage/Unpublish/Unpublish';
import Publish from '../views/NewsSandbox/PublishManage/Publish/Publish';
import HasOffLine from '../views/NewsSandbox/PublishManage/HasOffLine/HasOffLine';
import NewsPreview from '../views/NewsSandbox/NewsManage/NewsDraft/NewsPreview/NewsPreview';
import NewsUpdate from '../views/NewsSandbox/NewsManage/NewsDraft/NewsUpdate/NewsUpdate';
import { $get } from '../api/request';

const localRouterMap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/preview/:id": NewsPreview,
  "/news-manage/update/:id": NewsUpdate,
  "/news-manage/category": NewsCategory,
  "/audit-manage/audit": AuditNews,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublish,
  "/publish-manage/published": Publish,
  "/publish-manage/sunset": HasOffLine,
}

function MainRouter(props) {
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
    <Spin size='large' tip="加载中..." spinning={props.isLoading}>
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
    </Spin>
  )
}

const mapStateToProps = (state) => {
  const { GlobalLoading: { isLoading } } = state
  return {
    isLoading
  }
}

export default connect(mapStateToProps)(MainRouter)