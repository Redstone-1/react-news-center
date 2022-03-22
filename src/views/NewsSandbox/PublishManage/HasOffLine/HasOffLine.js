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

  return (
    <div>
      <NewsPublish 
        dataSource={dataSource} 
        pageTitle="未发布新闻" 
      />
    </div>
  )
}

