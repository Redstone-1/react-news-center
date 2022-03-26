import React, { useState, useEffect } from 'react';
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import { $get } from '../../../api/request';
import * as Echarts from "echarts";
import _ from 'lodash';
import './Home.css';

const { Meta } = Card;
const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"))

export default function Home(props) {
  const [pieInstance, setPieInstance] = useState(null)
  const [mostViews, setMostViews] = useState([])
  const [mostStars, setMostStars] = useState([])
  const [newsData, setNewsData] = useState([])
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [drawerType, setDrawerType] = useState('pie')

  useEffect(() => {
    getMostViews()
    getMostStars()
  }, [])

  useEffect(() => {
    $get(`/news?publishState=2&_expand=category&author=${username}`).then(res => {
      setNewsData(res.data)
      renderBarChart(_.groupBy(res.data, item => item.categoryId))
    })
    return () => {
      window.onresize = null
    }
  }, [])

  // 渲染柱图
  const renderBarChart = (data) => {
    let barChart = Echarts.init(document.querySelector('#barChart'))
    let option = {
      title: {
        text: '已发布新闻柱图汇总'
      },
      xAxis: {
        type: 'category',
        data: Object.keys(data),
      },
      yAxis: {
        type: 'value',
        minInterval: 1
      },
      legend: {
        top: 10
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      series: [
        {
          name: '新闻数量',
          data: Object.values(data).map(item => item.length),
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }
      ]
    };
    barChart.setOption(option)

    window.onresize = () => {
      barChart.resize()
    }
  }
  
  // 渲染饼图
  const renderPieChart = () => {
    let pieChart;
    if (!pieInstance) {
      pieChart = Echarts.init(document.querySelector('#pieChart'))
      setPieInstance(pieChart)
    } else {
      pieChart = pieInstance
    }
    
    let option = {
      title: {
        text: '点击量分析',
        left: 'right'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '点击量',
          type: 'pie',
          radius: '50%',
          center: ["50%", "70%"], 
          data: newsData.map(item => {
            return {
              value: item.view,
              name: item.title
            }
          }),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    pieChart.setOption(option)
  }
  // 获取最多浏览
  const getMostViews = () => {
    $get(`/news?publishState=2&_expand=category&author=${username}&_sort=view&_order=desc&_limit=10`).then(res => {
      if (res) {
        console.log('最多浏览', res.data);
        setMostViews(res.data)
      }
    })
  }

  // 获取最多点赞
  const getMostStars = () => {
    $get(`/news?publishState=2&_expand=category&author=${username}&_sort=star&_order=desc&_limit=10`).then(res => {
      if (res) {
        console.log('最多点赞', res.data);
        setMostStars(res.data)
      }
    })
  }

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title={<b>最多浏览</b>} bordered={false}>
            <List
              dataSource={mostViews}
              renderItem={item => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`} className="news-title">{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<b>最多点赞</b>} bordered={false}>
            <List
              dataSource={mostStars}
              renderItem={item => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`} className="news-title">{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <PieChartOutlined onClick={() => { 
                setDrawerType('pie')
                setTimeout(() => { 
                  setDrawerVisible(true)
                  renderPieChart()
                }, 0)
              }} />
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={ region === "" ? roleName + " - 全球" : roleName + ' - ' + region }
            />
          </Card>
        </Col>
      </Row>
      <Drawer width={500} title="我的发布" placement="right" onClose={() => setDrawerVisible(false)} visible={drawerVisible}>
        {
          drawerType === "pie" 
          ? <div id="pieChart" style={{ height: '100%' }}></div>
          : <div id="lineChart" style={{ height: '100%' }}></div>
        }
      </Drawer>
      <div id="barChart" style={{ height: '400px', marginTop: '30px' }}></div>
    </div>
  ) 
}
