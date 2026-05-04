import React, { useEffect, useState } from "react";
import { Layout, Dropdown, Menu, message, Modal, Avatar, Button, Drawer } from "antd";
import { UserOutlined, LockOutlined, LogoutOutlined, MenuOutlined, BulbOutlined, BulbFilled } from "@ant-design/icons";
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

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

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
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--color-border)',
        padding: '4px',
        background: 'var(--color-surface)'
      }}
    >
      <Menu.Item
        key="changePassword"
        icon={<LockOutlined />}
        style={{ fontSize: '13px', borderRadius: '6px', color: 'var(--color-text)' }}
      >
        Đổi mật khẩu
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        style={{ fontSize: '13px', borderRadius: '6px', color: 'var(--color-danger)' }}
      >
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh", background: 'var(--color-bg)' }}>
      {/* Desktop: Fixed Sidebar */}
      {!isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
          height: '100vh',
          width: 'var(--sidebar-width)',
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
          width={280}
          styles={{ body: { padding: 0 } }}
          headerStyle={{ display: 'none' }}
        >
          <SidebarMenu onClose={() => setDrawerVisible(false)} />
        </Drawer>
      )}

      {/* Main Area */}
      <Layout style={{
        background: 'var(--color-bg)',
        marginLeft: isMobile ? 0 : 'var(--sidebar-width)',
        minHeight: '100vh',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
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
            background: "var(--color-surface)",
            padding: isMobile ? "0 16px" : "0 32px",
            height: 'var(--header-height)',
            borderBottom: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'background 0.3s'
          }}
        >
          {/* Left Side */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            {/* Mobile hamburger */}
            {isMobile && (
              <Button
                type="text"
                icon={<MenuOutlined style={{ fontSize: '20px', color: 'var(--color-text)' }} />}
                onClick={() => setDrawerVisible(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '10px'
                }}
              />
            )}

            {/* Date & Time */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              color: 'var(--color-text-secondary)',
              fontSize: '14px',
            }}>
              {!isMobile && (
                <span style={{ fontWeight: '500', color: 'var(--color-text)' }}>{formatDate(time)}</span>
              )}
              <span style={{
                color: 'var(--color-primary)',
                fontWeight: '700',
                letterSpacing: '-0.5px'
              }}>
                {formatTime(time)}
              </span>
            </div>
          </div>

          {/* Right: User & Theme Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Theme Toggle */}
            <Button
              type="text"
              onClick={toggleTheme}
              icon={theme === 'dark' ? <BulbFilled style={{ color: '#faad14', fontSize: '18px' }} /> : <BulbOutlined style={{ color: 'var(--color-text)', fontSize: '18px' }} />}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--color-surface-secondary)'
              }}
            />

            <Dropdown
              overlay={userMenu}
              placement="bottomRight"
              trigger={["click"]}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-surface-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Avatar
                  size={32}
                  icon={<UserOutlined />}
                  style={{ background: 'var(--color-text-secondary)' }}
                />
                {!isMobile && (
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                    <span style={{
                      fontWeight: '600',
                      color: 'var(--color-text)',
                      fontSize: '14px',
                    }}>
                      {userName}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Quản trị viên</span>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </div>

        {/* Content */}
        <Content style={{ padding: isMobile ? '16px' : '32px' }}>
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
