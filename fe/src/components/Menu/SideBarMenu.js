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
import logo from '../../assets/tien_duc_land_logo_2.png';

const { Sider } = Layout;

const SidebarMenu = ({ onClose }) => {
  const navigator = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => {
    const path = location.pathname;
    const map = {
      '/admin/statistics': '1',
      '/admin/hosts': '2',
      '/admin/houses-for-rent': '3',
      '/admin/rooms': '4',
      '/admin/contracts': '5',
      '/admin/customers': '6',
      '/admin/waters': '7',
      '/admin/electricities': '8',
      '/admin/services': '9',
      '/admin/room-services': '10',
      '/admin/maintenances': '11',
      '/admin/cars': '12',
      '/admin/bills': '13',
      '/admin/bills/create': '14',
      '/admin/admins': '15',
      '/admin/room-viewings': '16',
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
        { key: '1', icon: <BarChartOutlined />, label: 'Thống kê', path: '/admin/statistics' },
      ],
    },
    {
      type: 'group',
      label: 'QUẢN LÝ',
      children: [
        { key: '2', icon: <UserOutlined />, label: 'Chủ nhà', path: '/admin/hosts' },
        { key: '3', icon: <HomeOutlined />, label: 'Nhà cho thuê', path: '/admin/houses-for-rent' },
        { key: '4', icon: <ApartmentOutlined />, label: 'Phòng trọ', path: '/admin/rooms' },
        { key: '5', icon: <FileTextOutlined />, label: 'Hợp đồng', path: '/admin/contracts' },
        { key: '6', icon: <TeamOutlined />, label: 'Khách hàng', path: '/admin/customers' },
        { key: '16', icon: <EyeOutlined />, label: 'Người xem nhà', path: '/admin/room-viewings' },
      ],
    },
    {
      type: 'group',
      label: 'DỊCH VỤ',
      children: [
        { key: '7', icon: <CloudOutlined />, label: 'Nước', path: '/admin/waters' },
        { key: '8', icon: <ThunderboltOutlined />, label: 'Điện', path: '/admin/electricities' },
        { key: '9', icon: <SettingOutlined />, label: 'Dịch vụ', path: '/admin/services' },
        { key: '10', icon: <AppstoreOutlined />, label: 'DV phòng trọ', path: '/admin/room-services' },
        { key: '11', icon: <ToolOutlined />, label: 'Bảo trì', path: '/admin/maintenances' },
        { key: '12', icon: <CarOutlined />, label: 'Xe máy', path: '/admin/cars' },
      ],
    },
    {
      type: 'group',
      label: 'TÀI CHÍNH',
      children: [
        { key: '13', icon: <DollarOutlined />, label: 'Hóa đơn', path: '/admin/bills' },
        { key: '14', icon: <PlusCircleOutlined />, label: 'Tạo hóa đơn', path: '/admin/bills/create' },
      ],
    },
    {
      type: 'group',
      label: 'HỆ THỐNG',
      children: [
        { key: '15', icon: <CrownOutlined />, label: 'Admin', path: '/admin/admins' },
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
      background: 'var(--color-surface)',
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'background 0.3s, border-color 0.3s'
    }}>
      {/* Logo */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--color-border)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'border-color 0.3s'
      }}>
        <img
          src={logo}
          alt="Logo"
          style={{
            width: '45px',
            height: '32px',
            borderRadius: '6px',
          }}
        />
        <span style={{
          fontSize: '15px',
          fontWeight: '600',
          color: 'var(--color-text)',
          fontFamily: "'Inter', sans-serif",
          transition: 'color 0.3s'
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
                color: 'var(--color-text-secondary)',
                letterSpacing: '0.5px',
                padding: '0 12px',
                transition: 'color 0.3s'
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
          color: var(--color-text-secondary) !important;
          width: calc(100% - 16px) !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        .ant-menu-inline .ant-menu-item:hover {
          background: var(--table-hover-bg) !important;
          color: var(--color-text) !important;
        }

        .ant-menu-inline .ant-menu-item-selected {
          background: var(--color-primary) !important;
          color: #ffffff !important;
          font-weight: 500 !important;
        }

        .ant-menu-inline .ant-menu-item-selected .anticon {
          color: #ffffff !important;
        }

        .ant-menu-item-group-title {
          padding: 16px 8px 4px 8px !important;
          font-size: 11px !important;
        }

        /* Remove extra borders & backgrounds */
        .ant-menu-light {
          border-inline-end: none !important;
          background: transparent !important;
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
          background: var(--scroll-thumb);
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

