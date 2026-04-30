import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Radio, Select, InputNumber } from "antd";
import { message } from "antd";
import Services from "../../services/Services";
import RoomServiceDetail from "../../services/RoomServiceDetail";
import RoomService from "../../services/RoomService";
const { Option } = Select;
const ModalCreateRoomService = ({ visible, onClose }) => {
    const token = localStorage.getItem("token");
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [houseData, setHouseData] = useState(null);
    const [dataService, setDataService] = useState([]);
    const [dataRoom, setDataRoom] = useState([]);
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await Services.getAllService(token);
                setDataService(response);
            } catch (error) {
                console.error("Failed to fetch service:", error);
            }
        };

        fetchServices();
    }, [token]);
    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const response = await RoomService.getAllRooms(token);
                setDataRoom(response)
            }
            catch (error) {
                console.error("Failed to fetch room data:", error);
            }
        };
        fetchRoomData();
    }, [token])
    const handleAddRoomService = async (values) => {
        setLoading(true);
        try {
            values = {
                service: { id: values.service },
                room: { id: values.room }
            }
            await RoomServiceDetail.createRoomServiceDetail(token, values);
            message.success("Thêm dịch vụ thành công!");
            form.resetFields();
            onClose();
        } catch (error) {
            if (error.response) {
                const messageError = error.response.data?.message;
                if (messageError) {
                    message.error(messageError)
                }
            } else {
                message.error("Không thể kết nối đến server, vui lòng kiểm tra lại.");
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
            title="Thêm dịch vụ "
            visible={visible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={houseData}
                onFinish={handleAddRoomService}
            >

                <Form.Item
                    label="Tên phòng trọ"
                    name="room"
                    rules={[{ required: true, message: "Vui lòng chọn phòng trọ" }]}
                >
                    <Select placeholder="Vui lòng chọn phòng trọ" allowClear>
                        {dataRoom.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Tên dịch vụ"
                    name="service"
                    rules={[{ required: true, message: "Vui lòng chọn tên dịch vụ" }]}
                >
                    <Select placeholder="Vui lòng chọn tên dịch vụ" allowClear>
                        {dataService.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Thêm dịch vụ
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default ModalCreateRoomService;