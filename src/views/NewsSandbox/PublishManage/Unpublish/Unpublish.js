import React, { useEffect, useState } from 'react';
import NewsPublish from '../../../../components/PublishManage/NewsPublish';
import { $get } from '../../../../api/request';
const user = JSON.parse(localStorage.getItem("token"))

export default function Unpublish(props) {

  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    getAuditListData()
  }, [])

  const getAuditListData = () => {
    const { username } = user
    $get(`/news?author=${username}&publishState=1&_expand=category`).then(res => {
      console.log("未发布", res.data);
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

