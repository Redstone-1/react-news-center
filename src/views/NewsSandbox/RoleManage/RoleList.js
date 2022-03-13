import { useState, useEffect } from "react";
import { 
  Table, 
  Button, 
  Tag,
  Modal, 
  message,
  Tree
} from "antd";
import { 
  DeleteOutlined, 
  EditOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { $get, $delete, $patch } from "../../../api/request";

const { confirm } = Modal

export default function RoleList () {
  const [dataSource, setDataSource] = useState([])
  const [rightList, setRightList] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalShow, setIsModalShow] = useState(false)
  const [currentRoleRights, setCurrentRoleRights] = useState([])
  const [currentRoleId, setCurrentRoleId] = useState(0)

  const columns = [
    {
      title: "角色名称",
      dataIndex: "roleName",
      key: "roleName",
      render: (text) => {
        const color = "#" + Math.random().toString().slice(2, 8)
        return (
          <Tag color={color}>
            { text} 
          </Tag>
        )
      }
    },
    {
      title: "角色ID",
      dataIndex: "id",
      key: "id",
      render: (text) => {
        return <b>{ text }</b>
      }
    },
    {
      title: "角色操作",
      width: 240,
      render: (text, record, index) => {
        return (
          <>
            <Button onClick={() => confirmModal(record)} type="danger" icon={<DeleteOutlined />}>删除</Button>
            <Button 
              onClick={() => { 
                setCurrentRoleId(record.id)
                setIsModalShow(true)
                setCurrentRoleRights(record.rights)
              }}
              type="primary" 
              icon={<EditOutlined />} 
              style={{marginLeft: "10px"}}>
                配置
            </Button>
          </>
        )
      }
    }
  ]
  
  const pagination = {
    pageSize: 5
  }


  useEffect(() => {
    setLoading(true)
    getRolesData()
    getRightsData()
    setLoading(false)
  }, [])

  const getRolesData = () => {
    $get(`/roles`, "").then(res => {
      if (res.status === 200) {
        setDataSource(res.data)
      }
    })
  }

  const getRightsData = () => {
    $get(`/rights?_embed=children`, "").then(res => {
      if (res.status === 200) {
        setRightList(res.data)
      }
    })
  }

  // 点击删除调出确认弹窗
  const confirmModal = (record) => {
    confirm({
      title: "确定删除此角色吗？",
      icon: <ExclamationCircleOutlined />,
      content: "删除后的角色将无法恢复",
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
    $delete(`/roles/${record.id}`).then(async res => {
      if (res.status === 200) {
        await getRolesData()
        message.success("删除成功")
      }
    })
  }

  const handleOk = () => {
    setIsModalShow(false)
    $patch(`/roles/${currentRoleId}`, {
      rights: currentRoleRights
    }).then(res => {
      if (res.status === 200) {
        getRolesData()
        message.success("操作成功")
      }
    }).catch(err => {
      message.error("操作失败")
    })
  }

  const onCheck = (checkedKeys) => {
    setCurrentRoleRights(checkedKeys.checked)
  }

  return (
    <>
      <b style={{fontSize: "20px"}}>角色配置列表</b>
      <Table 
        pagination={pagination}
        loading={loading}
        rowKey={item => item.id}
        dataSource={dataSource} 
        columns={columns}>
      </Table>
      <Modal 
        okText="确认"
        cancelText="取消"
        title="角色权限配置" 
        visible={isModalShow}
        onOk={handleOk}
        onCancel={() => setIsModalShow(false)}
      >
        <Tree
          checkable
          // expandedKeys={currentRoleRights}
          // defaultSelectedKeys={}
          checkedKeys={currentRoleRights}
          checkStrictly
          onCheck={onCheck}
          treeData={rightList}
        />
      </Modal>
    </>
  )
}
