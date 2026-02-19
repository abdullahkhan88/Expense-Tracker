import {
    LockOutlined,
    MailOutlined,
    MobileOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Button, Card, Form, Input } from 'antd';
import { Link,useNavigate } from 'react-router-dom';
const { Item } = Form
import { message } from 'antd';
import { useState } from 'react';
import http from '../../../utils/http';



function Signup() {
    const navigate = useNavigate();
    const [signupForm] = Form.useForm();
    const [formData, setFormData] = useState(null);
    const [otp, setOtp] = useState(false);
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
      
        try {
            setLoading(true);
            const { data } = await http.post("/api/otp/send-mail", values);
            setOtp(true);
            setFormData(values);
            message.success(data.message);
            signupForm.resetFields();
        } catch (error) {
            setOtp(false);
            setFormData(null);
            message.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false)
        }
    };

    // OTP verify handle
    const onSignup = async (values) => {
        try {
            
            setLoading(true);
            const { data } = await http.post("/api/otp/verify-email",
                {
                    ...formData,
                    ...values
                }
            );
            message.success(data.message);
            navigate("/");

        } catch (error) {
            message.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false)
        }
    };


    return (
        <div className="flex">
            {/* image  container 1 */}
            <div className="w-1/2 hidden md:flex items-center justify-center">
                <img src="public/exp-img.jpg" alt="" className='w-4/5 object-contain' />
            </div>

            {/* ssecond container text */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-2 md:p-6 bg-white">
                <Card className='w-full max-w-sm shadow-xl'>
                    <h2 className='font-bold text-[#FF735C] text-2xl text-center mb-6'>Track Your Expense</h2>
                    {
                        otp ?
                            <Form
                                name='otp-form'
                                layout='vertical'
                                onFinish={onSignup}
                            >

                                <Item
                                    name="otp"
                                    label="OTP"
                                    rules={[{ required: true }]}
                                >
                                    <Input.OTP
                                        prefix={<UserOutlined />}
                                        placeholder='Enter OTP'
                                    />
                                </Item>

                                <Item>
                                    <Button
                                        loading={loading}
                                        type="text"
                                        htmlType='submit'
                                        block
                                        className='!bg-[#FF735C] !text-white !font-bold'
                                    >
                                        Verify Now
                                    </Button>
                                </Item>
                            </Form>
                            :
                            <Form
                                name='signup-form'
                                layout='vertical'
                                onFinish={onFinish}
                                form={signupForm}
                            >
                                <Item
                                    name="fullname"
                                    label="FullName"
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder='Enter your fullname'
                                    />
                                </Item>

                                <Item
                                    name="email"
                                    label="Username"
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        prefix={<MailOutlined />}
                                        placeholder='Enter your username'
                                    />
                                </Item>

                                <Item
                                    name="mobile"
                                    label="Mobile"
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        prefix={<MobileOutlined />}
                                        placeholder='Enter your Mobile'
                                    />
                                </Item>

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
                                <Item>
                                    <Button
                                        loading={loading}
                                        type="text"
                                        htmlType='submit'
                                        block
                                        className='!bg-[#FF735C] !text-white !font-bold'
                                    >
                                        Signup
                                    </Button>
                                </Item>
                            </Form>
                    }
                    <div className="flex items-center justify-between">
                        <div></div>

                        <Link
                            style={{ textDecoration: "underline" }}
                            to={"/"}
                            className='!text-[#FF735C] !font-bold'
                        >
                            Already have an account?
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Signup
