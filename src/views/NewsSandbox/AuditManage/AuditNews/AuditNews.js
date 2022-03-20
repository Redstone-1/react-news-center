import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Modal,
  Space,
  message
} from "antd";
import {
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { $get, $patch } from '../../../../api/request';

const { confirm } = Modal
const { roleId, username, region } = JSON.parse(localStorage.getItem("token"))

export default function AuditNews(props) {
  const [waitingAuditNews, setWaitingAuditNews] = useState([])
  
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
          <Space size={10}>
            <Button onClick={() => confirmModal(record)} type="danger">驳回</Button>
            <Button onClick={() => accessAudit(record, 2, 1)} type="primary">通过</Button>
          </Space>
        )
      }
    }
  ]

  useEffect(() => {
    getWaitingAuditNews()
  }, [])

  const getWaitingAuditNews = () => {
    const roleObj = {
      "1": "superadmin",
      "2": "admin",
      "3": "editor"
    }
    $get(`/news?auditState=1&_expand=category`).then(res => {
      console.log("已发布", res.data);
      const list = res.data
      setWaitingAuditNews(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.author === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId === "editor"])
      ])
    })
  }

  // 点击删除调出确认弹窗
  const confirmModal = (record) => {
    confirm({
      title: "确定驳回吗？",
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        rejectNews(record)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  // 驳回新闻
  const rejectNews = (record) => {
    const { id } = record
    $patch(`/news/${id}`, {
      auditState: 3,
      publicState: 0
    }).then(res => {
      getWaitingAuditNews()
      message.success("驳回成功")
    }).catch(err => {
      message.error("驳回失败")
    })
  }

  // 通过
  const accessAudit = (record, auditState, publicState) => {
    const { id } = record
    $patch(`/news/${id}`, {
      auditState,
      publicState,
    }).then(res => {
      getWaitingAuditNews()
      message.success("通过成功")
    }).catch(err => {
      message.error("通过失败")
    })
  }

  return (
    <div>
      <b style={{fontSize: "20px"}}>待审核新闻</b>
      <Table
        rowKey={row => row.id}
        dataSource={waitingAuditNews}
        columns={columns}
        pagination={{
          pageSize: 5
        }}
      ></Table>
    </div>
  )
}
