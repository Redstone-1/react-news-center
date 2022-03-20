import React, { useState, useEffect, useRef } from 'react';
import { 
  Steps, 
  Card,
  Button, 
  Space, 
  Form, 
  Input, 
  Select, 
  message,
  notification
} from 'antd';
import NewsEditor from '../../../../components/NewsManage/NewsEditor';
import moment from 'moment';
import { $get, $post } from "../../../../api/request"
import './NewsAdd.css'

const { Step } = Steps
const { Option } = Select
const user = JSON.parse(localStorage.getItem("token"))

export default function NewsAdd(props) {
  const [currentStep, setCurrentStep] = useState(0)
  const formRef = useRef(null)
  const [newsTypeDict, setNewsTypeDict] = useState([])
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState("")

  useEffect(() => {
    $get("categories").then(res => {
      if (res.status === 200) {
        setNewsTypeDict(res.data)
      }
    })
  }, [])
  
  // 上一步
  const preStep = () => {
    setCurrentStep(currentStep - 1)
  }

  // 下一步
  const nextStep = () => {
    if (currentStep === 0) {
      formRef.current.validateFields().then(res => {
        console.log(res);
        setFormInfo(res)
        setCurrentStep(currentStep + 1)
      }).catch(err => {
        console.log(err);
      })
    } else {
      if (content === "" || content.trim() === "<p></p>") {
        console.log("content", content);
        message.error("新闻内容不能为空！")
      } else {
        setCurrentStep(currentStep + 1)
      }
      
    }
  }

  // 保存到草稿箱 or 提交审核
  const handelSave = (auditState) => {
    $post("/news", {
      ...formInfo,
      content,
      region: user.region || "",
      author: user.username,
      roleId: user.roleId,
      auditState: auditState,
      publicState: 0,
      createTime: moment(),
      star: 0,
      view: 0,
      publishTime: 0
    }).then(res => {
      console.log('提交保存', res);
      props.history.push(auditState === 0 ? "/news-manage/draft" : "/audit-manage/list")
      notification.info({ 
        message: "通知",
        description: `您可以到${auditState === 0 ? "草稿箱" : "审核列表"}中查看您的新闻`
      })
    })
  }

  // 渲染表单
  const renderForm = () => {
    return (
      <Form
        ref={formRef}
        labelCol={4}
        wrapperCol={20}
        name="newsTitle"
      >
        <Form.Item
          label="新闻标题"
          name="title"
          rules={[{ required: true, message: "请输入新闻标题" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="新闻分类"
          name="categoryId"
          rules={[{ required: true, message: "请选择新闻分类" }]}
        >
          <Select>
            {
              newsTypeDict.map(item => {
                return <Option key={item.id} value={item.value}>{item.title}</Option>
              })
            }
          </Select>
        </Form.Item>
      </Form>
    )
  }

  return (
    <div>
      <b style={{fontSize: "20px"}}>新闻撰写</b>
      <Card bordered={false}>
        <Steps current={currentStep}>
          <Step title="基本信息" description="新闻标题，新闻分类" />
          <Step title="新闻内容" description="新闻主体内容" />
          <Step title="新闻提交" description="保存草稿或者提交审核" />
        </Steps>
        <div className={currentStep === 0 ? "form-wrapper" : "hidden "}>
          {
            renderForm()
          }
        </div>
        <div className={currentStep === 1 ? "form-wrapper" : "hidden "}>
          <NewsEditor getContent={(content) => {
            console.log('content', content);
            setContent(content)
          }} />
        </div>
        <div style={{marginTop: "40px"}}>
          <Space size={10}>
            {
              currentStep === 2 && <Space size={10}>
                <Button onClick={() => handelSave(0)}>保存到草稿箱</Button>
                <Button type='danger' onClick={() => handelSave(1)}>提交审核</Button>
              </Space>
            }
            {
              currentStep < 2 && <Button type='primary' onClick={nextStep}>下一步</Button>
            }
            {
              currentStep > 0 && <Button type='primary' onClick={preStep}>上一步</Button> 
            }
          </Space>
        </div>
      </Card>
    </div>
  )
}
