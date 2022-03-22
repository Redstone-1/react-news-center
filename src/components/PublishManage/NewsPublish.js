import React from 'react';
import { withRouter } from 'react-router-dom';
import { 
  Table, 
  Button, 
  Modal,
  message
} from "antd";
import {
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { $patch } from '../../api/request';
import moment from 'moment';


const { confirm } = Modal

function NewsPublish(props) {

  const { dataSource, pageTitle } = props

  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      key: "title",
      render: (text, record) => {
        return text?.length > 15 
        ? <b onClick={() => { props.history.push(`/news-manage/preview/${record.id}`) }} className="news-title">
            { text.slice(0, 15) + "..." }
          </b> 
        : <b onClick={() => { props.history.push(`/news-manage/preview/${record.id}`) }} className="news-title">
            { text }
          </b>
      }
    },
    {
      title: "作者",
      dataIndex: "author",
      key: "author",
      render: (text) => {
        return <b>{text}</b>
      }
    },
    {
      title: "新闻分类",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (text) => {
        return <b>{text}</b>
      }
    },
    {
      title: "操作",
      key: "option",
      render: (text, record) => {
        const { auditState } = record
        return (
          <Button type="primary" onClick={() => confirmModal(record)}>发布</Button>
        )
      }
    }
  ]

  // 新闻
  const takeDownNews = (record) => {
    const { id } = record
    $patch(`/news/${id}`, {
      publishState: 2,
      publishTime: moment()
    }).then(res => {
      message.success("发布成功")
    }).catch(err => {
      message.error("发布失败")
    })
  }

  // 点击删除调出确认弹窗
  const confirmModal = (record) => {
    confirm({
      title: "确定发布吗？",
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        takeDownNews(record)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  return (
    <div>
      <b style={{fontSize: "20px"}}>{pageTitle}</b>
      <Table
        rowKey={(row) => row.id}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5
        }}
      >
      </Table>
    </div>
  )
}

export default withRouter(NewsPublish)