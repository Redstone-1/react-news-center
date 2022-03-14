import React, { forwardRef, useState } from 'react'
import { 
  Form,
  Input,
  Select
} from "antd";

const { Item } = Form
const { Option } = Select

const UserForm = forwardRef((props, ref) => {
  const [isDisabled, setIsDisAbled] = useState(false)
  const { roleId, region } = JSON.parse(localStorage.getItem("token"))
  const roleObj = {
    "1": "superAdmin",
    "2": "admin",
    "3": "editor"
  }

  const checkRegionDisabled = (item) => {
    if (props.type === "update") {
      if (roleObj[roleId] === "superAdmin") {
        return false
      } else {
        return item.value !== region
      }
    } else {
      if (roleObj[roleId] === "superAdmin") {
        return false
      } else {
        return item.value !== region
      }
    }
  }

  const checkRoleDisabled = (item) => {
    if (props.type === "update") {
      if (roleObj[roleId] === "superAdmin") {
        return false
      } else {
        return item.id !== 3
      }
    } else {
      if (roleObj[roleId] === "superAdmin") {
        return false
      }
    }
  }
  
  return (
    <Form
      ref={ref}
      name="userForm"
      layout="vertical"
    >
      <Item 
        name="username"
        label="用户名"
        rules={[
          { required: true, message: "请输入用户名" },
          { max: 8, min: 2, message: "用户名长度在 2 到 8 之间" }
        ]}
      >
        <Input />
      </Item>
      <Item 
        name="password"
        label="密码"
        rules={[
          { required: true, message: "请输入密码" },
          { max: 12, min: 6, message: "密码长度在 6 到 12 之间" }
        ]}
      >
        <Input />
      </Item>
      <Item 
        name="region"
        label="区域"
        rules={isDisabled ? [] : [
          { required: true, message: "请选择用户所属区域" }
        ]}
      >
        <Select disabled={isDisabled}>
          {
            props.regions?.map(region => {
              return <Option disabled={checkRegionDisabled(region)} key={region.id} value={region.value}>{region.title}</Option>
            })
          }
        </Select>
      </Item>
      <Item 
        name="roleId"
        label="角色"
        rules={[
          { required: true, message: "请选择用户所属角色" }
        ]}
      >
        <Select onChange={(value) => {
          if (value === 1) {
            setIsDisAbled(true)
            ref.current.setFieldsValue({
              "region": ""
            })
          } else {
            setIsDisAbled(false)
          }
        }}>
          {
            props.roles?.map(role => {
              return <Option disabled={checkRoleDisabled(role)} key={role.id} value={role.id}>{role.roleName}</Option>
            })
          }
        </Select>
      </Item>
    </Form>
  )
})


export default UserForm