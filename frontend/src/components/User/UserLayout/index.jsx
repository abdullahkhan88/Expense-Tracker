import { AppstoreAddOutlined, BarChartOutlined, DollarCircleOutlined, LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import { Button, Image, Layout, Menu, message, theme } from "antd";
import { useState } from "react";


import { Outlet, useNavigate,useLocation } from "react-router-dom";
import fetcher from "../../../utils/fetcher";
import Loader from "../../Shared/Loader";
import http from "../../../utils/http";
const { Sider, Header, Content, } = Layout;

const UserLayout = () => {

  const navigate = useNavigate();
  const {pathname} = useLocation();
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);


  const handleNavigate = (menu) => {
    navigate(menu.key)
  };

  // logout

  const logout = async () =>{
    try {
      setLoading(true)
      await http.get("/api/user/logout");
      navigate('/')
      setLoading(false)
    } catch (err) {
      setLoading(false)
      message.error(err.response? err.response.data.message : err.message);
    }
  }

  const {
    token:{colorBgContainer,borderRadiusLG}
  } = theme.useToken();


  const items = [
    {
      key: "/app/user/dashboard",
      label: "Dashboard",
      icon: <AppstoreAddOutlined />
    },
    {
      key: "/app/user/report",
      label: "Reports",
      icon: <BarChartOutlined />
    },
    {
      key: "/app/user/transaction",
      label: "Transaction",
      icon: <DollarCircleOutlined />
    },
  ];

  const siderStyle = {
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: 'stable',
  };

  const headerStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  };

  return (
    <Layout className="!min-h-screen">
      <Sider style={siderStyle} collapsible collapsed={open}>
        <div className="flex items-center justify-center my-4">
          <Image
            src="/exp-img.jpg"
            width={60}
            height={60}
            alt="logo"
            className="rounded-full !text-center mx-auto mb-3"
          />
        </div>
        <Menu
          defaultSelectedKeys={[pathname]}
          theme="dark"
          items={items}
          onClick={handleNavigate}
        />
      </Sider>
      <Layout>
        <Header style={headerStyle} className="flex items-center justify-between !px-5 !bg-white !shadow">
          <Button
            onClick={() => setOpen(!open)}
            icon={<MenuOutlined />}
          />
          <Button onClick={logout}
            loading={loading}
            icon={<LogoutOutlined />}
          />
        </Header>
        <Content style={{
          margin:"4px 8px",
          padding:4,
          minHeight:280,
          background:colorBgContainer,
          borderRadius:borderRadiusLG
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
};
export default UserLayout