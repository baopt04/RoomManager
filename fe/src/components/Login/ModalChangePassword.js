import React from "react";
import Modal from "antd/es/modal/Modal";
import { Button, Input, message, Form } from "antd";
import LoginService from "../../services/LoginService";
import { LockOutlined } from "@ant-design/icons";
const ModalChangePassword = ({ visible, onclose }) => {
    const [form] = Form.useForm();


    const cancel = () => {
        form.resetFields();
        onclose();
    }
    const changePassword = async (values) => {
        const email = localStorage.getItem("email")
        try {
            await LoginService.changePassword(email, values);
            message.success("Đổi mật khẩu thành công");
            form.resetFields();
            onclose();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error("Lỗi server. vui lòng thử lại sau !");
            }
        }
    }
    return (
        <Modal
            title="Thay đổi mật khẩu"
            visible={visible}
            onCancel={cancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={changePassword}
            >
                <Form.Item
                    label="Mật khẩu cũ"
                    name="passwordOld"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Nhập mật khẩu cũ"
                        size="large"
                    />
                </Form.Item>
                <Form.Item
                    label="Mật khẩu mới"
                    name="passwordNew"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Nhập mật khẩu mới"
                        size="large"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" >
                        Thay đổi
                    </Button>
                </Form.Item>
            </Form>

        </Modal>
    )
}
export default ModalChangePassword

