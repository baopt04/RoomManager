import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card } from 'antd';
import {
  EnvironmentOutlined, RightOutlined, CompassOutlined, GlobalOutlined,
  BankOutlined, ShopOutlined, BuildOutlined, HomeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
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
  const { t, tName } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const areaKey = area.name;
  const rawDesc = t(`locationsPage.areas.${areaKey}.desc`);
  const rawFeatures = t(`locationsPage.areas.${areaKey}.features`);
  const desc = (typeof rawDesc === 'string' && rawDesc !== `locationsPage.areas.${areaKey}.desc`) ? rawDesc : area.description;
  const features = Array.isArray(rawFeatures) ? rawFeatures : area.features;

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
          borderRadius: '28px', overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.04)', background: '#fff',
          boxShadow: isHovered ? '0 30px 60px rgba(0,0,0,0.12)' : '0 4px 12px rgba(0,0,0,0.02)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isHovered ? 'translateY(-10px)' : 'none',
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
            position: 'absolute', top: '20px', left: '20px',
            width: '48px', height: '48px', borderRadius: '14px',
            background: area.color, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', color: '#fff',
            boxShadow: `0 8px 24px ${area.color}33`
          }}>
            {area.icon}
          </div>
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
            <Text style={{
              color: '#fff', fontSize: '22px', fontWeight: 700, display: 'block', lineHeight: 1.2
            }}>
              {tName(area.name)}
            </Text>
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          <Text style={{
            color: '#515154', fontSize: '14px', lineHeight: 1.6, display: 'block'
          }}>
            {desc}
          </Text>
          <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {features.map((f) => (
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
              {t('locationsPage.card.viewRooms')} <RightOutlined style={{ fontSize: '12px' }} />
            </Text>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};


const LocationsPage = () => {
  const { t } = useLanguage();
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
        position: 'relative', minHeight: isMobile ? '260px' : isTablet ? '300px' : '340px', overflow: 'hidden',
        background: 'radial-gradient(circle, rgba(30, 40, 70, 0.6) 0%, rgba(15, 20, 40, 0.9) 100%)',
        padding: isMobile ? '40px 0' : '60px 0'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.2) 2px, transparent 2px)',
          backgroundSize: '40px 40px',
          opacity: 0.5
        }} />
        <div style={{
          maxWidth: '1200px', margin: '0 auto', height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
          padding: isMobile ? '0 16px' : '0 24px', position: 'relative', zIndex: 1
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Text className="custom-color" style={{
              color: '#ffffff', fontSize: '13px', fontWeight: 600,
              letterSpacing: '3px', textTransform: 'uppercase', display: 'block', marginBottom: '12px'
            }}>
              <EnvironmentOutlined /> {t('locationsPage.hero.subtitle')}
            </Text>
            <Title level={1} className="custom-color" style={{
              color: '#ffffff', fontSize: isMobile ? '32px' : isTablet ? '40px' : '48px', fontWeight: 800,
              margin: 0, lineHeight: 1.15, letterSpacing: '-1px', textShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              {t('locationsPage.hero.title1')} <span style={{ color: '#cce5ff' }}>{t('locationsPage.hero.title2')}</span> {t('locationsPage.hero.title3')}
            </Title>
            <Text className="custom-color" style={{
              color: 'rgba(255,255,255,0.9)', fontSize: isMobile ? '15px' : '17px',
              display: 'block', maxWidth: '500px', lineHeight: 1.6, margin: '16px auto 0'
            }}>
              {t('locationsPage.hero.desc')}
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
                {t('locationsPage.results.title')}
              </Title>
              <Text style={{ color: '#86868b', fontSize: '14px' }}>
                {AREAS.length} {t('locationsPage.results.activeAreas')}
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



    </div>
  );
};

export default LocationsPage;

