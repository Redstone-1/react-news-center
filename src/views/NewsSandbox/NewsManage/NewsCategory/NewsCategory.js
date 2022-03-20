import React, { useEffect, useState, useRef } from 'react';
import { 
  Table, 
  Button, 
  Modal,
  Space,
  Form,
  Input,
  message
} from "antd";
import {
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { $delete, $get, $patch } from '../../../../api/request';

const { confirm } = Modal
// const { roleId, username, region } = JSON.parse(localStorage.getItem("token"))

export default function NewsCategory(props) {
  const [categories, setCategories] = useState([])
  const [isModalShow, setIsModalShow] = useState(false)
  const [currentCategoryId, setCurrentCategoryId] = useState(null)
  const formRef = useRef()
  const columns = [
    {
      title: "新闻分类",
      dataIndex: "title",
      key: "title",
      render: (text) => {
        return text?.length > 15 
        ? <b>{ text.slice(0, 15) + "..." }</b> 
        : <b>{ text }</b>
      }
    },
    {
      title: "操作",
      key: "option",
      width: 100,
      render: (text, record) => {
        return (
          <Space size={10}>
            <Button onClick={() => confirmModal(record)} type="danger">删除</Button>
            <Button onClick={() => showModal(record)} type="primary">更新</Button>
          </Space>
        )
      }
    }
  ]

  useEffect(() => {
    getNewsCategory()
  }, [])

  const getNewsCategory = () => {
    $get(`/categories`).then(res => {
      setCategories(res.data)
    })
  }

  // 点击删除调出确认弹窗
  const confirmModal = (record) => {
    confirm({
      title: "确定删除此新闻分类吗？",
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        deleteCategory(record)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  // 删除新闻分类
  const deleteCategory = (record) => {
    const { id } = record
    $delete(`/categories/${id}`).then(res => {
      getNewsCategory()
      message.success("删除成功")
    }).catch(err => {
      message.success("删除失败")
    })
  }

  const showModal = (record) => {
    const { id } = record
    setCurrentCategoryId(id)
    setIsModalShow(true)
  }

  // 更新分类
  const updateCategory = () => {
    formRef.current.validateFields().then(values => {
      $patch(`/categories/${currentCategoryId}`, {
        title: values.category,
        value: values.category
      }).then(res => {
        setIsModalShow(false)
        formRef.current.resetFields()
        getNewsCategory()
        message.success("更新成功")
      }).catch(err => {
        message.error("更新失败")
      })
    })
  }

  return (
    <div>
      <b style={{fontSize: "20px"}}>新闻分类</b>
      <Table
        rowKey={row => row.id}
        dataSource={categories}
        columns={columns}
        pagination={{
          pageSize: 5
        }}
      ></Table>
      <Modal 
        okText="确认"
        cancelText="取消"
        onOk={() => updateCategory()}
        onCancel={() => {
          setIsModalShow(false)
          formRef.current.resetFields()
        }}
        title="更新新闻分类" 
        visible={isModalShow}>
        <Form ref={formRef}>
          <Form.Item 
            name="category"
            label="新闻分类" 
            rules={[{ required: true, message: "更新内容不能为空！" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
