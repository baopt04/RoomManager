import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Radio, Select, InputNumber } from "antd";
import { message } from "antd";
import HostService from "../../services/HostService";
import HouseForRentService from "../../services/HouseForRentService";
import Services from "../../services/Services";
const { Option } = Select; // Import Option from Select
const ModalUpdateService = ({ visible, onClose, serviceId }) => {
    const token = localStorage.getItem("token");
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [serviceData, setServiceData] = useState([]);

    useEffect(() => {
        const fetchServiceData = async () => {
            if (!serviceId) return;
            try {

                const response = await Services.detailService(token, serviceId);
                form.setFieldsValue({
                    name: response.name,
                    price: response.price,
                    unitOfMeasure: response.unitOfMeasure,
                    discription: response.discription
                })
            } catch (error) {
                console.log("Không thể kết nối đến service!");
            }
        }
        fetchServiceData();
    }, [token, serviceId])

    const handleUpdateService = async (values) => {
        setLoading(true);
        try {

            await Services.updateService(token, serviceId, values);
            window.location.reload();
            message.success("Cập nhật dịch vụ thành công!");
            onClose();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error("Đã xảy ra lỗi không xác định từ server!");
            }
            setLoading(false);
        };
    };
    const handleCancel = () => {
        form.resetFields();
        onClose();
    }
    return (
        <Modal
            title="Cập nhật dịch vụ "
            visible={visible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdateService}
            >
                <Form.Item
                    label="Tên dịch vụ"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ" }]}
                >
                    <Input placeholder="Nhập tên dịch vụ" />
                </Form.Item>
                <Form.Item
                    label="Giá"
                    name="price"
                    rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Nhập giá"
                        formatter={(value) =>
                            value?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ₫'
                        }
                        parser={(value) =>
                            value?.replace(/\₫\s?|(,*)/g, '')
                        }
                        min={0}
                    />
                </Form.Item>
                <Form.Item
                    label="Đơn vị tính"
                    name="unitOfMeasure"
                    rules={[{ required: true, message: "Vui lòng chọn đơn vị tính " }]}
                >
                    <Select placeholder="Chọn đơn vị tính ">
                        <Option value="THÁNG">Tháng</Option>
                        <Option value="NĂM">Năm</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Ghi chú"
                    name="discription"
                    rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
                >
                    <Input.TextArea placeholder="Nhập ghi chú" rows={4} />
                </Form.Item>

                <Form.Item style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Cập nhật dịch vụ
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default ModalUpdateService;