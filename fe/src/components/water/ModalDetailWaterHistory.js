import React, { useEffect, useState } from "react";
import { Modal, Form, InputNumber, Button, Select, Table, message, Space } from "antd";
import WaterService from "../../services/WaterService";


const ModalDetailWaterHistory = ({ visible, onClose, id }) => {
    const token = localStorage.getItem("token");
    const [listHistory, setListHistory] = useState([]);
    const columns = [
        {
            title: "Tháng",
            dataIndex: "month",
            key: "month"

        },
        {
            title: "Năm ",
            dataIndex: "year",
            key: "year"
        },
        {
            title: "Số điện đầu",
            dataIndex: "numberFirst",
            key: "numberFirst",
            render: (numberFirst) =>
                new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND"
                }).format(numberFirst)
        },
        {
            title: "Số điện cuối",
            dataIndex: "numberLast",
            key: "numberLast",
            render: (numberLast) =>
                new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND"
                }).format(numberLast)
        },
        {
            title: "Đơn giá",
            dataIndex: "unitPrice",
            key: "unitPrice",
            render: (unitPrice) =>
                new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND"
                }).format(unitPrice)
        },
        {
            title: "Số điện đóng",
            dataIndex: "usedNumber",
            key: "usedNumber",
            render: (usedNumber) =>
                new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND"
                }).format(usedNumber)
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (totalPrice) =>
                new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND"
                }).format(totalPrice)
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <div style={{
                    color: status === "DA_THANH_TOAN" ? "green" : "red"
                }}>
                    {status === "CHUA_THANH_TOAN" ? "Chưa thanh toán" : "Đã thanh toán"}
                </div>
            )
        },


    ]
    useEffect(() => {
        if (visible && id) {
            const historyWater = async () => {
                try {
                    const response = await WaterService.historyWater(token, id);
                    setListHistory(response);
                } catch (error) {
                    console.error("Error fetching history electricity:", error);
                }
            };
            historyWater();
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
            title="Chi tiết lịch sử nước"
            onCancel={onclose}
            footer={null}
            width={800}>
            <Table
                columns={columns}
                dataSource={listHistory}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </Modal>
    )
}
export default ModalDetailWaterHistory;
