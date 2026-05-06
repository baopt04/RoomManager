import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Spin, Button, Empty, Slider } from 'antd';
import {
  LoadingOutlined, RightOutlined, EnvironmentOutlined, TagOutlined,
  CompassOutlined, GlobalOutlined, BankOutlined, ShopOutlined,
  BuildOutlined, HomeOutlined, AppstoreOutlined, FilterOutlined, WifiOutlined, StarFilled
} from '@ant-design/icons';
import { Skeleton, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getAllRooms, searchRoomsByAddress } from '../../../services/customer/HomeService';
import { ListingRoomCard as RoomCard } from './subcomponents/ListingCards';
import { LOCATIONS, FALLBACK_IMAGES } from './RoomConstants';
const { Title, Text } = Typography;








const RoomsPage = () => {
  const { t, tName } = useLanguage();
  const navigate = useNavigate();
  const [allRooms, setAllRooms] = useState([]);
  const [dataRooms, setDataRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeLocation, setActiveLocation] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [priceRange, setPriceRange] = useState([1000000, 20000000]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const RENTAL_TYPES = [
    { name: t('roomsPage.filters.all'), key: 'all', icon: <AppstoreOutlined /> },
    { name: t('roomsPage.filters.longTerm'), key: 'long', icon: <HomeOutlined /> },
    { name: t('roomsPage.filters.shortTerm'), key: 'short', icon: <GlobalOutlined /> },
  ];

  const LOCATIONS_T = LOCATIONS.map(loc => ({
    ...loc,
    name: loc.key === 'all' ? t('roomsPage.filters.all') : tName(loc.name)
  }));

  const formatVND = (val) => `${val / 1000000} ${t('roomsPage.filters.million')}`;

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await getAllRooms();
      const vacantRooms = response.filter(room => room.status === "TRONG");
      const sorted = vacantRooms.sort((a, b) => {
        const now = new Date();
        const isANew = (now - new Date(a.lastModifiedDate || 0)) / (1000 * 60 * 60 * 24) <= 3;
        const isBNew = (now - new Date(b.lastModifiedDate || 0)) / (1000 * 60 * 60 * 24) <= 3;
        if (isANew && !isBNew) return -1;
        if (!isANew && isBNew) return 1;
        return new Date(b.lastModifiedDate || 0) - new Date(a.lastModifiedDate || 0);
      });
      const mapped = sorted.map((room, idx) => ({
        ...room,
        displayImage: FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]
      }));
      setAllRooms(mapped);
      setDataRooms(mapped);
    } catch (err) {
      console.error("Failed to load rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchByAddress = async (address) => {
    setLoading(true);
    try {
      const response = await searchRoomsByAddress(address);
      const sorted = response.sort((a, b) => new Date(b.lastModifiedDate || 0) - new Date(a.lastModifiedDate || 0));
      const mapped = sorted.map((room, idx) => ({
        ...room,
        displayImage: FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]
      }));
      setAllRooms(mapped);
      setDataRooms(mapped);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Filter by price range and rental type whenever dependencies change
  useEffect(() => {
    let filtered = allRooms.filter(
      room => room.price >= priceRange[0] && room.price <= priceRange[1]
    );

    if (activeType === 'short') {
      // For demonstration: any room with 'Studio' or just a subset
      filtered = filtered.filter((_, idx) => idx % 2 === 0 || idx < 3);
    } else if (activeType === 'long') {
      filtered = filtered.filter((_, idx) => idx % 2 !== 0 && idx >= 3);
    }

    setDataRooms(filtered);
  }, [priceRange, allRooms, activeType]);

  const handleLocationClick = (loc) => {
    setActiveLocation(loc.key);
    if (loc.key === 'all') {
      fetchRooms();
    } else {
      fetchByAddress(loc.name);
    }
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  return (
    <div style={{ background: '#f5f5f7', minHeight: '100vh', paddingBottom: '100px' }}>

      {/* ── HERO BANNER (Premium Dark Minimalist) ── */}
      <div style={{
        position: 'relative', minHeight: isMobile ? '240px' : isTablet ? '300px' : '360px', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        padding: isMobile ? '40px 0' : '60px 0'
      }}>
        {/* Subtle premium glows */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-5%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-150px', left: '-5%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }} />
        <div style={{
          maxWidth: '1200px', margin: '0 auto', height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: isMobile ? '0 16px' : '0 24px', position: 'relative', zIndex: 1
        }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Text className="custom-color" style={{
              color: '#34c759', fontSize: '13px', fontWeight: 600,
              letterSpacing: '3px', textTransform: 'uppercase', display: 'block', marginBottom: '12px'
            }}>
              {t('roomsPage.hero.subtitle')}
            </Text>
            <Title level={1} className="custom-color" style={{
              color: '#ffffff', fontSize: isMobile ? '32px' : isTablet ? '40px' : '48px', fontWeight: 800,
              margin: 0, lineHeight: 1.15, letterSpacing: '-1px', textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              {t('roomsPage.hero.title1')} <span style={{ color: '#34c759' }}>{t('roomsPage.hero.title2')}</span>
            </Title>
            <Text className="custom-color" style={{
              color: 'rgba(255,255,255,0.8)', fontSize: '16px',
              display: 'block', marginTop: '16px', maxWidth: '480px', lineHeight: 1.6
            }}>
              {t('roomsPage.hero.desc')}
            </Text>
          </motion.div>
        </div>
      </div>

      {/* ── FILTERS SECTION (Below banner) ── */}
      <div style={{ maxWidth: '1200px', margin: '32px auto 0', padding: isMobile ? '0 12px' : '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card style={{
            borderRadius: '16px', border: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }} bodyStyle={{ padding: isMobile ? '16px 12px' : '20px 24px' }}>

            {/* Location tabs */}
            <Row gutter={isMobile ? [12, 16] : [24, 24]}>
              <Col xs={24} lg={14}>
                <Text strong style={{ fontSize: '13px', color: '#86868b', display: 'block', marginBottom: '12px' }}>
                  <EnvironmentOutlined /> {t('roomsPage.filters.location')}
                </Text>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {LOCATIONS_T.map((loc) => {
                    const isActive = activeLocation === loc.key;
                    return (
                      <Button
                        key={loc.key}
                        type={isActive ? 'primary' : 'default'}
                        onClick={() => handleLocationClick(loc)}
                        style={{
                          height: '38px', borderRadius: '12px',
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '0 16px', fontWeight: isActive ? 600 : 400,
                          fontSize: '13px',
                          background: isActive ? '#1d1d1f' : '#f5f5f7',
                          color: isActive ? '#fff' : '#515154',
                          border: isActive ? 'none' : '1px solid #e8e8e8',
                        }}
                        icon={loc.icon}
                      >
                        {loc.name}
                      </Button>
                    );
                  })}
                </div>
              </Col>

              <Col xs={24} lg={10}>
                <Text strong style={{ fontSize: '13px', color: '#86868b', display: 'block', marginBottom: '12px' }}>
                  <TagOutlined /> {t('roomsPage.filters.type')}
                </Text>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {RENTAL_TYPES.map((type) => {
                    const isActive = activeType === type.key;
                    return (
                      <Button
                        key={type.key}
                        type={isActive ? 'primary' : 'default'}
                        onClick={() => setActiveType(type.key)}
                        style={{
                          height: '38px', borderRadius: '12px',
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '0 16px', fontWeight: isActive ? 600 : 400,
                          fontSize: '13px',
                          background: isActive ? '#0071e3' : '#f5f5f7',
                          color: isActive ? '#fff' : '#515154',
                          border: isActive ? 'none' : '1px solid #e8e8e8',
                        }}
                        icon={type.icon}
                      >
                        {type.name}
                      </Button>
                    );
                  })}
                </div>
              </Col>
            </Row>

            {/* Price range slider */}
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Text strong style={{ fontSize: '13px', color: '#86868b' }}>
                  <FilterOutlined /> {t('roomsPage.filters.priceRange')}
                </Text>
                <Text style={{ fontSize: '14px', fontWeight: 600, color: '#0071e3' }}>
                  {formatVND(priceRange[0])} — {formatVND(priceRange[1])}
                </Text>
              </div>
              <Slider
                range
                min={1000000}
                max={20000000}
                step={500000}
                value={priceRange}
                onChange={handlePriceChange}
                tooltip={{ formatter: (val) => formatVND(val) }}
                trackStyle={[{ backgroundColor: '#1d1d1f' }]}
                handleStyle={[
                  { borderColor: '#1d1d1f', backgroundColor: '#fff' },
                  { borderColor: '#1d1d1f', backgroundColor: '#fff' }
                ]}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: '12px', color: '#86868b' }}>1 {t('roomsPage.filters.million')}</Text>
                <Text style={{ fontSize: '12px', color: '#86868b' }}>20 {t('roomsPage.filters.million')}</Text>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '24px auto 0', padding: isMobile ? '0 12px' : '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '24px' }}>
          <div>
            <Title level={3} style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#1d1d1f' }}>
              {activeLocation === 'all'
                ? t('roomsPage.results.allRooms')
                : `${t('roomsPage.results.area')} ${LOCATIONS_T.find(l => l.key === activeLocation)?.name || ''}`
              }
            </Title>
            <Text style={{ color: '#86868b', fontSize: '13px' }}>
              {loading ? t('roomsPage.results.loading') : `${dataRooms.length} ${t('roomsPage.results.found')}`}
            </Text>
          </div>
        </div>

        {loading ? (
          <Row gutter={isMobile ? [12, 20] : [24, 32]}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Col xs={24} sm={12} md={8} lg={6} key={i}>
                <div style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', height: '400px', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <Skeleton.Button active style={{ width: '100%', height: '220px' }} />
                  <div style={{ padding: '20px' }}>
                    <Skeleton active paragraph={{ rows: 2 }} title={{ width: '80%' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                      <Skeleton.Button active style={{ width: '60%', height: '24px' }} />
                      <Skeleton.Avatar active shape="circle" size="small" />
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        ) : dataRooms.length > 0 ? (
          <Row gutter={isMobile ? [12, 20] : [24, 32]}>
            {dataRooms.map((room, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={room.id}>
                <RoomCard
                  room={room}
                  index={index}
                  activeType={activeType}
                  onClick={() => navigate(`/room/${room.slug}-${room.id}`)}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            style={{
              textAlign: 'center', padding: '80px 0',
              background: '#fff', borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <Empty description={
              <Text style={{ color: '#86868b', fontSize: '16px' }}>
                {t('roomsPage.results.notFound')}
              </Text>
            } />
            <Button
              type="primary"
              onClick={() => { setPriceRange([1000000, 20000000]); handleLocationClick({ key: 'all', name: 'Tất cả' }); }}
              style={{
                marginTop: '20px', background: '#0071e3', border: 'none',
                borderRadius: '12px', fontWeight: 600, height: '44px', padding: '0 28px'
              }}
            >
              {t('roomsPage.results.viewAll')}
            </Button>
          </motion.div>
        )}
      </div>



    </div>
  );
};

export default RoomsPage;

