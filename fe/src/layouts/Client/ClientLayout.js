import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Typography, Space, Row, Col, Divider, Drawer } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PhoneOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import logo from './media/tien_duc_land_logo_2.png';
const { Header, Content, Footer } = Layout;
const { Text, Title } = Typography;

const ClientLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const selectedKey = location.pathname;

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

  const navItems = [
    { key: '/', label: 'Tổng quan', path: '/' },
    { key: '/rooms', label: 'Phòng trọ', path: '/rooms' },
    { key: '/locations', label: 'Khu vực', path: '/locations' },
    { key: '/support', label: 'Khám phá', path: '/support' },
  ];

  const handleMobileNavClick = (path) => {
    navigate(path);
    setDrawerVisible(false);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f7' }}>

      {/* Main Header */}
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          padding: 0,
          height: '60px',
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px'
        }}>
          {/* Logo Area */}
          <div
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '10px 0'
            }}
          >
            <img src={logo} alt="Logo" style={{ width: isMobile ? '45px' : '60px', height: 'auto' }} />
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Menu
              mode="horizontal"
              selectedKeys={[selectedKey]}
              style={{
                background: 'transparent',
                borderBottom: 'none',
                fontSize: '14px',
                fontWeight: 400,
                flex: 1,
                justifyContent: 'center',
                letterSpacing: '-0.2px',
              }}
              items={navItems.map(item => ({
                key: item.key,
                label: <Link to={item.path}>{item.label}</Link>,
              }))}
            />
          )}

          {/* Desktop: Action Buttons */}
          {!isMobile && (
            <Space size="middle" align="center">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '8px' }}>
                <PhoneOutlined style={{ color: '#1d1d1f', fontSize: '14px' }} />
                <Text style={{ fontWeight: 600, color: '#1d1d1f', fontSize: '14px', letterSpacing: '-0.2px' }}>
                  0364.862.148
                </Text>
              </div>
              <Button
                type="primary"
                onClick={() => navigate('/login')}
                style={{
                  background: '#1d1d1f',
                  borderColor: '#1d1d1f',
                  borderRadius: '20px',
                  fontWeight: 500,
                  padding: '0 16px',
                  height: '32px',
                  fontSize: '13px'
                }}
              >
                Đăng tin
              </Button>
            </Space>
          )}

          {/* Mobile: Hamburger */}
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: '20px' }} />}
              onClick={() => setDrawerVisible(true)}
              style={{ padding: '4px 8px' }}
            />
          )}
        </div>
      </Header>

      {/* Mobile Navigation Drawer */}
      <Drawer
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={logo} alt="Logo" style={{ width: '35px', height: 'auto' }} />
            <span style={{ fontWeight: 600, fontSize: '15px' }}>Tiến Đức Land</span>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => (
            <div
              key={item.key}
              onClick={() => handleMobileNavClick(item.path)}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: selectedKey === item.key ? 600 : 400,
                color: selectedKey === item.key ? '#1677ff' : '#1d1d1f',
                background: selectedKey === item.key ? '#e6f4ff' : 'transparent',
                fontSize: '15px',
                transition: 'all 0.2s',
              }}
            >
              {item.label}
            </div>
          ))}
        </div>

        <Divider />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px' }}>
            <PhoneOutlined style={{ color: '#1d1d1f' }} />
            <Text style={{ fontWeight: 600, fontSize: '14px' }}>0364.862.148</Text>
          </div>
          <Button
            type="primary"
            block
            onClick={() => { navigate('/login'); setDrawerVisible(false); }}
            style={{
              background: '#1d1d1f',
              borderColor: '#1d1d1f',
              borderRadius: '20px',
              fontWeight: 500,
              height: '40px',
              fontSize: '14px'
            }}
          >
            Đăng tin
          </Button>
        </div>
      </Drawer>

      {/* Main Content Area */}
      <Content style={{ padding: '0' }}>
        {children}
      </Content>

      {/* Footer */}
      <Footer
        style={{
          background: '#f5f5f7',
          color: '#1d1d1f',
          padding: isMobile ? '40px 0' : '60px 0',
          borderTop: '1px solid #d2d2d7',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

          <Row gutter={[40, 40]}>
            <Col xs={24} md={8}>
              <Title level={5} style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', marginBottom: '16px' }}>Tiến Đức Land</Title>
              <Text style={{ color: '#515154', fontSize: '12px', lineHeight: '1.6', display: 'block' }}>
                Nền tảng công nghệ bất động sản cung cấp giải pháp cho thuê nhanh chóng, trải nghiệm trực quan và minh bạch 100%. Phục vụ hàng triệu khách hàng toàn quốc.
              </Text>
            </Col>

            <Col xs={12} md={5}>
              <Title level={5} style={{ fontSize: '12px', fontWeight: 600, color: '#1d1d1f', marginBottom: '16px' }}>TÀI KHOẢN</Title>
              <Space direction="vertical" size="small">
                <Link to="#" style={{ color: '#515154', fontSize: '12px' }}>Quản lý phòng</Link>
                <Link to="#" style={{ color: '#515154', fontSize: '12px' }}>Quản lý hợp đồng</Link>
                <Link to="#" style={{ color: '#515154', fontSize: '12px' }}>Lịch sử thanh toán</Link>
              </Space>
            </Col>

            <Col xs={12} md={5}>
              <Title level={5} style={{ fontSize: '12px', fontWeight: 600, color: '#1d1d1f', marginBottom: '16px' }}>KHÁM PHÁ</Title>
              <Space direction="vertical" size="small">
                <Link to="#" style={{ color: '#515154', fontSize: '12px' }}>Phòng trọ sinh viên</Link>
                <Link to="#" style={{ color: '#515154', fontSize: '12px' }}>Căn hộ dịch vụ</Link>
                <Link to="#" style={{ color: '#515154', fontSize: '12px' }}>Ký túc xá cao cấp</Link>
              </Space>
            </Col>

            <Col xs={24} md={6}>
              <Title level={5} style={{ fontSize: '12px', fontWeight: 600, color: '#1d1d1f', marginBottom: '16px' }}>LIÊN HỆ</Title>
              <Space direction="vertical" size="small" style={{ color: '#515154', fontSize: '12px' }}>
                <Text style={{ color: '#515154', fontSize: '12px' }}>Hotline: 0364.862.148</Text>
                <Text style={{ color: '#515154', fontSize: '12px' }}>Email: tienducland@gmail.com</Text>
                <Text style={{ color: '#515154', fontSize: '12px' }}>Địa chỉ: Thành phố Hà Nội</Text>
              </Space>
            </Col>
          </Row>

          <Divider style={{ borderColor: '#d2d2d7', width: '100%', minWidth: '100%', margin: '40px 0 20px' }} />

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <Text style={{ color: '#86868b', fontSize: '12px' }}>
              Bản quyền © {new Date().getFullYear()} Rentals Inc. Bảo lưu mọi quyền.
            </Text>
            <Space size="middle" wrap>
              <Link to="#" style={{ color: '#515154', fontSize: '12px' }}>Chính sách bảo mật</Link>
              <Link to="#" style={{ color: '#515154', fontSize: '12px' }}>Điều khoản sử dụng</Link>
              <Link to="#" style={{ color: '#515154', fontSize: '12px' }}>Pháp lý</Link>
            </Space>
          </div>

        </div>
      </Footer>
    </Layout>
  );
};

export default ClientLayout;
