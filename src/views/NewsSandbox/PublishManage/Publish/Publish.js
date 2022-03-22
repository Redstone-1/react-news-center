import React, { useEffect, useState } from 'react';
import NewsPublish from '../../../../components/PublishManage/NewsPublish';
import { $get } from '../../../../api/request';
const user = JSON.parse(localStorage.getItem("token"))

export default function Publish(props) {

  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    getAuditListData()
  }, [])

  const getAuditListData = () => {
    const { username } = user
    $get(`/news?author=${username}&publishState=2&_expand=category`).then(res => {
      console.log("审核列表", res.data);
      setDataSource(res.data)
    })
  }

  return (
    <div>
      <NewsPublish 
        dataSource={dataSource} 
        pageTitle="已发布新闻" 
      />
    </div>
  )
}

