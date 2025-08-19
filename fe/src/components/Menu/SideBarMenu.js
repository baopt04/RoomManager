// src/components/SidebarMenu.js
import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
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
  CustomerServiceOutlined,
  FileTextOutlined as BillOutlined,
  TeamOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.png';

const { Sider } = Layout;

const SidebarMenu = () => {
  const navigator = useNavigate();

  return (
    <div style={{
      width: "280px",
      height: "100vh", // Full height
      background: 'linear-gradient(180deg, #2d3748 0%, #1a202c 100%)',
      boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
      overflow: 'hidden', // Ngăn overflow
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Logo Section - Fixed */}
      <div style={{
        padding: '20px',
        textAlign: 'center',
        borderBottom: '1px solid #4a5568',
        flexShrink: 0, // Không co lại khi scroll
        background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
      }}>
        <img
          src={logo}
          alt="Logo"
          style={{
            width: '80px',
            height: 'auto',
            marginBottom: '10px',
            borderRadius: '8px'
          }}
        />
        <h2 style={{
          color: '#63b3ed',
          margin: 0,
          fontSize: '16px',
          fontWeight: '600',
          fontFamily: 'Arial, sans-serif'
        }}>
          🏠 Quản lý phòng trọ
        </h2>
        <p style={{
          color: '#a0aec0',
          fontSize: '12px',
          margin: '5px 0 0 0'
        }}>
          Hệ thống quản lý toàn diện
        </p>
      </div>

      {/* Scrollable Menu Section */}
      <div style={{
        flex: 1, // Chiếm toàn bộ không gian còn lại
        overflowY: 'auto', // Cho phép scroll dọc
        overflowX: 'hidden', // Ẩn scroll ngang
        padding: '10px 0'
      }}>
        <Sider
          width={280}
          style={{
            background: 'transparent',
            border: 'none',
            height: '100%'
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['2']}
            style={{
              height: '100%',
              border: 'none',
              background: 'transparent',
              padding: '0 10px'
            }}
            theme="dark"
            onClick={({ key }) => {
              switch (key) {
                case '1':
                  navigator('/dashboard');
                  break;
                case '2':
                  navigator('/host-management');
                  break;
                case '3':
                  navigator('/houseForRent-management');
                  break;
                case '4':
                  navigator('/room-management');
                  break;
                case '5':
                  navigator('/contract-management');
                  break;
                case '6':
                  navigator('/water-management');
                  break;
                case '7':
                  navigator('/electricity-management');
                  break;
                case '8':
                  navigator('/service-management');
                  break;
                case '9':
                  navigator('/maintenance-management');
                  break;
                case '10':
                  navigator('/car-management');
                  break;
                case '11':
                  navigator('/roomSerivce-management');
                  break;
                case '12':
                  navigator('/bill-management');
                  break;
                case '13':
                  navigator('/sale-counter');
                  break;
                case '14':
                  navigator('/customer-management');
                  break;
                case '15':
                  navigator("/admin-management")
                  break;
                case '16':
                  navigator('/statistical');
                  break;
                default:
                  break;
              }
            }}
          >

            <Menu.Item
              key="2"
              style={{
                color: '#f7fafc',
                fontSize: '14px',
                height: '45px',
                lineHeight: '45px',
                margin: '4px 0',
                borderRadius: '8px',
                marginTop:'180px'
              }}
            >
              👤 Quản lý chủ nhà
            </Menu.Item>

            <Menu.Item
              key="3"
              style={{
                color: '#f7fafc',
                fontSize: '14px',
                height: '45px',
                lineHeight: '45px',
                margin: '4px 0',
                borderRadius: '8px'
              }}
            >
              🏠 Quản lý nhà cho thuê
            </Menu.Item>

            <Menu.Item
              key="4"
              style={{
                color: '#f7fafc',
                fontSize: '14px',
                height: '45px',
                lineHeight: '45px',
                margin: '4px 0',
                borderRadius: '8px'
              }}
            >
              🏢 Quản lý trọ cho thuê
            </Menu.Item>

            <Menu.Item
              key="5"
              style={{
                color: '#f7fafc',
                fontSize: '14px',
                height: '45px',
                lineHeight: '45px',
                margin: '4px 0',
                borderRadius: '8px'
              }}
            >
              📋 Quản lý hợp đồng
            </Menu.Item>

            <Menu.Item
              key="6"
              style={{
                color: '#f7fafc',
                fontSize: '14px',
                height: '45px',
                lineHeight: '45px',
                margin: '4px 0',
                borderRadius: '8px'
              }}
            >
              💧 Quản lý nước
            </Menu.Item>

            <Menu.Item
              key="7"
              style={{
                color: '#f7fafc',
                fontSize: '14px',
                height: '45px',
                lineHeight: '45px',
                margin: '4px 0',
                borderRadius: '8px'
              }}
            >
              ⚡ Quản lý điện
            </Menu.Item>

            <Menu.Item
              key="8"
              style={{
                color: '#f7fafc',
                fontSize: '14px',
                height: '45px',
                lineHeight: '45px',
                margin: '4px 0',
                borderRadius: '8px'
              }}
            >
              🔧 Quản lý dịch vụ
            </Menu.Item>

            <Menu.Item
              key="9"
              style={{
                color: '#f7fafc',
                fontSize: '14px',
                height: '45px',
                lineHeight: '45px',
                margin: '4px 0',
                borderRadius: '8px'
              }}
            >
              🛠️ Quản lý bảo trì
            </Menu.Item>

            <Menu.Item
              key="10"
              style={{
                color: '#f7fafc',
                fontSize: '14px',
                height: '45px',
                lineHeight: '45px',
                margin: '4px 0',
                borderRadius: '8px'
              }}
            >
              🏍️ Quản lý xe máy
            </Menu.Item>

            <Menu.Item
              key="11"
              style={{
                color: '#f7fafc',
                fontSize: '14px',
                height: '45px',
                lineHeight: '45px',
                margin: '4px 0',
                borderRadius: '8px'
              }}
            >
              🛎️ Dịch vụ phòng trọ
            </Menu.Item>

            <Menu.Item
              key="12"
              style={{
                color: '#f7fafc',
                fontSize: '14px',
                height: '45px',
                lineHeight: '45px',
                margin: '4px 0',
                borderRadius: '8px'
              }}
            >
              🧾 Quản lý hóa đơn
            </Menu.Item>

            <Menu.Item
              key="13"
              style={{
                color: '#f7fafc',
                fontSize: '14px',
                height: '45px',
                lineHeight: '45px',
                margin: '4px 0',
                borderRadius: '8px'
              }}
            >
              💰 Tạo hóa đơn
            </Menu.Item>

            <Menu.Item
              key="14"
              style={{
                color: '#f7fafc',
                fontSize: '14px',
                height: '45px',
                lineHeight: '45px',
                margin: '4px 0',
                borderRadius: '8px'
              }}
            >
              👥 Quản lý khách hàng
            </Menu.Item>

            <Menu.Item
              key="15"
              style={{
                color: '#f7fafc',
                fontSize: '14px',
                height: '45px',
                lineHeight: '45px',
                margin: '4px 0',
                borderRadius: '8px'
              }}
            >
              👑 Quản lý admin
            </Menu.Item>

            <Menu.Item
              key="16"
              style={{
                color: '#f7fafc',
                fontSize: '14px',
                height: '45px',
                lineHeight: '45px',
                margin: '4px 0',
                borderRadius: '8px'
              }}
            >
              📈 Thống kê
            </Menu.Item>
          </Menu>
        </Sider>
      </div>

      {/* Custom CSS cho hover effect và scrollbar */}
      <style jsx>{`
        /* Menu hover effects */
        .ant-menu-dark .ant-menu-item:hover {
          background-color: #4a5568 !important;
          border-left: 3px solid #63b3ed !important;
          transform: translateX(5px);
        }
        
        .ant-menu-dark .ant-menu-item-selected {
          background-color: #3182ce !important;
          border-left: 3px solid #63b3ed !important;
          transform: translateX(5px);
        }
        
        .ant-menu-dark .ant-menu-item {
          border-left: 3px solid transparent; 
          transition: all 0.3s ease;
        }
        
        .ant-menu-dark .ant-menu-item-active {
          background-color: #4a5568 !important;
        }
        
        /* Custom scrollbar cho sidebar menu */
        .ant-layout-sider ::-webkit-scrollbar {
          width: 6px;
        }
        
        .ant-layout-sider ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .ant-layout-sider ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        
        .ant-layout-sider ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        
        /* Smooth scroll */
        .ant-layout-sider {
          scroll-behavior: smooth;
        }
        
        /* Animation cho menu items */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .ant-menu-item {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
};

export default SidebarMenu;