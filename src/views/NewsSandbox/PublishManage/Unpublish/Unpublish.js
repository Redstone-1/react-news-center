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
        buttonType="发布"
        dataSource={dataSource}
        pageTitle="未发布新闻"
      />
    </div>
  )
}

