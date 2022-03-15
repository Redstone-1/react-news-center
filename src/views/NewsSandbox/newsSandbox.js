import React, { useEffect } from 'react';
import TopHeader from '../../components/Sandbox/TopHeader';
import SideMenu from '../../components/Sandbox/SideMenu';
import { Layout } from 'antd';
import MainRouter from '../../router/main-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import "./NewsSandbox.css";

const { Content } = Layout

export default function NewsSandbox() {
  
  NProgress.start()

  useEffect(() => {
    NProgress.done()
  })
  
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          style={{
            margin: '16px 16px',
            padding: 16,
            minHeight: 280,
            backgroundColor: "#fff",
            overflow: "auto"
          }}
        >
          <MainRouter />
        </Content>
      </Layout>
    </Layout>
  )
}

