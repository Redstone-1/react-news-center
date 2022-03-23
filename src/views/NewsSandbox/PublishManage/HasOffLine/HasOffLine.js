import React, { useEffect, useState } from 'react';
import NewsPublish from '../../../../components/PublishManage/NewsPublish';
import { $get } from '../../../../api/request';
const user = JSON.parse(localStorage.getItem("token"))

export default function HasOffline(props) {

  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    getAuditListData()
  }, [])

  const getAuditListData = () => {
    const { username } = user
    $get(`/news?author=${username}&publishState=3&_expand=category`).then(res => {
      console.log("已发布", res.data);
      setDataSource(res.data)
    })
  }

  const getActionRes = (state) => {
    if (state) {
      getAuditListData()
    } 
  }

  return (
    <div>
      <NewsPublish
        getActionRes={getActionRes}
        buttonType="删除"
        dataSource={dataSource}
        pageTitle="已下线新闻"
      />
    </div>
  )
}

