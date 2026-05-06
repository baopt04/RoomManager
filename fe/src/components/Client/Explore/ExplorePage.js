import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Button, Timeline } from 'antd';
import {
  HomeOutlined, TeamOutlined, SafetyOutlined, StarOutlined,
  EnvironmentOutlined, HeartOutlined, TrophyOutlined,
  RocketOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
const { Title, Text, Paragraph } = Typography;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, delay }
});

const STATS = [
  { icon: <HomeOutlined />, value: '200+', label: 'Phòng cho thuê', color: '#0071e3' },
  { icon: <TeamOutlined />, value: '1,500+', label: 'Khách hàng tin tưởng', color: '#34c759' },
  { icon: <EnvironmentOutlined />, value: '7', label: 'Khu vực hoạt động', color: '#ff9500' },
  { icon: <StarOutlined />, value: '10+', label: 'Năm kinh nghiệm', color: '#af52de' },
];

const VALUES = [
  { icon: <SafetyOutlined />, title: 'An toàn & Uy tín', desc: 'Cam kết minh bạch trong mọi giao dịch. Hợp đồng rõ ràng, pháp lý đầy đủ.' },
  { icon: <HeartOutlined />, title: 'Tận tâm phục vụ', desc: 'Hỗ trợ khách hàng 24/7. Sửa chữa nhanh chóng, lắng nghe mọi phản hồi.' },
  { icon: <TrophyOutlined />, title: 'Chất lượng hàng đầu', desc: 'Phòng sạch sẽ, đầy đủ tiện nghi. Nội thất hiện đại, không gian thoáng mát.' },
  { icon: <RocketOutlined />, title: 'Công nghệ tiện lợi', desc: 'Đặt phòng online, thanh toán dễ dàng. Quản lý hợp đồng và hóa đơn số.' },
];

const TIMELINE_DATA = [
  { year: '2014', title: 'Khởi đầu', desc: 'Bắt đầu với 5 phòng trọ nhỏ tại khu vực Trích Sài, Tây Hồ.' },
  { year: '2016', title: 'Mở rộng Tứ Liên', desc: 'Đầu tư xây dựng thêm tòa nhà tại Tứ Liên, nâng tổng lên 30 phòng.' },
  { year: '2018', title: 'Vươn ra ngoại thành', desc: 'Mở rộng sang Long Biên và Hà Đông, phục vụ sinh viên các trường đại học.' },
  { year: '2020', title: 'Chuyển đổi số', desc: 'Ứng dụng công nghệ quản lý phòng trọ, thanh toán online và hợp đồng điện tử.' },
  { year: '2022', title: 'Phát triển bền vững', desc: 'Đạt 150+ phòng, phủ sóng 6 khu vực. Nhận giải thưởng "Nhà trọ uy tín Hà Nội".' },
  { year: '2024', title: 'Hiện tại', desc: 'Hơn 200 phòng cho thuê, 1,500+ khách hàng. Tiếp tục đầu tư và nâng cấp chất lượng.' },
];
const ExplorePage = () => {
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

  const STATS_T = [
    { icon: <HomeOutlined />, value: '200+', label: t('explorePage.stats.rooms'), color: '#0071e3' },
    { icon: <TeamOutlined />, value: '1,500+', label: t('explorePage.stats.customers'), color: '#34c759' },
    { icon: <EnvironmentOutlined />, value: '7', label: t('explorePage.stats.areas'), color: '#ff9500' },
    { icon: <StarOutlined />, value: '10+', label: t('explorePage.stats.exp'), color: '#af52de' },
  ];

  const VALUES_T = [
    { icon: <SafetyOutlined />, title: t('explorePage.values.v1.title'), desc: t('explorePage.values.v1.desc') },
    { icon: <HeartOutlined />, title: t('explorePage.values.v2.title'), desc: t('explorePage.values.v2.desc') },
    { icon: <TrophyOutlined />, title: t('explorePage.values.v3.title'), desc: t('explorePage.values.v3.desc') },
    { icon: <RocketOutlined />, title: t('explorePage.values.v4.title'), desc: t('explorePage.values.v4.desc') },
  ];

  const TIMELINE_DATA_T = [
    { year: t('explorePage.timeline.t1.year'), title: t('explorePage.timeline.t1.title'), desc: t('explorePage.timeline.t1.desc') },
    { year: t('explorePage.timeline.t2.year'), title: t('explorePage.timeline.t2.title'), desc: t('explorePage.timeline.t2.desc') },
    { year: t('explorePage.timeline.t3.year'), title: t('explorePage.timeline.t3.title'), desc: t('explorePage.timeline.t3.desc') },
    { year: t('explorePage.timeline.t4.year'), title: t('explorePage.timeline.t4.title'), desc: t('explorePage.timeline.t4.desc') },
    { year: t('explorePage.timeline.t5.year'), title: t('explorePage.timeline.t5.title'), desc: t('explorePage.timeline.t5.desc') },
    { year: t('explorePage.timeline.t6.year'), title: t('explorePage.timeline.t6.title'), desc: t('explorePage.timeline.t6.desc') },
  ];

  return (
    <div style={{ background: '#f5f5f7', minHeight: '100vh', paddingBottom: '100px' }}>


      <div style={{
        position: 'relative', minHeight: isMobile ? '300px' : isTablet ? '340px' : '400px', overflow: 'hidden',
        background: '#000000',
        padding: isMobile ? '60px 0' : '80px 0'
      }}>
        {/* Soft, premium blurred mesh glows */}
        <div style={{
          position: 'absolute', top: '-150px', left: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(94,92,230,0.15) 0%, transparent 70%)',
          filter: 'blur(50px)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-200px', right: '-5%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(10,132,255,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }} />

        <div style={{
          maxWidth: '1200px', margin: '0 auto', height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: isMobile ? '0 16px' : '0 24px', position: 'relative', zIndex: 1
        }}>
          <motion.div {...fadeUp()}>
            <Text className="custom-color" style={{
              color: '#86868b', fontSize: '13px', fontWeight: 600,
              letterSpacing: '3px', textTransform: 'uppercase', display: 'block', marginBottom: '16px'
            }}>
              {t('explorePage.hero.subtitle')}
            </Text>
            <Title level={1} className="custom-color" style={{
              color: '#ffffff', fontSize: isMobile ? '36px' : isTablet ? '44px' : '56px', fontWeight: 700,
              margin: 0, lineHeight: 1.15, letterSpacing: '-1.5px', maxWidth: '750px'
            }}>
              {t('explorePage.hero.title1')}{' '}
              <span style={{ 
                background: 'linear-gradient(90deg, #5e5ce6 0%, #0a84ff 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>
                {t('explorePage.hero.title2')}
              </span> <br />
              {t('explorePage.hero.title3')}
            </Title>
            <Text className="custom-color" style={{
              color: '#a1a1a6', fontSize: isMobile ? '16px' : '19px',
              display: 'block', marginTop: '24px', maxWidth: '580px', lineHeight: 1.6, fontWeight: 400
            }}>
              {t('explorePage.hero.desc')}
            </Text>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: isMobile ? '-24px auto 0' : '-50px auto 0', padding: isMobile ? '0 12px' : '0 24px', position: 'relative', zIndex: 10 }}>
        <motion.div {...fadeUp(0.2)}>
          <Row gutter={[16, 16]}>
            {STATS_T.map((s, i) => (
              <Col xs={12} md={6} key={i}>
                <Card style={{
                  borderRadius: '24px', border: '1px solid rgba(0,0,0,0.04)', textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)', height: '100%'
                }} bodyStyle={{ padding: '32px 20px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: `${s.color}14`, color: s.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px', margin: '0 auto 12px'
                  }}>
                    {s.icon}
                  </div>
                  <Title level={3} style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#1d1d1f' }}>
                    {s.value}
                  </Title>
                  <Text style={{ color: '#86868b', fontSize: '13px' }}>{s.label}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </motion.div>
      </div>

      <div style={{ maxWidth: '900px', margin: '60px auto 0', padding: isMobile ? '0 12px' : '0 24px' }}>
        <motion.div {...fadeUp()}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Title level={2} style={{ fontSize: '32px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
              {t('explorePage.story.title')}
            </Title>
            <div style={{ width: '50px', height: '4px', background: '#af52de', margin: '16px auto 0', borderRadius: '2px' }} />
          </div>
          <Card style={{
            borderRadius: '28px', border: '1px solid rgba(0,0,0,0.04)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }} bodyStyle={{ padding: isMobile ? '24px' : '48px' }}>
            <Paragraph style={{ fontSize: '16px', lineHeight: 2, color: '#515154' }}>
              {t('explorePage.story.p1')}
            </Paragraph>
            <Paragraph style={{ fontSize: '16px', lineHeight: 2, color: '#515154' }}>
              {t('explorePage.story.p2')}
            </Paragraph>
            <Paragraph style={{ fontSize: '16px', lineHeight: 2, color: '#515154', marginBottom: 0 }}>
              {t('explorePage.story.p3')}
            </Paragraph>
          </Card>
        </motion.div>
      </div>

      <div style={{ maxWidth: '800px', margin: '60px auto 0', padding: isMobile ? '0 12px' : '0 24px' }}>
        <motion.div {...fadeUp()}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Title level={2} style={{ fontSize: '28px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
              {t('explorePage.timeline.title')}
            </Title>
            <div style={{ width: '50px', height: '4px', background: '#0071e3', margin: '16px auto 0', borderRadius: '2px' }} />
          </div>
          <Timeline mode={isMobile ? 'left' : 'alternate'} items={TIMELINE_DATA_T.map((item, idx) => ({
            color: idx === TIMELINE_DATA_T.length - 1 ? '#af52de' : '#0071e3',
            dot: idx === TIMELINE_DATA_T.length - 1 ? <CheckCircleOutlined style={{ fontSize: '18px', color: '#af52de' }} /> : undefined,
            children: (
              <motion.div {...fadeUp(idx * 0.1)}>
                <Card style={{
                  borderRadius: '20px', border: '1px solid rgba(0,0,0,0.03)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                }} bodyStyle={{ padding: '20px 24px' }}>
                  <Text style={{ color: '#0071e3', fontSize: '13px', fontWeight: 700 }}>{item.year}</Text>
                  <Title level={5} style={{ margin: '4px 0 6px', fontSize: '16px', fontWeight: 600 }}>{item.title}</Title>
                  <Text style={{ color: '#86868b', fontSize: '13px', lineHeight: 1.6 }}>{item.desc}</Text>
                </Card>
              </motion.div>
            ),
          }))} />
        </motion.div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '60px auto 0', padding: isMobile ? '0 12px' : '0 24px' }}>
        <motion.div {...fadeUp()}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <Title level={2} style={{ fontSize: '28px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
              {t('explorePage.values.title')}
            </Title>
            <div style={{ width: '50px', height: '4px', background: '#34c759', margin: '16px auto 0', borderRadius: '2px' }} />
          </div>
          <Row gutter={[20, 20]}>
            {VALUES_T.map((v, i) => (
              <Col xs={24} sm={12} md={6} key={i}>
                <motion.div {...fadeUp(i * 0.1)}>
                  <Card style={{
                    borderRadius: '28px', border: '1px solid rgba(0,0,0,0.04)', height: '100%',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    transition: 'all 0.3s ease',
                  }} bodyStyle={{ padding: '32px 24px', textAlign: 'center' }}
                    hoverable
                  >
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '16px',
                      background: '#f5f5f7', color: '#0071e3',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '24px', margin: '0 auto 16px'
                    }}>
                      {v.icon}
                    </div>
                    <Title level={5} style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 8px' }}>{v.title}</Title>
                    <Text style={{ color: '#86868b', fontSize: '13px', lineHeight: 1.7 }}>{v.desc}</Text>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </div>

      <div style={{ maxWidth: '800px', margin: '60px auto 0', padding: isMobile ? '0 12px' : '0 24px' }}>
        <motion.div {...fadeUp()}>
          <Card style={{
            borderRadius: '24px', border: 'none', textAlign: 'center',
            background: 'linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 100%)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
          }} bodyStyle={{ padding: '48px 32px' }}>
            <Title level={3} style={{ color: '#fff', fontSize: '26px', fontWeight: 700, margin: 0 }}>
              {t('explorePage.cta.title')}
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', display: 'block', margin: '12px 0 28px' }}>
              {t('explorePage.cta.desc')}
            </Text>
            <Button
              type="primary" size="large"
              onClick={() => navigate('/rooms')}
              style={{
                background: '#0071e3', border: 'none', borderRadius: '16px',
                fontWeight: 600, height: '48px', padding: '0 36px', fontSize: '15px',
                boxShadow: '0 8px 20px rgba(0,113,227,0.3)'
              }}
            >
              {t('explorePage.cta.btn')}
            </Button>
          </Card>
        </motion.div>
      </div>


    </div>
  );
};

export default ExplorePage;

