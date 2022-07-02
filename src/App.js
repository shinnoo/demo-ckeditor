import { Layout, Menu, Row, Col } from 'antd';
import {
  BarsOutlined,
  AuditOutlined,
  BarChartOutlined,
  ContactsOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css'
import './App.css';
import { Route, Switch, Link } from 'react-router-dom'
import ProjectStatus from './views/category/project-status';
import ProjectType from './views/category/project-type';

import { useState } from 'react';
import TechStack from './views/category/tech-stack';
import CustomerCategory from './views/category/customer-category';
import ComingSoon from './views/category/coming-soon';
import Department from './views/manage/department';
import Employee from './views/manage/employee';
import Project from './views/manage/projects';
import News from './views/news';

const {  Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const App = () => {

  const [collapsed, setCollapsed] = useState(false);

  const AppName = () => {
    return (
      <Col><span style={{ fontSize: "15px", color: "white" }}>HR-Management</span></Col>
    )
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible  collapsed={collapsed} onCollapse={(collapsed) => setCollapsed(collapsed)}>
        <div className="logo" >

          <Row justify="space-around" align="middle">

            <Col><ContactsOutlined style={{ fontSize: "25px", color: "white" }} /></Col>
            {collapsed ? null : <AppName />}
          </Row>
        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <SubMenu key="sub1" icon={<BarsOutlined />} title="Danh mục">
            <Menu.Item key="1">
              <Link to="/project-types">Loại dự án</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/project-status">Trạng thái dự án</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/tech-stacks">Tech stack</Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to="/customer-categories">Nhóm khách hàng</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<AuditOutlined />} title="Quản lý">
            <Menu.Item key="5"><Link to="/departments">Đơn vị</Link></Menu.Item>
            <Menu.Item key="6"><Link to="/employees">Nhân sự</Link></Menu.Item>
            <Menu.Item key="7"><Link to="/projects">Dự án</Link></Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" icon={<BarChartOutlined />} title="Báo cáo">
            <Menu.Item key="8"><Link to="/project-reports">Số lượng dự án</Link></Menu.Item>
            <Menu.Item key="9"><Link to="/employee-reports">Số lượng nhân sự</Link></Menu.Item>
          </SubMenu>
          <Menu.Item icon={<BarChartOutlined />} key="10"><Link to="/news">News</Link></Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: '5px 16px' }}>
          <Switch>
            <Route path="/project-types">
              <ProjectType />
            </Route>
            <Route path="/project-status">
              <ProjectStatus />
            </Route>
            <Route path="/tech-stacks">
              <TechStack />
            </Route>
            <Route path="/customer-categories">
              <CustomerCategory />
            </Route>
            <Route path="/departments">
              <Department />
            </Route>
            <Route path="/employees">
              <Employee />
            </Route>
            <Route path="/projects">
              <Project />
            </Route>
            <Route path="/news">
              <News />
            </Route>
            <Route exact path="/">
              <Project />
            </Route>
            <Route path="*">
            <ComingSoon/>
            </Route>
          </Switch>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Created by ©TranDung</Footer>
      </Layout>
    </Layout>
  );

}

export default App;
