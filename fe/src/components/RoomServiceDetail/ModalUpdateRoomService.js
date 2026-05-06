import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Radio, Select, InputNumber, Spin } from "antd";
import { message } from "antd";
import Services from "../../services/Services";
import RoomServiceDetail from "../../services/RoomServiceDetail";
import RoomService from "../../services/RoomService";
const { Option } = Select;
const ModalUpdateRoomService = ({ visible, onClose, serviceId }) => {
    const token = localStorage.getItem("token");
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [serviceData, setServiceData] = useState([]);
    const [dataService, setDataService] = useState([]);
    const [dataRoom, setDataRoom] = useState([]);
    useEffect(() => {
        const fetchRoomServiceData = async () => {
            if (!serviceId || !visible) return;
            setPageLoading(true);
            try {
                const [response, servicesRes, roomsRes] = await Promise.all([
                    RoomServiceDetail.detailRoomServiceDetail(token, serviceId),
                    Services.getAllService(token),
                    RoomService.getAllRooms(token)
                ]);

                // Đảm bảo loading ít nhất 2 giây
                

                setDataService(servicesRes);
                setDataRoom(roomsRes);
                form.setFieldsValue({
                    service: response.service.id,
                    room: response.room.id
                });
            } catch (error) {
                
                message.error("Lỗi khi tải dữ liệu chi tiết!");
            } finally {
                setPageLoading(false);
            }
        }
        fetchRoomServiceData();
    }, [token, serviceId, visible])
    const handleUpdateService = async (values) => {
        setLoading(true);
        try {
            values = {
                service: { id: values.service },
                room: { id: values.room }
            }
            await RoomServiceDetail.updateRoomServiceDetail(token, serviceId, values);
            
            // Đảm bảo delay 2s khi cập nhật
            

            message.success("Cập nhật dịch vụ thành công!");
            onClose();
        } catch (error) {
            message.error("Cập nhật thất bại!");
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
            <Spin spinning={pageLoading} tip="Đang tải dữ liệu...">
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
            </Spin>
        </Modal>
    )
}
export default ModalUpdateRoomService;

