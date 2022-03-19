import { useState, useEffect } from "react";
import { 
  Table, 
  Button, 
  Tag,
  Modal, 
  message,
  Space
} from "antd";
import { 
  DeleteOutlined, 
  EditOutlined,
  ExclamationCircleOutlined,
  CloudUploadOutlined
} from "@ant-design/icons";
import { $get, $delete } from "../../../api/request";

import "./NewsDraft.css";

const { confirm } = Modal
const user = JSON.parse(localStorage.getItem("token"))

export default function NewsDraft (props) {
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  // const [isModalShow, setIsModalShow] = useState(false)

  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      width: 150,
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
      title: "新闻分类",
      width: 100,
      dataIndex: "categoryId",
      render: (text) => {
        const color = "#" + Math.random().toString().slice(2, 8)
        return (
          <Tag color={color}>
            { text } 
          </Tag>
        )
      }
    },
    {
      title: "作者",
      width: 100,
      dataIndex: "author",
      key: "author",
      render: (text) => {
        return <b>{ text }</b>
      }
    },
    {
      title: "操作",
      width: 240,
      render: (text, record, index) => {
        return (
          <Space size={10}>
            <Button onClick={() => confirmModal(record)} type="danger" icon={<DeleteOutlined />}>删除</Button>
            <Button onClick={() => { props.history.push(`/news-manage/update/${record.id}`) }} icon={<EditOutlined />}>编辑</Button>
            <Button 
              onClick={() => { 
              }}
              type="primary" 
              icon={<CloudUploadOutlined />}>
                发布
            </Button>
          </Space>
        )
      }
    }
  ]
  
  const pagination = {
    pageSize: 5
  }


  useEffect(() => {
    setLoading(true)
    getAuditingNews()
    setLoading(false)
  }, [])

  const getAuditingNews = () => {
    $get(`/news?author=${user.username}&auditState=0&_expand=category`).then(res => {
      if (res.status === 200) {
        setDataSource(res.data)
      }
    })
  }

  // 点击删除调出确认弹窗
  const confirmModal = (record) => {
    confirm({
      title: "确定删除此新闻吗？",
      icon: <ExclamationCircleOutlined />,
      content: "删除后的新闻草稿将无法恢复",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        deleteRoles(record)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  // 删除角色
  const deleteRoles = (record) => {
    $delete(`/news/${record.id}`).then(async res => {
      if (res.status === 200) {
        await getAuditingNews()
        message.success("删除成功")
      }
    })
  }

  return (
    <>
      <b style={{fontSize: "20px"}}>新闻草稿箱</b>
      <Table 
        pagination={pagination}
        loading={loading}
        rowKey={item => item.id}
        dataSource={dataSource} 
        columns={columns}>
      </Table>
    </>
  )
}

