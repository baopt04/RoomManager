import React, { useEffect, useState } from "react";
import { Layout, Dropdown, Menu, message, Modal, Avatar, Button, Drawer } from "antd";
import { UserOutlined, LockOutlined, LogoutOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import SidebarMenu from "../../components/Menu/SideBarMenu";
import ModalChangePassword from "../../components/Login/ModalChangePassword";

const { Content } = Layout;

const DashboardLayout = ({ children }) => {
  const [time, setTime] = useState(new Date());
  const userName = localStorage.getItem("userName") || "Người dùng";
  const navigate = useNavigate();
  const [modalChangePassword, setModalChangePassword] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setDrawerVisible(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const formatDate = (date) =>
    date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      Modal.confirm({
        title: 'Đăng xuất',
        content: 'Bạn có chắc muốn đăng xuất khỏi hệ thống?',
        okText: 'Đăng xuất',
        cancelText: 'Hủy',
        okType: 'danger',
        centered: true,
        onOk: async () => {
          try {
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            localStorage.removeItem('email');
            message.success("Đăng xuất thành công!");
            navigate("/login");
          } catch (error) {
            message.error("Đăng xuất thất bại. Vui lòng thử lại sau!");
          }
        }
      });
    } else if (e.key === "changePassword") {
      setModalChangePassword(true);
    }
  };

  const userMenu = (
    <Menu
      onClick={handleMenuClick}
      style={{
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
        padding: '4px',
      }}
    >
      <Menu.Item
        key="changePassword"
        icon={<LockOutlined />}
        style={{ fontSize: '13px', borderRadius: '6px' }}
      >
        Đổi mật khẩu
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        style={{ fontSize: '13px', borderRadius: '6px', color: '#ef4444' }}
      >
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh", background: '#f5f5f5' }}>
      {/* Desktop: Fixed Sidebar */}
      {!isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
          height: '100vh',
          width: '240px',
        }}>
          <SidebarMenu />
        </div>
      )}

      {/* Mobile: Drawer Sidebar */}
      {isMobile && (
        <Drawer
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={260}
          bodyStyle={{ padding: 0 }}
          headerStyle={{ display: 'none' }}
        >
          <SidebarMenu onClose={() => setDrawerVisible(false)} />
        </Drawer>
      )}

      {/* Main Area */}
      <Layout style={{
        background: '#f5f5f5',
        marginLeft: isMobile ? 0 : '240px',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#ffffff",
            padding: isMobile ? "0 12px" : "0 24px",
            height: '56px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          {/* Left Side */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            {/* Mobile hamburger */}
            {isMobile && (
              <Button
                type="text"
                icon={<MenuOutlined style={{ fontSize: '18px' }} />}
                onClick={() => setDrawerVisible(true)}
                style={{ padding: '4px 8px' }}
              />
            )}

            {/* Date & Time */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              color: '#6b7280',
              fontSize: '13px',
            }}>
              {!isMobile && (
                <span style={{ fontWeight: '500' }}>{formatDate(time)}</span>
              )}
              <span style={{
                color: '#1677ff',
                fontWeight: '600',
                fontFamily: "'Inter', monospace",
              }}>
                {formatTime(time)}
              </span>
            </div>
          </div>

          {/* Right: User */}
          <Dropdown
            overlay={userMenu}
            placement="bottomRight"
            trigger={["hover"]}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: '6px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Avatar
                size={28}
                icon={<UserOutlined />}
                style={{ background: '#1677ff' }}
              />
              {!isMobile && (
                <span style={{
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '13px',
                }}>
                  {userName}
                </span>
              )}
            </div>
          </Dropdown>
        </div>

        {/* Content */}
        <Content style={{ padding: isMobile ? '12px' : '24px' }}>
          {children}
        </Content>
      </Layout>

      <ModalChangePassword
        visible={modalChangePassword}
        onclose={() => setModalChangePassword(false)}
      />
    </Layout>
  );
};

export default DashboardLayout;
