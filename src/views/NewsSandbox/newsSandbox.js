import React, { Component } from 'react';
import TopHeader from '../../components/Sandbox/TopHeader';
import SideMenu from '../../components/Sandbox/SideMenu';
import { Layout } from 'antd';
import MainRouter from '../../router/main-router';
import "./NewsSandbox.css";

export default class NewsSandbox extends Component {
  render() {
    const { Content } = Layout
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
}

