import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Button, Tooltip } from 'antd';
import {
  EnvironmentOutlined, RightOutlined, CompassOutlined, GlobalOutlined,
  BankOutlined, ShopOutlined, BuildOutlined, HomeOutlined,
  FacebookFilled, MessageFilled
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logoZalo from '../../../assets/logo-zalo.png';
const { Title, Text } = Typography;


const AREAS = [
  {
    name: 'Âu Cơ',
    description: 'Khu vực sầm uất, giao thông thuận lợi, gần chợ và siêu thị.',
    icon: <CompassOutlined />,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
    color: '#0071e3',
    features: ['Gần chợ', 'Giao thông tốt', 'An ninh'],
  },
  {
    name: 'Trích Sài',
    description: 'Yên tĩnh, gần Hồ Tây, không khí trong lành, phù hợp sinh viên.',
    icon: <GlobalOutlined />,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1de2d9d000?auto=format&fit=crop&q=80&w=800',
    color: '#34c759',
    features: ['Gần Hồ Tây', 'Yên tĩnh', 'View đẹp'],
  },
  {
    name: 'An Dương Vương',
    description: 'Mặt đường lớn, tiện kinh doanh, nhiều tiện ích xung quanh.',
    icon: <BankOutlined />,
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800',
    color: '#ff9500',
    features: ['Mặt đường', 'Tiện KD', 'Đông đúc'],
  },
  {
    name: 'Tứ Liên',
    description: 'Khu dân cư mới, không gian thoáng đãng, giá cả hợp lý.',
    icon: <ShopOutlined />,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
    color: '#af52de',
    features: ['Giá tốt', 'Thoáng mát', 'Mới xây'],
  },
  {
    name: 'Long Biên',
    description: 'Quận rộng lớn, nhiều lựa chọn phòng, giá phải chăng.',
    icon: <BuildOutlined />,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    color: '#ff2d55',
    features: ['Đa dạng', 'Giá rẻ', 'Nhiều phòng'],
  },
  {
    name: 'Hà Đông',
    description: 'Khu đô thị hiện đại, đầy đủ tiện nghi, gần trường đại học.',
    icon: <HomeOutlined />,
    image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800',
    color: '#5ac8fa',
    features: ['Hiện đại', 'Gần trường', 'Đầy đủ TN'],
  },
];


const LocationCard = ({ area, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card
        hoverable
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        style={{
          borderRadius: '24px', overflow: 'hidden',
          border: 'none', background: '#fff',
          boxShadow: isHovered ? '0 24px 60px rgba(0,0,0,0.12)' : '0 4px 16px rgba(0,0,0,0.05)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isHovered ? 'translateY(-8px)' : 'none',
          cursor: 'pointer'
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
          <img
            src={area.image}
            alt={area.name}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.8s ease',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(0deg, rgba(0,0,0,0.5) 0%, transparent 60%)',
          }} />
          <div style={{
            position: 'absolute', top: '16px', left: '16px',
            width: '44px', height: '44px', borderRadius: '14px',
            background: area.color, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', color: '#fff',
            boxShadow: `0 6px 16px ${area.color}44`
          }}>
            {area.icon}
          </div>
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
            <Text style={{
              color: '#fff', fontSize: '22px', fontWeight: 700, display: 'block', lineHeight: 1.2
            }}>
              {area.name}
            </Text>
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          <Text style={{
            color: '#515154', fontSize: '14px', lineHeight: 1.6, display: 'block'
          }}>
            {area.description}
          </Text>
          <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {area.features.map((f) => (
              <span key={f} style={{
                background: '#f5f5f7', color: '#515154', padding: '4px 12px',
                borderRadius: '8px', fontSize: '12px', fontWeight: 500
              }}>
                {f}
              </span>
            ))}
          </div>
          {/* CTA */}
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <Text style={{
              color: '#0071e3', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
            }}>
              Xem phòng <RightOutlined style={{ fontSize: '12px' }} />
            </Text>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};


const LocationsPage = () => {
  const navigate = useNavigate();
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const isMobile = viewportWidth <= 768;
  const isTablet = viewportWidth <= 1024;

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAreaClick = (areaName) => {
    navigate(`/rooms?area=${encodeURIComponent(areaName)}`);
  };

  return (
    <div style={{ background: '#f5f5f7', minHeight: '100vh', paddingBottom: '100px' }}>

      {/* ── HERO BANNER ── */}
      <div style={{
        position: 'relative', height: isMobile ? '260px' : isTablet ? '300px' : '340px', overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}>
        <div style={{
          position: 'absolute', top: '-100px', right: '-60px',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,113,227,0.2) 0%, transparent 70%)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '15%',
          width: '280px', height: '280px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(52,199,89,0.12) 0%, transparent 70%)'
        }} />

        <div style={{
          maxWidth: '1200px', margin: '0 auto', height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: isMobile ? '0 16px' : '0 24px', position: 'relative', zIndex: 1
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Text style={{
              color: '#34c759', fontSize: '13px', fontWeight: 600,
              letterSpacing: '3px', textTransform: 'uppercase', display: 'block', marginBottom: '12px'
            }}>
              <EnvironmentOutlined /> KHU VỰC CHO THUÊ
            </Text>
            <Title level={1} style={{
              color: '#ffffff', fontSize: isMobile ? '28px' : isTablet ? '36px' : '44px', fontWeight: 700,
              margin: 0, lineHeight: 1.15, letterSpacing: '-1px'
            }}>
              Khám phá <span style={{ color: '#34c759' }}>khu vực</span> xung quanh.
            </Title>
            <Text style={{
              color: 'rgba(255,255,255,0.5)', fontSize: isMobile ? '14px' : '16px',
              display: 'block', marginTop: '16px', maxWidth: '500px', lineHeight: 1.6
            }}>
              Chúng tôi cho thuê phòng trọ tại nhiều khu vực trung tâm và ngoại thành Hà Nội. Lựa chọn khu vực phù hợp với bạn.
            </Text>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '40px auto 0', padding: isMobile ? '0 12px' : '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '28px' }}>
            <div>
              <Title level={3} style={{ margin: 0, fontSize: '22px', fontWeight: 600, color: '#1d1d1f' }}>
                Các khu vực cho thuê
              </Title>
              <Text style={{ color: '#86868b', fontSize: '14px' }}>
                {AREAS.length} khu vực đang hoạt động
              </Text>
            </div>
          </div>
        </motion.div>

        <Row gutter={[24, 28]}>
          {AREAS.map((area, index) => (
            <Col xs={24} sm={12} md={8} key={area.name}>
              <LocationCard
                area={area}
                index={index}
                onClick={() => handleAreaClick(area.name)}
              />
            </Col>
          ))}
        </Row>
      </div>

      <div style={{
        position: 'fixed', bottom: isMobile ? '16px' : '30px', right: isMobile ? '12px' : '24px', zIndex: 1000,
        display: 'flex', flexDirection: 'column', gap: '10px'
      }}>
        {[
          {
            id: 'zalo',
            icon: (
              <img src={logoZalo} alt="Zalo" style={{ width: '40px', height: '26px' }} />
            ),
            color: 'white', label: 'Zalo', link: '#',
            shadow: '0 4px 16px rgba(0,104,255,0.35)'
          },
          {
            id: 'facebook',
            icon: <FacebookFilled style={{ fontSize: '22px' }} />,
            color: '#1877f2', label: 'Facebook', link: '#',
            shadow: '0 4px 16px rgba(24,119,242,0.35)'
          },
          {
            id: 'messenger',
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.454 5.508 3.722 7.228V22l3.374-1.854c.884.246 1.824.378 2.904.378 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm1.096 11.758l-2.548-2.72-4.97 2.72 5.462-5.806 2.614 2.72 4.904-2.72-5.462 5.806z" fill="#fff" />
              </svg>
            ),
            color: '#0084ff', label: 'Messenger', link: '#',
            shadow: '0 4px 16px rgba(0,132,255,0.35)'
          }
        ].map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ x: 80, opacity: 0, scale: 0 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 0.8 + (idx * 0.1) }}
            whileHover={{ scale: 1.12, y: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            <Tooltip title={isMobile ? '' : item.label} placement="left">
              <Button
                type="primary"
                shape="circle"
                icon={item.icon}
                style={{
                  width: isMobile ? '40px' : '44px', height: isMobile ? '40px' : '44px',
                  backgroundColor: item.color,
                  borderColor: 'rgba(255,255,255,0.2)',
                  borderWidth: '1.5px',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: item.shadow,
                  transition: 'all 0.3s ease',
                  padding: 0, overflow: 'hidden'
                }}
                onClick={() => window.open(item.link, '_blank')}
              />
            </Tooltip>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default LocationsPage;
