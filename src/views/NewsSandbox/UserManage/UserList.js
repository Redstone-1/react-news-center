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
import UserForm from './UserForm';
import { $get, $delete, $patch, $post } from '../../../api/request';

const { confirm } = Modal

export default class UserList extends Component {

  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.formUpdateRef = React.createRef()
    this.state = {
      dataSource: [],
      loading: false,
      isAddUserModalShow: false,
      isUpdateUserModalShow: false,
      regions: [], // 区域
      roles: [], // 角色
      currentUpdateUserId: 0, // 当前需要执行操作的用户的id
      currentUser: JSON.parse(localStorage.getItem("token")) // 当前登录的用户
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
        filters: [
          {
            text: "亚洲",
            value: "亚洲"
          },
          {
            text: "欧洲",
            value: "欧洲"
          },
          {
            text: "北美洲",
            value: "北美洲"
          },
          {
            text: "南美洲",
            value: "南美洲"
          },
          {
            text: "非洲",
            value: "非洲"
          },
          {
            text: "大洋洲",
            value: "大洋洲"
          },
          {
            text: "南极洲",
            value: "南极洲"
          },
          {
            text: "全球",
            value: "全球"
          }
        ],
        render: (text) => {
          const color = "#" + Math.random().toString().slice(2, 8)
          return <Tag color={color}>{ text ? text : "全球"  }</Tag>
        },
        onFilter: (value, item) => {
          if (value === "全球") {
            return item.region === ""
          }
          return item.region === value
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
        // 当前登录用户只能看到他的下级用户
        const { data } = res
        const { roleId, username, region } = this.state.currentUser
        const roleObj = {
          "1": "superAdmin",
          "2": "admin",
          "3": "editor"
        }
        const list = roleObj[roleId] === "superAdmin" 
        ? data
        : [
          ...data.filter(item => item.username === username),
          ...data.filter(item => item.region === region && roleObj[item.roleId] === "editor")
        ] 
        this.setState({
          dataSource: list
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
  createUser = () => {
    this.formRef.current.validateFields()
      .then(values => {
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
        }).catch(err => Promise.reject(err))  
      }).catch(err => { 
        this.setState({
          isUpdateUserModalShow: true
        })
      })

      this.setState({
        isAddUserModalShow: false
      })
  }
  
  // 更新用户
  updateUser = () => {
    this.formUpdateRef.current.validateFields()
      .then(values => {
        $patch(`/users/${this.state?.currentUpdateUserId}`, {
          ...values,
          "roleState": true,
          "default": false,
        }).then(res => {
          if (res.status === 201 || res.status === 200 ) {
            message.success("操作成功")
            this.getUsersList()
            this.formUpdateRef.current.resetFields()
          } else {
            message.error("操作失败")
          } 
        }).catch(err => Promise.reject(err))
      }).catch(err => {
        this.setState({
          isUpdateUserModalShow: true
        })
      })

      this.setState({
        isUpdateUserModalShow: false
      })
  }

  // 更新用户弹窗显示
  updateUserModalShow = (record) => {
    this.setState({
      isUpdateUserModalShow: true,
      currentUpdateUserId: record.id
    }, () => {
      this.formUpdateRef.current.setFieldsValue({
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
          onOk={() => this.createUser()}
          onCancel={() => this.setState({
            isAddUserModalShow: false
          })}
        >
          <UserForm type="add" ref={this.formRef} regions={this.state.regions} roles={this.state.roles} />
        </Modal>

        <Modal
          visible={this.state.isUpdateUserModalShow}
          title="更新用户"
          cancelText="取消"
          okText="确认"
          onOk={() => this.updateUser()}
          onCancel={() => this.setState({
            isUpdateUserModalShow: false
          })}
        >
          <UserForm type="update" ref={this.formUpdateRef} regions={this.state.regions} roles={this.state.roles} />
        </Modal>
      </>
    )
  }
}
