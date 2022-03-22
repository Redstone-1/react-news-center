import React, { useEffect, useState } from 'react';
import { PageHeader, Descriptions, Tag } from 'antd';
import moment from 'moment';
import { $get } from '../../../../../api/request';
import './NewsPreview.css'

export default function NewsPreview(props) {
  const [newsDetail, setNewsDetail] = useState(null)

  useEffect(() => {
    $get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
      .then(res => {
        console.log('news', res.data);
        setNewsDetail(res.data)
      })
  }, [props.match.params.id])

  const auditList = ['未审核', '审核中', '已通过', '未通过']
  const publicList = ['未发布', '待发布', '已上线', '未通过']

  return (
    <div>
      {
        !!newsDetail && <>
          <PageHeader
            onBack={() => window.history.back()}
            title={newsDetail.title}
            subTitle={newsDetail.categoryId}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">
                <b style={{color: "tomato"}}>{ newsDetail.author }</b>
              </Descriptions.Item>

              <Descriptions.Item label="区域">
                <Tag color="deepskyblue">{newsDetail.region === "" ? "全球" : newsDetail.region}</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="访问数量"><b style={{color: "#EC7700"}}>{newsDetail.view}</b></Descriptions.Item>
              
              <Descriptions.Item label="创建时间">
                <b style={{color: "tomato"}}>{ moment(newsDetail.createTime).format("YYYY-MM-DD HH:mm:ss") }</b>
              </Descriptions.Item>

              <Descriptions.Item label="审核状态">
                {
                  <b>{auditList[newsDetail.auditState]}</b>
                }
              </Descriptions.Item>
             
              <Descriptions.Item label="评论数量"><b style={{color: "#EC7700"}}>{0}</b></Descriptions.Item>

              <Descriptions.Item label="发布时间">
                <b style={{color: "tomato"}}>{ moment(newsDetail.publishTime).format("YYYY-MM-DD HH:mm:ss") }</b>
              </Descriptions.Item>

              <Descriptions.Item label="发布状态">
                {
                  <b style={{}}>{publicList[newsDetail.publishState]}</b>
                }
              </Descriptions.Item>

              <Descriptions.Item label="点赞数量"><b style={{color: "#EC7700"}}>{newsDetail.star}</b></Descriptions.Item>
            </Descriptions>
          </PageHeader>
        </>
      }
      {
        !!newsDetail && <div className='content' dangerouslySetInnerHTML={{
            __html: newsDetail?.content
          }}>
        </div>
      }
    </div>
  )
}
