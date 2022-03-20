import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Tag,
  Modal,
  message
} from "antd";
import {
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { $get, $patch } from '../../../../api/request';

const { confirm } = Modal
const user = JSON.parse(localStorage.getItem("token"))

export default function AuditList(props) {

  const [auditList, setAuditList] = useState([])

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
      title: "审核状态",
      dataIndex: "auditState",
      key: "auditState",
      render: (auditState) => {
        const auditStateMapColor = {
          1: "green",
          2: "orange",
          3: "tomato"
        }
        const auditStateMapText = {
          1: "已通过",
          2: "审核中",
          3: "未通过"
        }
        return (
          <Tag color={auditStateMapColor[auditState]}>
            { auditStateMapText[auditState] } 
          </Tag>
        )
      }
    },
    {
      title: "操作",
      key: "option",
      render: (text, record) => {
        const { auditState } = record
        return (
          <div>
            {
              auditState === 1 && (<Button type="primary" onClick={() => confirmModal(record)}>发布</Button>)
            }
            {
              auditState === 2 && (<Button style={{ backgroundColor: "tomato", color: "white" }} onClick={() => revertNews(record)}>撤销</Button>)
            }
            {
              auditState === 3 && (<Button style={{ backgroundColor: "orange", color: "white" }} onClick={() => modifyNews(record)}>修改</Button>)
            }
          </div>
        )
      }
    }
  ]

  useEffect(() => {
    getAuditListData()
  }, [])

  const getAuditListData = () => {
    const { username } = user
    $get(`/news?author=${username}&auditState_ne=0&publicState_lte=1`).then(res => {
      console.log("审核列表", res.data);
      setAuditList(res.data)
    })
  }

  // 发布新闻
  const publishNews = (record) => {
    const { id } = record
    $patch(`/news/${id}`, {
      publicState: 2
    }).then(res => {
      getAuditListData()
      message.success("发布成功")
    }).catch(err => {
      message.success("发布失败")
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
        publishNews(record)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  // 撤回新闻
  const revertNews = (record) => {
    const { id } = record
    $patch(`/news/${id}`, {
      auditState: 0
    }).then(res => {
      getAuditListData()
      message.success("撤回成功")
    }).catch(err => {
      message.success("撤回失败")
    })
  }

  // 修改新闻
  const modifyNews = (record) => {
    const { id } = record
    props.history.push(`/news-manage/update/${id}`)
  }

  return (
    <div>
      <b style={{fontSize: "20px"}}>已审核新闻</b>
      <Table
        rowKey={(row) => row.id}
        dataSource={auditList}
        columns={columns}
        pagination={{
          pageSize: 5
        }}
      >
      </Table>
    </div>
  )
}
