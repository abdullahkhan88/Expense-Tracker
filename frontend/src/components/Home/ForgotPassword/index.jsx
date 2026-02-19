import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Spin } from 'antd';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
const { Item } = Form
import { useEffect, useState } from 'react'

import http from '../../../utils/http';


function ForgotPassword() {

    const navigate = useNavigate();
    const [params] = useSearchParams();

    const [forgotForm] = Form.useForm();
    const [rePasswordForm] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const tok = params.get("token");
        if (tok) {
            checkToken(tok);
        } else {
            setToken(null)
        }
    }, [params]);

    const checkToken = async (tok) => {
        try {
            http.post("/api/user/verify-token", {}, {
                headers: {
                    Authorization: `Bearer ${tok}`
                }
            });
            setToken(tok)
        } catch (err) {
            setToken(null);
        }
    }

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const { data } = await http.post('api/user/forgot-password', values);
            message.success(data?.message);
        } catch (error) {
            message.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }

    };

    // change password 
    const onChangePassword = async (values) => {
        try {
            if(values.password !== values.rePassword){
                return message.warning("Password & Re-Password Not Matched");
            }
            setLoading(true);
            const { data } = await http.put('api/user/change-password', values, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            message.success(data?.message);
            setTimeout(()=>{
                navigate('/')
            },3000)
        } catch (error) {
            message.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }

    };



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
                    <h2 className='font-bold text-[#FF735C] text-2xl text-center mb-6'>
                        {
                            token ?
                                "Change Password"
                                :
                                "Forgot Password"
                        }
                    </h2>
                    {
                        token ? <Form
                            name='login-form'
                            layout='vertical'
                            onFinish={onChangePassword}
                            form={rePasswordForm}
                        >
                            <Item
                                name="password"
                                label="Password"
                                rules={[{ required: true }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder='Enter your Password'
                                />
                            </Item>
                            <Item
                                name="rePassword"
                                label="Re Enter Password"
                                rules={[{ required: true }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
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
                                    Change Password
                                </Button>
                            </Item>
                        </Form>
                            :
                            <Form
                                name='login-form'
                                layout='vertical'
                                onFinish={onFinish}
                                form={forgotForm}
                            >
                                <Item
                                    name="email"
                                    label="Email"
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder='Enter your Email'
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
                                        Submit
                                    </Button>
                                </Item>
                            </Form>
                    }


                    <div className="flex items-center justify-between">
                        <Link
                            style={{ textDecoration: "underline" }}
                            to="/"
                            className='!text-[#FF735C] !font-bold'

                        >
                            Sign in
                        </Link>

                        <Link
                            style={{ textDecoration: "underline" }}
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

export default ForgotPassword;