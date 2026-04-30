import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Radio, Select, InputNumber } from "antd";
import { message } from "antd";
import Services from "../../services/Services";
import RoomServiceDetail from "../../services/RoomServiceDetail";
import RoomService from "../../services/RoomService";
const { Option } = Select;
const ModalUpdateRoomService = ({ visible, onClose, serviceId }) => {
    const token = localStorage.getItem("token");
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [serviceData, setServiceData] = useState([]);
    const [dataService, setDataService] = useState([]);
    const [dataRoom, setDataRoom] = useState([]);
    useEffect(() => {
        const fetchRoomServiceData = async () => {
            if (!serviceId) return;
            try {

                const response = await RoomServiceDetail.detailRoomServiceDetail(token, serviceId);
                form.setFieldsValue({
                    service: response.service.id,
                    room: response.room.id
                })
            } catch (error) {
                console.log("Không thể kết nối đến service!");
            }
        }
        fetchRoomServiceData();
    }, [token, serviceId])
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
    const handleUpdateService = async (values) => {
        setLoading(true);

        try {
            values = {
                service: { id: values.service },
                room: { id: values.room }
            }
            await RoomServiceDetail.updateRoomServiceDetail(token, serviceId, values);
            message.success("Cập nhật dịch vụ thành công!");
            onClose();
        } catch (error) {
            if (error.response && error.response.data) {
                const messageError = error.response.data?.message;
                if (messageError) {
                    message.error(messageError);
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
                        Cập nhật dịch vụ
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default ModalUpdateRoomService;