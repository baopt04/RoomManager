import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, InputNumber, message, Upload, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import RoomService from "../../services/RoomService";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import "./CreateRoom.css";
import HouseForRentService from "../../services/HouseForRentService";
import CustomerService from "../../services/CustomerService";
const CreateRoom = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    const [houseForRentData, setHouseForRentData] = useState([]);
    const [customerData, setCustomerData] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
        const fetchHouseForRent = async () => {
            try {
                const response = await HouseForRentService.getAllHouseForRent(token);
                setHouseForRentData(response);
            } catch (error) {
                console.error("Failed to fetch house for rent data:", error);
                throw error;
            }
        }
        fetchHouseForRent();
    }, [token]);
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await CustomerService.getAllCustomers(token);
                setCustomerData(response);
            } catch (error) {
                console.error("Failed to fetch customer data:", error);
                throw error;
            }
        };
        fetchCustomer();
    }, [token]);
    const updateImage = ({ fileList: newFileList }) => {
        setFileList(newFileList)
    }
    const handleAddRoom = async (values) => {
        Modal.confirm({
            title: 'Xác nhận thêm phòng trọ',
            content: 'Bạn có chắc chắn muốn thêm phòng trọ mới này không?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                setLoading(true);
                try {
                    const formData = new FormData();
                    formData.append("name", values.name);
                    formData.append("price", values.price);
                    formData.append("acreage", values.acreage);
                    formData.append("peopleMax", values.peopleMax);
                    formData.append("status", values.status);
                    formData.append("type", values.type);
                    formData.append("houseForRentId", values.houseForRent);
                    if (values.customer) {
                        formData.append("customerId", values.customer);
                    }
                    formData.append("decription", values.decription);

                    fileList.forEach((file, idx) => {
                        if (file.originFileObj) {
                            formData.append("images", file.originFileObj);
                        }
                    });

                    await RoomService.createRoom(token, formData);
                    message.success("Thêm phòng trọ thành công!");
                    navigate("/room-management");
                } catch (error) {
                    if (error.message && error.response.data && error.response.data.message) {
                        message.error(error.response.data.message);
                    } else {
                        message.error("Lỗi server, vui lòng thử lại sau!");
                    }
                } finally {
                    setLoading(false);
                }
            }
        });
    }
    return (
        <div className="create-room-container">
            <div style={{ marginBottom: 16 }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/room-management')}
                    style={{ paddingLeft: 0, fontWeight: 500 }}
                >
                    Quay lại
                </Button>
            </div>
            <h2 style={{ textAlign: 'center ', fontSize: isMobile ? '28px' : '30px', marginTop: 0 }}>Thêm phòng trọ mới</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleAddRoom}
                style={{ maxWidth: "auto", margin: "0 auto" }}
            >
                <div className="form-row">
                    <Form.Item
                        label="Tên phòng trọ"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên phòng trọ" }]}
                        className="form-item">
                        <Input placeholder="Nhập tên phòng trọ" />
                    </Form.Item>
                    <Form.Item label="Giá phòng trọ"
                        name="price"
                        rules={[{ required: true, message: "Vui lòng nhập giá phòng trọ" }]}
                        className="form-item">
                        <InputNumber placeholder="Nhập giá phòng trọ"
                            style={{ width: '100%' }}
                            formatter={(value) =>
                                value?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ₫'
                            }
                            parser={(value) =>
                                value?.replace(/\₫\s?|(,*)/g, '')
                            }
                            min={0}
                        />
                    </Form.Item>

                </div>

                <div className="form-row">
                    <Form.Item
                        label="Diện tích phòng trọ"
                        name="acreage"
                        rules={[{ required: true, message: "Vui lòng nhập diện tích phòng trọ" }]}
                        className="form-item">
                        <Input placeholder="Nhập diện tích  phòng trọ" />
                    </Form.Item>
                    <Form.Item label="Số lượng người ở"
                        name="peopleMax"
                        rules={[{ required: true, message: "Vui lòng nhập số lượng người ở" }]}
                        className="form-item">
                        <InputNumber placeholder="Nhập số lượng người ở"
                            style={{ width: '100%' }} />
                    </Form.Item>


                </div>

                <div className="form-row">
                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                        className="form-item">
                        <Select placeholder="Chọn trạng thái" allowClear>
                            <Select.Option value="DANG_CHO_THUE">Đang cho thuê</Select.Option>
                            <Select.Option value="TRONG">Trống</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Loại phòng"
                        name="type"
                        rules={[{ required: true, message: "Vui lòng nhập loại phòng trọ" }]}
                        className="form-item">
                        <Input placeholder="Nhập loại  phòng trọ" />
                    </Form.Item>

                </div>
                <div className="form-row">
                    <Form.Item
                        label="Nhà cho thuê"
                        name="houseForRent"
                        rules={[{ required: true, message: "Vui lòng chọn nhà cho thuê" }]}
                        className="form-item">
                        <Select placeholder="Chọn nhà cho thuê" allowClear>
                            {houseForRentData.map((house) => (
                                <Select.Option key={house.id} value={house.id}>
                                    {house.name}
                                </Select.Option>
                            ))}

                        </Select>
                    </Form.Item>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.status !== currentValues.status}
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('status') === 'DANG_CHO_THUE' ? (
                                <Form.Item label="Người đại diện thuê"
                                    name="customer"
                                    rules={[{ required: true, message: "Vui lòng chọn người đại diện thuê" }]}
                                    className="form-item">
                                    <Select placeholder="Chọn người đại diện thuê" allowClear>
                                        {customerData.map((customer) => (
                                            <Select.Option key={customer.id} value={customer.id}>
                                                {customer.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            ) : null
                        }
                    </Form.Item>



                </div>
                <div className="form-row">

                    <Form.Item label="Mô tả phòng trọ"
                        name="decription"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                        className="form-item"
                        style={{ lineHeight: '1' }}>
                        <Input.TextArea placeholder="Nhập mô tả phòng trọ" rows={4} />
                    </Form.Item>


                </div>
                <div className="form-row">

                    <Form.Item
                        label="Ảnh phòng trọ"
                        name="images"
                    >
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={updateImage}
                            beforeUpload={() => false}
                            multiple
                            style={{ display: "flex", gap: 16 }}
                        >
                            {fileList.length < 8 && (
                                <Button icon={<UploadOutlined />} style={{ height: '100px' }}>Chọn ảnh</Button>
                            )}
                        </Upload>
                    </Form.Item>
                </div>
                <div className="form-submit">
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Thêm  phòng trọ mới
                    </Button>
                </div>

            </Form>

        </div>
    )
}
export default CreateRoom;