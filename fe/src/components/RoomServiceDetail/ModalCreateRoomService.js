import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Radio, Select, InputNumber, Spin } from "antd";
import { message } from "antd";
import Services from "../../services/Services";
import RoomServiceDetail from "../../services/RoomServiceDetail";
import RoomService from "../../services/RoomService";
const { Option } = Select;
const ModalCreateRoomService = ({ visible, onClose }) => {
    const token = localStorage.getItem("token");
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [dataService, setDataService] = useState([]);
    const [dataRoom, setDataRoom] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!visible) return;
            setPageLoading(true);
            try {
                const [servicesRes, roomsRes] = await Promise.all([
                    Services.getAllService(token),
                    RoomService.getAllRooms(token)
                ]);

                

                setDataService(servicesRes);
                setDataRoom(roomsRes);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setPageLoading(false);
            }
        };
        fetchData();
    }, [token, visible]);

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
            message.error("Thêm dịch vụ thất bại!");
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
            <Spin spinning={pageLoading} tip="Đang tải dữ liệu...">
                <Form
                    form={form}
                    layout="vertical"
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
            </Spin>
        </Modal>
    )
}
export default ModalCreateRoomService;

