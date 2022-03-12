import React, { Component } from 'react';
import { 
  Table, 
  Tag,
  Button, 
  Modal, 
  message,
  Popover,
  Switch
} from "antd";
import { 
  DeleteOutlined, 
  EditOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons"
import { $get, $delete, $patch } from '../../../api/request';

const { confirm } = Modal

export default class RightList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      loading: false
    }
    this.columns = [
      {
        title: "权限名称",
        dataIndex: "title",
        key: "title",
        render: (text) => {
          const color = "#" + Math.random().toString().slice(2, 8)
          return (
            <Tag color={color}>
              {
                text
              }
            </Tag>
          )
        }
      },
      {
        title: "权限ID",
        dataIndex: "id",
        key: "id",
        render: (text) => {
          return <b>{ text }</b>
        }
      },
      {
        title: "权限路径",
        dataIndex: "key",
        key: "key",
        render: (text) => {
          return <b>{ text }</b>
        }
      },
      {
        title: "权限操作",
        width: 240,
        render: (text, record, index) => {
          return (
            <>
              <Button onClick={() => this.confirmModal(record)} type="danger" icon={<DeleteOutlined />}>删除</Button>
              <Popover 
                title="显示 | 隐藏"
                trigger={record.pagepermisson === undefined ? "" : "click"}
                content={
                  <div style={{textAlign: "center"}}>
                    <Switch 
                      checked={record.pagepermisson === 1}
                      onClick={() => this.switchMethod(record)}
                    ></Switch>
                  </div>
                }
              >
                <Button 
                  disabled={record.pagepermisson === undefined}
                  type="primary" 
                  icon={<EditOutlined />} 
                  style={{marginLeft: "10px"}}>
                    配置
                </Button>
              </Popover>
            </>
          )
        }
      }
    ]
    this.pagination = {
      pageSize: 5
    }
  }

  componentDidMount () {
    this.getRightsData()
  }

  // 获取菜单权限数据
  getRightsData = () => {
    const checkChildren = (data) => {
      Array.isArray(data) && data.forEach(item => {
        if (item.children?.length === 0) {
          item.children = ""
        }
        checkChildren(item.children)
      })
    }
    $get("/rights?_embed=children").then(async res => {
      if (res.status === 200) {
        await checkChildren(res.data)
        this.setState({
          dataSource: res.data
        })
      }
    })
  }

  // 点击删除调出确认弹窗
  confirmModal = (record) => {
    confirm({
      title: "确定删除此权限吗？",
      icon: <ExclamationCircleOutlined />,
      content: "删除后的权限可从新配置",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        this.deleteRights(record)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  // 删除权限
  deleteRights = (record) => {
    this.setState({
      loading: true
    })
    const gradeParams = record.grade === 1 ? "rights" : "children"
    $delete(`/${gradeParams}/${record.id}`).then(async res => {
      if (res.status === 200) {
        await this.getRightsData()
        this.setState({
          loading: false
        })
        message.success("删除成功")
      }
    })
  }

  // 菜单权限开关
  switchMethod = (record) => {
    record.pagepermisson = record.pagepermisson === 1 ? 0 : 1
    this.setState({ loading: true })
    const gradeParams = record.grade === 1 ? "rights" : "children"
    $patch(`/${gradeParams}/${record.id}`, { pagepermisson: record.pagepermisson })
    .then(async res => {
      if (res.status === 200) {
        message.success("操作成功")
        setInterval(() => {
          window.location.reload()
        }, 200)
      }
    })
    .catch(err => {
      message.success("操作失败")
      setInterval(() => {
        window.location.reload()
      }, 200)
    })
  }

  render() {
    return (
      <>
        <b style={{fontSize: "20px"}}>权限配置列表</b>
        <Table
          loading={this.state.loading}
          dataSource={this.state.dataSource}
          columns={this.columns}
          pagination={this.pagination}
        >
        </Table>
      </>
    )
  }
}
