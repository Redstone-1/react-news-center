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
          { required: true, message: "请输入密码" }
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
              return <Option key={region.id} value={region.value}>{region.title}</Option>
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
              return <Option key={role.id} value={role.id}>{role.roleName}</Option>
            })
          }
        </Select>
      </Item>
    </Form>
  )
})


export default UserForm