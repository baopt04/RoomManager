import React, { useEffect, useState } from "react";
import { Modal, Form, InputNumber, Button, Select, Table, message } from "antd";
import CustomerService from "../../services/CustomerService";
import RoomService from "../../services/RoomService";
const ModalDetailRoomHistory = ({ visible, onClose, id }) => {
    const token = localStorage.getItem("token");
    const [listHistory, setListHistory] = useState([]);
    const [listCustomer, setListCustomer] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
        const fetchCustomers = async () => {
            try {

                const response = await CustomerService.getAllCustomers(token);
                setListCustomer(response);
            } catch (error) {
                console.error("Error fetching customers:", error);
                message.error("Không thể lấy danh sách khách hàng!");
            }
        };
        fetchCustomers();
    }, [token]);

    const columns = [
        {
            title: "Stt",
            dataIndex: "stt",
            key: "stt"

        },
        {
            title: "Ngày bắt đầu ",
            dataIndex: "startDate",
            key: "startDate",
            render: (startDate) => new Date(startDate).toLocaleDateString("vi-VN")
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "endDate",
            key: "endDate",
            render: (endDate) => new Date(endDate).toLocaleDateString("vi-VN")
        },
        {
            title: "Giá phòng",
            dataIndex: "price",
            key: "price",
            render: (price) =>
                new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND"
                }).format(price)
        },
        {
            title: "Khách hàng",
            dataIndex: "customer",
            key: "customer",
            render: (customer) => {
                const customerName = listCustomer.find((item) => item.id === customer)?.name;
                return customerName ? customerName : "Không có thông tin";
            }
        },

        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <div style={{

                }}>
                    {status === "DANG_CHO_THUE" ? "Đang cho thuê" : "Hết hạn"}
                </div>
            )
        },
        {
            title: "Thanh toán",
            dataIndex: "isPaid",
            key: "isPaid",
            render: (isPaid) => (
                <div style={{
                    color: isPaid ? "green" : "red"
                }}>
                    {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </div>
            )
        }
    ]
    useEffect(() => {
        if (visible && id) {
            const historyRoom = async () => {
                try {
                    const response = await RoomService.findAllRoomHistory(token, id);
                    setListHistory(response);
                } catch (error) {
                    console.error("Error fetching history electricity:", error);
                }
            };
            historyRoom();
        }
        if (!visible) {
            setListHistory([]);
        }
    }, [visible, id, token]);
    const onclose = () => {
        onClose();
    }
    return (
        <Modal
            visible={visible}
            title="Chi tiết lịch sử thanh toán phòng"
            onCancel={onclose}
            footer={null}
            width={isMobile ? "92%" : 800}
            style={{ top: isMobile ? 16 : 40 }}
            bodyStyle={{ padding: isMobile ? 12 : 24 }}>
            <Table
                columns={columns}
                dataSource={listHistory}
                rowKey="id"
                pagination={{ pageSize: 10, showSizeChanger: !isMobile }}
                scroll={{ x: 900 }}
                size={isMobile ? "small" : "middle"}
            />
        </Modal>
    )
}
export default ModalDetailRoomHistory;

