import React, { Component } from 'react';
import { 
  Table, 
  Tag,
  Button, 
  Modal, 
  message,
  Switch,
} from "antd";
import { 
  DeleteOutlined, 
  EditOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons"
import AddUserForm from './UserForm';
import { $get, $delete, $patch, $post } from '../../../api/request';

const { confirm } = Modal

export default class UserList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      loading: false,
      isAddUserModalShow: false,
      isUpdateUserModalShow: false,
      regions: [],
      roles: [],
      currentUpdateUserId: 0
    }
    this.columns = [
      {
        title: "用户名",
        dataIndex: "username",
        key: "username",
        render: (text) => {
          return <b>{ text }</b>
        }
      },
      {
        title: "区域",
        dataIndex: "region",
        key: "region",
        render: (text) => {
          const color = "#" + Math.random().toString().slice(2, 8)
          return <Tag color={color}>{ text ? text : "全球"  }</Tag>
        }
      },
      {
        title: "角色名称",
        dataIndex: "role",
        key: "role",
        render: (role) => {
          return <b>{ role.roleName }</b>
        }
      },
      {
        title: "用户状态",
        dataIndex: "roleState",
        key: "roleState",
        render: (roleState, item) => {
          return <Switch 
            checked={roleState} 
            onClick={() => this.switchMethod(item)}
            disabled={item.default}>
          </Switch>
        }
      },
      {
        title: "操作",
        width: 240,
        render: (text, record, index) => {
          return (
            <>
              <Button 
                onClick={() => this.confirmModal(record)} 
                type="danger" 
                disabled={record.default}
                icon={<DeleteOutlined />}>
                删除
              </Button>
              <Button 
                onClick={() => this.updateUserModalShow(record)}
                disabled={record.default}
                type="primary" 
                icon={<EditOutlined />} 
                style={{marginLeft: "10px"}}>
                更新
              </Button>
            </>
          )
        }
      }
    ]
    this.pagination = {
      pageSize: 5
    }
    this.formRef = React.createRef()
  }

  componentDidMount () {
    this.getUsersList()
    this.getRegionDict()
    this.getRolesDict()
  }

  // 获取区域字典
  getRegionDict = () => {
    $get("/regions").then(async res => {
      if (res.status === 200) {
        this.setState({
          regions: res.data
        })
      }
    })
  }

   // 获取角色列表
   getRolesDict = () => {
    $get("/roles").then(async res => {
      if (res.status === 200) {
        this.setState({
          roles: res.data
        })
      }
    })
  }

  // 获取用户列表数据
  getUsersList = () => {
    $get("/users?_expand=role").then(async res => {
      if (res.status === 200) {
        this.setState({
          dataSource: res.data
        })
      }
    })
  }

  // 点击删除调出确认弹窗
  confirmModal = (record) => {
    confirm({
      title: "确定删除此用户吗？",
      icon: <ExclamationCircleOutlined />,
      content: "删除后的用户将不可恢复",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        this.deleteUser(record)
      },
      onCancel() {
        
      },
    });
  }

  // 删除用户
  deleteUser = (record) => {
    this.setState({
      loading: true
    })
    $delete(`/users/${record.id}`).then(async res => {
      if (res.status === 200) {
        await this.getUsersList()
        this.setState({
          loading: false
        })
        message.success("删除成功")
      }
    })
  }

  // 用户开关
  switchMethod = (item) => {
    this.setState({ loading: true })
    $patch(`/users/${item.id}`, { roleState: !item.roleState })
    .then(async res => {
      if (res.status === 200) {
        message.success("操作成功")
        await this.getUsersList()
        this.setState({ loading: false })
      }
    })
    .catch(err => {
      message.error("操作失败")
      this.setState({ loading: false })
    })
  }

  // 校验新增用户表单并新增用户
  createOrUpdateUser = (type) => {
    this.formRef.current.validateFields()
      .then(values => {
        if (type === "add") {
          $post("/users", {
            ...values,
            "roleState": true,
            "default": false,
          }).then(res => {
            if (res.status === 201 || res.status === 200 ) {
              message.success("操作成功")
              this.getUsersList()
              this.formRef.current.resetFields()
            } else {
              message.error("操作失败")
            } 
            this.setState({
              isAddUserModalShow: false
            })
          }).catch(err => Promise.reject(err))
        } else {
          $patch(`/users/${this.state?.currentUpdateUserId}`, {
            ...values,
            "roleState": true,
            "default": false,
          }).then(res => {
            if (res.status === 201 || res.status === 200 ) {
              message.success("操作成功")
              this.getUsersList()
              this.formRef.current.resetFields()
            } else {
              message.error("操作失败")
            } 
            this.setState({
              isUpdateUserModalShow: false
            })
          }).catch(err => Promise.reject(err))
        }
      }).catch(err => Promise.reject(err))
  }
  

  // 更新用户弹窗显示
  updateUserModalShow = (record) => {
    this.setState({
      isUpdateUserModalShow: true,
      currentUpdateUserId: record.id
    }, () => {
      this.formRef.current.setFieldsValue({
        username: record.username,
        password: record.password,
        region: record.region,
        roleId: record.roleId
      })
    })
  }

  render() {
    return (
      <>
        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
          <b style={{fontSize: "20px"}}>用户配置列表</b>
          <Button type="primary" onClick={() => this.setState({ isAddUserModalShow: true })}>添加用户</Button>
        </div>
        <Table
          rowKey={(item) => item.id}
          loading={this.state.loading}
          dataSource={this.state.dataSource}
          columns={this.columns}
          pagination={this.pagination}
        >
        </Table>

        <Modal
          visible={this.state.isAddUserModalShow}
          title="添加用户"
          cancelText="取消"
          okText="确认"
          onOk={() => this.createOrUpdateUser("add")}
          onCancel={() => this.setState({
            isAddUserModalShow: false
          })}
        >
          <AddUserForm ref={this.formRef} regions={this.state.regions} roles={this.state.roles} />
        </Modal>

        <Modal
          visible={this.state.isUpdateUserModalShow}
          title="更新用户"
          cancelText="取消"
          okText="确认"
          onOk={() => this.createOrUpdateUser("update")}
          onCancel={() => this.setState({
            isUpdateUserModalShow: false
          })}
        >
          <AddUserForm ref={this.formRef} regions={this.state.regions} roles={this.state.roles} />
        </Modal>
      </>
    )
  }
}
