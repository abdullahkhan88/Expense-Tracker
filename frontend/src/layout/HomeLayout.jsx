import { Layout, theme } from "antd";
import { Outlet } from "react-router-dom";

const { Header, Footer, Content } = Layout;



const HomeLayout = () => {

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout  style={{ minHeight: "100vh" }}>
            <Header className="!bg-[#FF735C] flex items-center justify-center">
                <h1 className="text-white text-lg md:text-3xl font-bold text-center">
                    Expense Tracker App
                </h1>
            </Header>
            <Content style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}
            >
                <Outlet />
            </Content>
            <Footer className="!bg-[#FF735C] p-8 text-white">
                <h1 className="text-white text-lg md:text-3xl font-bold text-center">
                    Welcome to Footer
                </h1>
            </Footer>
        </Layout>
    )
}
export default HomeLayout;