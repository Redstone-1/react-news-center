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
import { $delete, $patch } from '../../api/request';
import moment from 'moment';


const { confirm } = Modal

function NewsPublish(props) {

  const { dataSource, pageTitle, buttonType, getActionRes } = props

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
        return (
          <Button 
            type="primary" 
            onClick={() => confirmModal(record)}>
            { buttonType }
          </Button>
        )
      }
    }
  ]

  // 新闻
  const newsAction = (record) => {
    const { id } = record
    switch (buttonType) {
      default:
        $patch(`/news/${id}`, {
          publishState: 2,
          publishTime: moment()
        }).then(res => {
          message.success("发布成功")
          getActionRes(true)
        }).catch(err => {
          message.error("发布失败")
        })
        break
      case '下线':
        $patch(`/news/${id}`, {
          publishState: 3,
        }).then(res => {
          message.success("下线成功")
          getActionRes(true)
        }).catch(err => {
          message.error("下线失败")
        })
        break
      case '删除':
        $delete(`/news/${id}`).then(res => {
          message.success("删除成功")
          getActionRes(true)
        }).catch(err => {
          message.error("删除失败")
        })
    }
  }

  // 点击删除调出确认弹窗
  const confirmModal = (record) => {
    confirm({
      title: "确定执行此操作吗？",
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        newsAction(record)
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