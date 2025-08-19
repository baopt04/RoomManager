import React, { useState, useEffect } from "react";
import { Modal, Form, InputNumber, Button, Select, message, Input, } from "antd";
import WaterService from "../../services/WaterService";
import RoomService from "../../services/RoomService";
import MaintencanceService from "../../services/MaintencanceService";
const ModalUpdateMain = ({ visible, onClose, id }) => {
    const [form] = Form.useForm(); // Tạo form instance
    const [loading, setLoading] = useState(false);
    const [room, setRoom] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await RoomService.getAllRooms(token);
                setRoom(response);
            } catch (error) {
                console.error("Không thể kết nối đến service", error);
            }
        };
        fetchRoom();
    }, [token]);

    useEffect(() => {
        const fetchMain = async () => {
            try {
                const response = await MaintencanceService.detailMainTen(token, id);
                const formattedDataRequest = response.dataRequest
                    ? new Date(response.dataRequest).toISOString().split("T")[0]
                    : null;
                const formattedDataComplete = response.dataComplete
                    ? new Date(response.dataComplete).toISOString().split("T")[0]
                    : null;
                form.setFieldsValue({
                    room: response.room.id,
                    name: response.name,
                    dataRequest: formattedDataRequest,
                    dataComplete: formattedDataComplete,
                    expense: response.expense,
                    description: response.description,
                    status: response.status
                })
            } catch (error) {
                console.log("Lỗi lấy dữ liệu server");

            }
        }
        fetchMain();
    }, [token, id])

    const updateMain = async (values) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                room: { id: values.room },
            };
            await MaintencanceService.updateMainTen(token, id, payload);
            message.success("Cập nhật thành công!");
            window.location.reload();
            form.resetFields();
            onClose();
        } catch (error) {
            if (error.response) {
                console.error("Error response:", error.response);
                const messageError = error.response.data?.message;
                if (messageError) {
                    message.error(messageError);
                } else {
                    message.error("Đã xảy ra lỗi không xác định từ server!");
                }
            } else {
                console.error("Error:", error);
                message.error("Không thể kết nối đến server, vui lòng thử lại!");
            }
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = () => {
        form.resetFields();
        onClose();
    }
    return (
        <Modal
            title="Thêm bảo trì phòng trọ"
            visible={visible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={updateMain}

            >
                <Form.Item
                    label="Tên phòng trọ"
                    name="room"
                    rules={[{ required: true, message: "Vui lòng nhập tên nhà thuê" }]}
                >
                    <Select placeholder="Chọn phòng trọ" allowClear>
                        {room.map((roomId) => (
                            <Select.Option key={roomId.id} value={roomId.id}>
                                {roomId.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Tên dịch vụ"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ" }]}
                >
                    <Input
                        style={{ width: "100%" }}
                        placeholder="Nhập tên dịch vụ"
                    />
                </Form.Item>
                <Form.Item
                    label="Ngày tiếp nhận"
                    name="dataRequest"
                    rules={[
                        { required: true, message: "Vui lòng chọn ngày tiếp nhận" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const dataComplete = getFieldValue("dataComplete");
                                if (dataComplete && value > dataComplete) {
                                    return Promise.reject(
                                        new Error("Ngày tiếp nhận không được lớn hơn ngày hoàn thành")
                                    );
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <Input type="date"
                        style={{ width: "100%" }}

                    />
                </Form.Item>
                <Form.Item
                    label="Ngày hoàn thành"
                    name="dataComplete"
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const status = getFieldValue("status");
                                if (status === "HOAN_THANH" && !value) {
                                    return Promise.reject(
                                        new Error("Vui lòng nhập ngày hoàn thành khi trạng thái là 'Hoàn thành'")
                                    );
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <Input type="date"
                        style={{ width: "100%" }}

                    />
                </Form.Item>
                <Form.Item
                    label="Đơn giá"
                    name="expense"
                    rules={[{ required: true, message: "Vui lòng nhập đơn giá" }]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
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
                    label="Ghi chú"
                    name="description"
                    rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
                >
                    <Input
                        style={{ width: "100%" }}
                        placeholder="Vui lòng nhập ghi chú"
                    />
                </Form.Item>
                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                >
                    <Select placeholder="Chọn trạng thái" allowClear>
                        <Select.Option value="HOAN_THANH">Đã hoàn thành</Select.Option>
                        <Select.Option value="DANG_SUA_CHUA">Chưa hoàn thành</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item style={{ textAlign: "center" }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Cập nhật dịch vụ
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalUpdateMain;