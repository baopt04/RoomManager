import React, { useEffect, useState } from "react";
import { Modal, Form, InputNumber, Button, Select, Table, message, Space } from "antd";
import ContractService from "../../services/ContractService";
import RoomService from "../../services/RoomService";
import { div, title } from "framer-motion/client";


const ModalContractHistory = ({ visible, onClose, id }) => {
    const token = localStorage.getItem("token");
    const [listHistory, setListHistory] = useState([]);
    const [dataRoom, setDataRoom] = useState([]);
    const [dataContract, setDataContract] = useState([]);

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt"

        },
        {
            title: "Ngày ký hợp đồng",
            dataIndex: "dateStart",
            key: "dateStart",
            sorter: (a, b) => new Date(a.dateStart) - new Date(b.dateStart),
            render: (dateStart) => {
                return new Intl.DateTimeFormat("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                }).format(new Date(dateStart))
            }
        },
        {
            title: "Ngày hết hạn",
            dataIndex: "dateEnd",
            key: "dateEnd",
            sorter: (a, b) => new Date(a.dateEnd) - new Date(b.dateEnd),
            render: (dateEnd) => {
                return new Intl.DateTimeFormat("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                }).format(new Date(dateEnd))
            }
        },


        {
            title: "Tiền đặt cọc",
            dataIndex: "contractDeponsit",
            key: "contractDeponsit",
            render: (contractDeponsit) =>
                new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND"
                }).format(contractDeponsit)
        },
        {
            title: "Ngày thanh toán",
            dataIndex: "nextDueDate",
            key: "nextDueDate",
            sorter: (a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate),
            render: (nextDueDate) => {
                return new Intl.DateTimeFormat("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                }).format(new Date(nextDueDate))
            }
        },
        {
            title: "Phòng trọ thuê",
            dataIndex: "room",
            key: "room",
            sorter: (a, b) => a.room.localeCompare(b.room),
            render: (room) => {
                const roomData = dataRoom.find((item) => item.id === room)?.name;
                return roomData || "Không tìm thấy phòng";
            }
        },
        {
            title: "Giá phòng",
            dataIndex: "room",
            key: "room",
            sorter: (a, b) => a.room - b.room,
            render: (room) => {
                const roomData = dataRoom.find((item) => item.id === room)?.price;
                return roomData ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND"
                }).format(roomData) : "Không tìm thấy phòng";
            }
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                let backGroundColor ;
                let statusText;
                if (status === "KICH_HOAT") {
                    backGroundColor = "green";
                    statusText = "Đang sử dụng"
                } else if (status === "NGUNG_KICH_HOAT") {
                    backGroundColor = "orange";
                    statusText = "Ngưng sử dụng";
                } else if (status === "DUNG_KINH_DOANH") {
                    backGroundColor = "red";
                    statusText = "Ngưng kinh doanh";
                }
                return (
                    <div style={{
                        backgroundColor: backGroundColor,
                        color: "white",
                        borderRadius: "7px",
                        padding: "4px 8px",
                        textAlign: "center"
                    }}>
                        {statusText}
                    </div>
                )
            }
        }
    ]
    useEffect(() => {
        const fetchAllRoom = async () => {
            try {
                const response = await RoomService.getAllRooms(token);
                setDataRoom(response)
            } catch (error) {
                console.log(
                    "Error khi gọi server !"
                );

            }
        }
        fetchAllRoom();
    }, [token])


    useEffect(() => {
        if (visible && id) {
            const historyContract = async () => {
                try {
                    const response = await ContractService.historyContract(token, id);
                    setListHistory(response);
                } catch (error) {
                    console.error("Error fetching history electricity:", error);
                }
            };
            historyContract();
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
            title="Chi tiết lịch hợp đồng"
            onCancel={onclose}
            footer={null}
            width={1200}>
            <Table
                columns={columns}
                dataSource={listHistory}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </Modal>
    )
}
export default ModalContractHistory;