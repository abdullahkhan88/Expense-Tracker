import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message,Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
const {Item} = Form
import { useState } from 'react'
import http from '../../../utils/http';


function Login() {

    const navigate = useNavigate();
    const [loginForm] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onLogin = async (values) =>{
        try {
            setLoading(true);
            const {data} = await http.post('api/user/login',values);
            const {role} = data;
            
            // Admin Login
            if(role === "admin"){
                return message.success("Admin try to login");
            };

            // User Login
            if(role === "user"){
                return navigate("/app/user");
            };
            
            
        } catch (error) {
           message.error(
                error.response?.data?.message || "Something went wrong"
            );
        }finally{
            setLoading(false);
        }
        
    }

    return (
        <div className="flex">
             {loading && <Spin fullscreen />}
            {/* image  container 1 */}
            <div className="w-1/2 hidden md:flex items-center justify-center">
                <img src="public/exp-img.jpg" alt="" className='w-4/5 object-contain' />
            </div>

            {/* second container text */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-2 md:p-6 bg-white">
                <Card className='w-full max-w-sm shadow-xl'>
                    <h2 className='font-bold text-[#FF735C] text-2xl text-center mb-6'>Track Your Expense</h2>
                    <Form 
                    name='login-form'
                    layout='vertical'
                    onFinish={onLogin}
                    form={loginForm}
                    >
                        <Item 
                        name="email"
                        label="Username"
                        rules={[{required:true}]}
                        >
                            <Input
                             prefix={<UserOutlined/>}
                             placeholder='Enter your username'
                            />
                        </Item>

                        <Item 
                        name="password"
                        label="Password"
                        rules={[{required:true}]}
                        >
                            <Input.Password
                             prefix={<LockOutlined/>}
                             placeholder='Enter your Password'
                            />
                        </Item>
                        <Item>
                            <Button
                            type="text"
                            loading={loading}
                            htmlType='submit'
                            block
                            className='!bg-[#FF735C] !text-white !font-bold'
                            >
                                Login
                            </Button>
                        </Item>
                    </Form>
                    <div className="flex items-center justify-between">
                        <Link
                        style={{ textDecoration:"underline"}}
                        to="/forgot-password"
                        className='!text-[#FF735C] !font-bold'
                        
                        >
                         Forget Password
                        </Link>

                        <Link 
                         style={{textDecoration:"underline"}}
                         to={"/signup"}
                         className='!text-[#FF735C] !font-bold'
                        >
                        Don't have an account?
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Login