import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Spin, Button, Space } from 'antd';
import {
  LoadingOutlined, RightOutlined, LeftOutlined, EnvironmentOutlined, DollarOutlined,
  TeamOutlined, ColumnWidthOutlined, CompassOutlined, GlobalOutlined,
  BankOutlined, ShopOutlined, BuildOutlined, ArrowLeftOutlined,
  TagOutlined, FacebookFilled, MessageFilled,
  SafetyCertificateOutlined, ThunderboltOutlined, CheckCircleFilled,
  HomeOutlined, StarFilled, WifiOutlined, CoffeeOutlined, SafetyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getAllRooms, searchRoomsByAddress } from '../../../services/customer/HomeService';
import logoZalo from '../../../assets/logo-zalo.png';
import logobanner from '../../../assets/logo_banner.png';
import logobanner2 from '../../../assets/logo_banner_2.png';
import {
  PRIMARY_IMAGES, HOVER_IMAGES, HOME_HERO_BANNERS, HOME_LOCATIONS, HOME_STATS
} from './HomeConstants';
import { RoomCard, ShortTermCard } from './subcomponents/HomeCards';
const { Title, Text } = Typography;




const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [dataRooms, setDataRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    setIsSearching(false);
    setSearchQuery(null);
    try {
      const response = await getAllRooms();
      const vacantRooms = response.filter(room => room.status === "TRONG");

      const sortedRooms = vacantRooms.sort((a, b) => {
        const dateA = new Date(a.lastModifiedDate || 0);
        const dateB = new Date(b.lastModifiedDate || 0);
        const now = new Date();

        const isANew = (now - dateA) / (1000 * 60 * 60 * 24) <= 3;
        const isBNew = (now - dateB) / (1000 * 60 * 60 * 24) <= 3;

        if (isANew && !isBNew) return -1;
        if (!isANew && isBNew) return 1;

        return dateB - dateA;
      });

      const mappedRooms = sortedRooms.map((room, index) => ({
        ...room,
        displayImage: PRIMARY_IMAGES[index % PRIMARY_IMAGES.length],
        hoverImage: HOVER_IMAGES[index % HOVER_IMAGES.length]
      }));
      setDataRooms(mappedRooms);
    } catch (error) {
      console.error("Failed to load rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSearchByAddress = async (address) => {
    setLoading(true);
    setIsSearching(true);
    setSearchQuery(address);
    try {
      const response = await searchRoomsByAddress(address);

      // Sort search results same way
      const sortedRooms = response.sort((a, b) => {
        const dateA = new Date(a.lastModifiedDate || 0);
        const dateB = new Date(b.lastModifiedDate || 0);
        const now = new Date();

        const isANew = (now - dateA) / (1000 * 60 * 60 * 24) <= 3;
        const isBNew = (now - dateB) / (1000 * 60 * 60 * 24) <= 3;

        if (isANew && !isBNew) return -1;
        if (!isANew && isBNew) return 1;

        return dateB - dateA;
      });

      const mappedRooms = sortedRooms.map((room, index) => ({
        ...room,
        displayImage: PRIMARY_IMAGES[index % PRIMARY_IMAGES.length],
        hoverImage: HOVER_IMAGES[index % HOVER_IMAGES.length]
      }));
      setDataRooms(mappedRooms);

      // Scroll to results
      document.getElementById('rooms-grid').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HOME_HERO_BANNERS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HOME_HERO_BANNERS.length) % HOME_HERO_BANNERS.length);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HOME_HERO_BANNERS.length);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ paddingBottom: '100px', background: '#ffffff', position: 'relative', overflow: 'hidden' }}>

      {/* Hero Slider Section */}
      <div style={{ position: 'relative', background: '#ffffff', overflow: 'hidden', padding: isMobile ? '20px 0' : '30px 0' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.3,
                  duration: 0.6
                }
              },
              exit: { opacity: 0, transition: { duration: 0.4 } }
            }}
            style={{ textAlign: 'center', maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 40px' }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
              }}
            >
              <Title
                level={1}
                style={{
                  fontSize: isMobile ? '32px' : isTablet ? '44px' : '52px',
                  fontWeight: 800,
                  letterSpacing: '-2px',
                  color: '#1d1d1f',
                  margin: '0 auto 16px',
                  lineHeight: 1.1,
                  maxWidth: '900px'
                }}
              >
                {t(HOME_HERO_BANNERS[currentSlide].titleKey)}
              </Title>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
              }}
            >
              <Text style={{ fontSize: isMobile ? '16px' : '18px', color: '#86868b', maxWidth: '700px', display: 'block', margin: '0 auto 40px' }}>
                {t(HOME_HERO_BANNERS[currentSlide].descKey)}
              </Text>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } }
              }}
              style={{ position: 'relative', marginTop: '20px' }}
            >
              <img
                src={HOME_HERO_BANNERS[currentSlide].image}
                alt="Banner"
                loading={currentSlide === 0 ? 'eager' : 'lazy'}
                decoding="async"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  maxHeight: isMobile ? '280px' : '500px',
                  objectFit: 'cover'
                }}
              />

              <div
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                style={{
                  position: 'absolute', left: isMobile ? '8px' : '20px', top: '50%', transform: 'translateY(-50%)',
                  zIndex: 100, cursor: 'pointer', width: isMobile ? '36px' : '48px', height: isMobile ? '36px' : '48px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '50%', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s'
                }}
              >
                <LeftOutlined style={{ fontSize: isMobile ? '16px' : '20px', color: '#1d1d1f' }} />
              </div>

              <div
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                style={{
                  position: 'absolute', right: isMobile ? '8px' : '20px', top: '50%', transform: 'translateY(-50%)',
                  zIndex: 100, cursor: 'pointer', width: isMobile ? '36px' : '48px', height: isMobile ? '36px' : '48px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '50%', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s'
                }}
              >
                <RightOutlined style={{ fontSize: isMobile ? '16px' : '20px', color: '#1d1d1f' }} />
              </div>
            </motion.div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
              {HOME_HERO_BANNERS.map((banner, index) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Banner ${index + 1}`}
                  style={{
                    width: currentSlide === index ? '22px' : '8px',
                    height: '8px',
                    borderRadius: '999px',
                    border: 'none',
                    background: currentSlide === index ? '#1d1d1f' : '#d2d2d7',
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                    padding: 0
                  }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>


      {/* 4. LOCATIONS SECTION - Region Discovery */}
      <div style={{ padding: isMobile ? '28px 12px' : '40px 20px', maxWidth: '1400px', margin: '0 auto 20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Title level={2} style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.5px', marginBottom: '32px', paddingLeft: '8px', textAlign: 'center' }}>
            {t('home.searchRegion')}
          </Title>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            padding: '0 8px'
          }}>
            {HOME_LOCATIONS.map((loc, index) => (
              <motion.div
                key={loc.name}
                whileHover={{ scale: 1.05, translateY: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                style={{
                  background: '#ffffff',
                  padding: isMobile ? '12px 16px' : '16px 24px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  border: '1px solid #f0f0f0'
                }}
                onClick={() => handleSearchByAddress(loc.name)}
              >
                <div style={{ fontSize: '20px', color: '#0071e3' }}>{loc.icon}</div>
                <Text strong style={{ fontSize: isMobile ? '14px' : '16px', color: '#1d1d1f' }}>{loc.name}</Text>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div style={{ padding: isMobile ? '30px 16px 20px' : '60px 20px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div style={{
            display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap',
            background: '#ffffff', borderRadius: '24px', padding: '40px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0'
          }}>
            <div style={{ flex: 1, minWidth: isMobile ? '100%' : '280px' }}>
              <Text style={{
                color: '#0071e3', fontSize: '12px', fontWeight: 600,
                letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px'
              }}>
                {t('home.aboutTag')}
              </Text>
              <Title level={3} style={{
                fontSize: '26px', fontWeight: 700, color: '#1d1d1f',
                margin: '0 0 12px', lineHeight: 1.3
              }}>
                {t('home.aboutTitle')}
              </Title>
              <Text style={{
                color: '#86868b', fontSize: '15px', lineHeight: 1.8, display: 'block', marginBottom: '12px'
              }}>
                {t('home.aboutDesc1')}
              </Text>
              <Text style={{
                color: '#86868b', fontSize: '15px', lineHeight: 1.8, display: 'block', marginBottom: '20px'
              }}>
                {t('home.aboutDesc2')}
              </Text>
              <Button
                type="link"
                onClick={() => navigate('/support')}
                style={{ padding: 0, color: '#0071e3', fontWeight: 600, fontSize: '15px' }}
              >
                {t('home.learnMore')} <RightOutlined style={{ fontSize: '12px' }} />
              </Button>
            </div>


            <div style={{
              display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', minWidth: isMobile ? '100%' : '240px'
            }}>
              {HOME_STATS.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  style={{
                    textAlign: 'center', padding: '16px 12px',
                    background: '#f5f5f7', borderRadius: '16px'
                  }}
                >
                  <Title level={4} style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </Title>
                  <Text style={{ color: '#86868b', fontSize: '12px' }}>{t(stat.labelKey)}</Text>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div style={{ padding: isMobile ? '36px 0' : '60px 0', background: '#f5f5f7', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0 12px' : '0 20px' }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <div>
                <Text style={{
                  color: '#0071e3', fontSize: '13px', fontWeight: 600,
                  letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '12px'
                }}>
                  {t('home.shortTerm.tag')}
                </Text>
                <Title level={2} style={{ fontSize: '32px', fontWeight: 700, margin: 0, color: '#1d1d1f' }}>
                  {t('home.shortTerm.title')}
                </Title>
              </div>
              <Button
                type="link"
                icon={<RightOutlined />}
                style={{ color: '#0071e3', fontWeight: 600, fontSize: '15px' }}
                onClick={() => navigate('/rooms')}
              >
                {t('home.shortTerm.viewAll')}
              </Button>
            </div>
          </motion.div>

          <div style={{
            display: 'flex',
            overflowX: 'auto',
            padding: '20px 0 40px',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            cursor: 'grab'
          }} className="hide-scrollbar">
            {dataRooms.length > 0 ? (
              dataRooms.slice(0, 5).map((room, idx) => (
                <ShortTermCard
                  key={room.id}
                  room={room}
                  onClick={() => navigate(`/room/${room.slug}-${room.id}`)}
                />
              ))
            ) : (
              [1, 2, 3].map(i => (
                <div key={i} style={{ width: '320px', height: '400px', background: '#fff', borderRadius: '24px', marginRight: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Spin />
                </div>
              ))
            )}
          </div>

          <style dangerouslySetInnerHTML={{
            __html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}} />
        </div>
      </div>

      <div id="rooms-grid" style={{ padding: isMobile ? '16px 12px' : '20px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2} style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.5px', marginBottom: '32px', paddingLeft: '8px', textAlign: 'center' }}>
          {isSearching && searchQuery ? `${t('home.search.result')} ${searchQuery.toUpperCase()}` : t('home.vacantRooms')}
        </Title>

        {isSearching && (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Button type="link" onClick={fetchRooms} style={{ color: '#0071e3', fontSize: '16px' }}>
              <ArrowLeftOutlined /> {t('home.search.back')}
            </Button>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: '#1d1d1f' }} spin />} />
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } }
            }}
          >
            <Row gutter={isMobile ? [12, 20] : [24, 40]}>
              {dataRooms.length > 0 ? (
                // 4 items per row is lg={6} because 24 / 6 = 4
                dataRooms.map((room) => (
                  <Col xs={24} md={12} lg={6} xl={6} key={room.id}>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
                      }}
                    >
                      <RoomCard room={room} onClick={() => navigate(`/room/${room.slug}-${room.id}`)} />
                    </motion.div>
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#86868b', fontSize: '18px' }}>
                    {isSearching ? t('home.search.notFound') : t('home.search.noRooms')}
                  </div>
                </Col>
              )}
            </Row>
          </motion.div>
        )}
      </div>
      <div style={{ padding: isMobile ? '30px 16px' : '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <Title level={2} style={{ fontSize: '28px', fontWeight: 700, textAlign: 'center', color: '#1d1d1f', marginBottom: '8px' }}>
            {t('home.whyChoose')}
          </Title>
          <Text style={{ display: 'block', textAlign: 'center', color: '#86868b', fontSize: '15px', marginBottom: '40px' }}>
            {t('home.whyDesc')}
          </Text>
          <Row gutter={[20, 20]}>
            {(Array.isArray(t('home.whyItems')) ? t('home.whyItems') : []).map((item, i) => (
              <Col xs={24} sm={12} md={8} key={i}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                  <div style={{ background: '#fff', borderRadius: '20px', padding: '28px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0', height: '100%' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
                    <Title level={5} style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px', color: '#1d1d1f' }}>{item.title}</Title>
                    <Text style={{ color: '#86868b', fontSize: '14px', lineHeight: 1.7 }}>{item.desc}</Text>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </div>

      {/* 6. QUY TRÌNH THUÊ PHÒNG - Horizontal Timeline Redesign */}
      <div style={{ padding: isMobile ? '40px 12px 60px' : '60px 20px 80px', maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <Title level={2} style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: 800, textAlign: 'center', color: '#1d1d1f', marginBottom: '12px', letterSpacing: '-1.5px' }}>
            {t('home.processTitle')}
          </Title>
          <Text style={{ display: 'block', textAlign: 'center', color: '#86868b', fontSize: '16px', marginBottom: '60px' }}>
            {t('home.processDesc')}
          </Text>

          <div style={{ position: 'relative' }}>
            {/* Horizontal Connecting Line (Desktop Only) */}
            {!isMobile && (
              <div style={{
                position: 'absolute',
                top: '40px',
                left: '10%',
                right: '10%',
                height: '2px',
                background: 'linear-gradient(to right, #0071e3 0%, #34c759 33%, #ff9500 66%, #af52de 100%)',
                opacity: 0.2,
                zIndex: 0
              }} />
            )}

            <div style={{ display: 'flex', gap: '20px', flexWrap: isMobile ? 'wrap' : 'nowrap', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
              {(Array.isArray(t('home.processSteps')) ? t('home.processSteps') : []).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  style={{
                    flex: isMobile ? '1 1 100%' : '1 1 0',
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '32px 24px',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.03)',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: item.color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', fontWeight: 800,
                    margin: '-72px auto 24px',
                    boxShadow: `0 12px 24px ${item.color}44`,
                    border: '6px solid #fff'
                  }}>
                    {item.step}
                  </div>
                  <Title level={4} style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px', color: '#1d1d1f' }}>
                    {item.title}
                  </Title>
                  <Text style={{ color: '#6e6e73', fontSize: '14px', lineHeight: 1.6 }}>
                    {item.desc}
                  </Text>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* 7. ĐÁNH GIÁ KHÁCH HÀNG */}
      <div style={{ padding: isMobile ? '28px 12px 40px' : '40px 20px 60px', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <Title level={2} style={{ fontSize: '28px', fontWeight: 700, textAlign: 'center', color: '#1d1d1f', marginBottom: '8px' }}>
            {t('home.testimonials.title')}
          </Title>
          <Text style={{ display: 'block', textAlign: 'center', color: '#86868b', fontSize: '15px', marginBottom: '40px' }}>
            {t('home.testimonials.subtitle')}
          </Text>
          <Row gutter={[20, 20]}>
            {(Array.isArray(t('home.testimonials.items')) ? t('home.testimonials.items') : []).map((r, i) => (
              <Col xs={24} md={8} key={i}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <div style={{ background: '#fff', borderRadius: '20px', padding: '28px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0', height: '100%' }}>
                    <div style={{ marginBottom: '12px' }}>{Array.from({ length: 5 }).map((_, si) => (<span key={si} style={{ fontSize: '16px', color: si < r.rating ? '#ffb800' : '#e0e0e0' }}>★</span>))}</div>
                    <Text style={{ color: '#515154', fontSize: '14px', lineHeight: 1.8, display: 'block', marginBottom: '16px', fontStyle: 'italic' }}>"{r.text}"</Text>
                    <div style={{ borderTop: '1px solid #f5f5f7', paddingTop: '12px' }}>
                      <Text strong style={{ color: '#1d1d1f', fontSize: '14px', display: 'block' }}>{r.name}</Text>
                      <Text style={{ color: '#86868b', fontSize: '12px' }}>{r.role}</Text>
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </div>

      {/* 8. CTA */}
      <div style={{ padding: isMobile ? '0 12px 40px' : '0 20px 60px', maxWidth: '900px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div style={{ background: 'linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 100%)', borderRadius: '24px', padding: isMobile ? '32px 20px' : '48px 40px', textAlign: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}>
            <Title level={3} className="custom-color" style={{ color: '#fff', fontSize: '26px', fontWeight: 700, margin: 0 }}>{t('home.cta.title')}</Title>
            <Text className="custom-color" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', display: 'block', margin: '12px 0 28px', lineHeight: 1.7 }}>
              {t('home.cta.subtitle')} <strong className="custom-color" style={{ color: '#fff' }}>0364.862.148</strong>
            </Text>
            <Space size="middle" wrap>
              <Button type="primary" size="large" onClick={() => { document.getElementById('rooms-grid').scrollIntoView({ behavior: 'smooth' }); }}
                style={{ background: '#0071e3', border: 'none', borderRadius: '16px', fontWeight: 600, height: '48px', padding: '0 32px', fontSize: '15px', boxShadow: '0 8px 20px rgba(0,113,227,0.3)' }}>
                {t('home.cta.viewRooms')}
              </Button>
              <Button size="large" onClick={() => navigate('/support')}
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '16px', fontWeight: 600, height: '48px', padding: '0 32px', fontSize: '15px' }}>
                {t('home.cta.learnMore')}
              </Button>
            </Space>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default HomePage;

