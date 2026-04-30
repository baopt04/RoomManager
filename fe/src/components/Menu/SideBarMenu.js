import React from 'react';
import { Layout, Menu } from 'antd';
import {
  BarChartOutlined,
  UserOutlined,
  HomeOutlined,
  ApartmentOutlined,
  FileTextOutlined,
  CloudOutlined,
  ThunderboltOutlined,
  SettingOutlined,
  ToolOutlined,
  DollarOutlined,
  CarOutlined,
  TeamOutlined,
  CrownOutlined,
  AppstoreOutlined,
  PlusCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from "react-router-dom";
import logo from '../../assets/logo.png';

const { Sider } = Layout;

const SidebarMenu = ({ onClose }) => {
  const navigator = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => {
    const path = location.pathname;
    const map = {
      '/statistical': '1',
      '/host-management': '2',
      '/houseForRent-management': '3',
      '/room-management': '4',
      '/contract-management': '5',
      '/customer-management': '6',
      '/water-management': '7',
      '/electricity-management': '8',
      '/service-management': '9',
      '/roomSerivce-management': '10',
      '/maintenance-management': '11',
      '/car-management': '12',
      '/bill-management': '13',
      '/sale-counter': '14',
      '/admin-management': '15',
      '/room-viewing-management': '16',
    };
    for (const [key, value] of Object.entries(map)) {
      if (path.startsWith(key)) return value;
    }
    return '1';
  };

  const menuItems = [
    {
      type: 'group',
      label: 'TỔNG QUAN',
      children: [
        { key: '1', icon: <BarChartOutlined />, label: 'Thống kê', path: '/statistical' },
      ],
    },
    {
      type: 'group',
      label: 'QUẢN LÝ',
      children: [
        { key: '2', icon: <UserOutlined />, label: 'Chủ nhà', path: '/host-management' },
        { key: '3', icon: <HomeOutlined />, label: 'Nhà cho thuê', path: '/houseForRent-management' },
        { key: '4', icon: <ApartmentOutlined />, label: 'Phòng trọ', path: '/room-management' },
        { key: '5', icon: <FileTextOutlined />, label: 'Hợp đồng', path: '/contract-management' },
        { key: '6', icon: <TeamOutlined />, label: 'Khách hàng', path: '/customer-management' },
        { key: '16', icon: <EyeOutlined />, label: 'Người xem nhà', path: '/room-viewing-management' },
      ],
    },
    {
      type: 'group',
      label: 'DỊCH VỤ',
      children: [
        { key: '7', icon: <CloudOutlined />, label: 'Nước', path: '/water-management' },
        { key: '8', icon: <ThunderboltOutlined />, label: 'Điện', path: '/electricity-management' },
        { key: '9', icon: <SettingOutlined />, label: 'Dịch vụ', path: '/service-management' },
        { key: '10', icon: <AppstoreOutlined />, label: 'DV phòng trọ', path: '/roomSerivce-management' },
        { key: '11', icon: <ToolOutlined />, label: 'Bảo trì', path: '/maintenance-management' },
        { key: '12', icon: <CarOutlined />, label: 'Xe máy', path: '/car-management' },
      ],
    },
    {
      type: 'group',
      label: 'TÀI CHÍNH',
      children: [
        { key: '13', icon: <DollarOutlined />, label: 'Hóa đơn', path: '/bill-management' },
        { key: '14', icon: <PlusCircleOutlined />, label: 'Tạo hóa đơn', path: '/sale-counter' },
      ],
    },
    {
      type: 'group',
      label: 'HỆ THỐNG',
      children: [
        { key: '15', icon: <CrownOutlined />, label: 'Admin', path: '/admin-management' },
      ],
    },
  ];

  const handleClick = ({ key }) => {
    // Find the path from menuItems
    for (const group of menuItems) {
      const item = group.children.find((c) => c.key === key);
      if (item) {
        navigator(item.path);
        if (onClose) onClose();
        return;
      }
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: '#ffffff',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <img
          src={logo}
          alt="Logo"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
          }}
        />
        <span style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#1a1a2e',
          fontFamily: "'Inter', sans-serif",
        }}>
          Quản lý phòng trọ
        </span>
      </div>

      {/* Menu */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '8px 0',
      }}>
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          onClick={handleClick}
          style={{
            border: 'none',
            background: 'transparent',
            fontFamily: "'Inter', sans-serif",
          }}
          items={menuItems.map((group) => ({
            type: 'group',
            label: (
              <span style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#9ca3af',
                letterSpacing: '0.5px',
                padding: '0 12px',
              }}>
                {group.label}
              </span>
            ),
            children: group.children.map((item) => ({
              key: item.key,
              icon: item.icon,
              label: item.label,
            })),
          }))}
        />
      </div>

      {/* Sidebar CSS */}
      <style>{`
        /* Sidebar menu items */
        .ant-menu-inline .ant-menu-item {
          height: 36px !important;
          line-height: 36px !important;
          margin: 2px 8px !important;
          padding: 0 12px !important;
          border-radius: 10px !important;
          font-size: 13px !important;
          font-weight: 400 !important;
          color: #4b5563 !important;
          width: calc(100% - 16px) !important;
        }

        .ant-menu-inline .ant-menu-item:hover {
          background: #f3f4f6 !important;
          color: #1a1a2e !important;
        }

        .ant-menu-inline .ant-menu-item-selected {
          background: #e6f4ff !important;
          color: #1677ff !important;
          font-weight: 500 !important;
        }

        .ant-menu-inline .ant-menu-item-selected .anticon {
          color: #1677ff !important;
        }

        .ant-menu-item-group-title {
          padding: 16px 8px 4px 8px !important;
          font-size: 11px !important;
        }

        /* Remove extra borders & backgrounds */
        .ant-menu-light {
          border-inline-end: none !important;
        }

        .ant-menu-inline .ant-menu-item::after {
          border-right: none !important;
        }

        /* Sidebar scrollbar */
        .ant-layout-sider ::-webkit-scrollbar,
        div[style*="overflow"] ::-webkit-scrollbar {
          width: 4px;
        }

        div[style*="overflow"] ::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 2px;
        }

        @media (max-width: 1024px) {
          .ant-menu-inline .ant-menu-item {
            height: 34px !important;
            line-height: 34px !important;
            font-size: 12px !important;
            margin: 2px 6px !important;
            width: calc(100% - 12px) !important;
          }

          .ant-menu-item-group-title {
            padding-top: 12px !important;
            font-size: 10px !important;
          }
        }

        @media (max-width: 768px) {
          .ant-menu-inline .ant-menu-item {
            height: 32px !important;
            line-height: 32px !important;
            padding: 0 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SidebarMenu;