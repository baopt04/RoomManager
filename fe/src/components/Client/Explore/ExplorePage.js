import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Button, Timeline } from 'antd';
import {
  HomeOutlined, TeamOutlined, SafetyOutlined, StarOutlined,
  EnvironmentOutlined, HeartOutlined, TrophyOutlined,
  RocketOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
const { Title, Text, Paragraph } = Typography;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay }
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
  const navigate = useNavigate();
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const isMobile = viewportWidth <= 768;
  const isTablet = viewportWidth <= 1024;

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ background: '#f5f5f7', minHeight: '100vh', paddingBottom: '100px' }}>


      <div style={{
        position: 'relative', height: isMobile ? '300px' : isTablet ? '340px' : '400px', overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #16213e 100%)',
      }}>
        <div style={{
          position: 'absolute', top: '-100px', right: '-60px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(175,82,222,0.15) 0%, transparent 70%)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '5%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,113,227,0.12) 0%, transparent 70%)'
        }} />

        <div style={{
          maxWidth: '1200px', margin: '0 auto', height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: isMobile ? '0 16px' : '0 24px', position: 'relative', zIndex: 1
        }}>
          <motion.div {...fadeUp()}>
            <Text style={{
              color: '#af52de', fontSize: '13px', fontWeight: 600,
              letterSpacing: '3px', textTransform: 'uppercase', display: 'block', marginBottom: '12px'
            }}>
              VỀ CHÚNG TÔI
            </Text>
            <Title level={1} style={{
              color: '#fff', fontSize: isMobile ? '30px' : isTablet ? '38px' : '48px', fontWeight: 700,
              margin: 0, lineHeight: 1.15, letterSpacing: '-1px', maxWidth: '650px'
            }}>
              Hành trình <span style={{ color: '#af52de' }}>5 năm</span> <br />
              kiến tạo không gian sống.
            </Title>
            <Text style={{
              color: 'rgba(255,255,255,0.5)', fontSize: isMobile ? '14px' : '17px',
              display: 'block', marginTop: '20px', maxWidth: '520px', lineHeight: 1.7
            }}>
              Từ một căn nhà nhỏ ở Trích Sài đến hệ thống hơn 200 phòng cho thuê trải dài khắp Hà Nội — chúng tôi luôn đặt sự hài lòng của khách hàng lên hàng đầu.
            </Text>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: isMobile ? '-24px auto 0' : '-50px auto 0', padding: isMobile ? '0 12px' : '0 24px', position: 'relative', zIndex: 10 }}>
        <motion.div {...fadeUp(0.2)}>
          <Row gutter={[16, 16]}>
            {STATS.map((s, i) => (
              <Col xs={12} md={6} key={i}>
                <Card style={{
                  borderRadius: '16px', border: 'none', textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)', height: '100%'
                }} bodyStyle={{ padding: '24px 16px' }}>
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
              Câu chuyện của chúng tôi
            </Title>
            <div style={{ width: '50px', height: '4px', background: '#af52de', margin: '16px auto 0', borderRadius: '2px' }} />
          </div>
          <Card style={{
            borderRadius: '20px', border: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }} bodyStyle={{ padding: '32px' }}>
            <Paragraph style={{ fontSize: '16px', lineHeight: 2, color: '#515154' }}>
              Năm 2014, chúng tôi bắt đầu hành trình kinh doanh nhà trọ với chỉ <strong>5 phòng nhỏ</strong> tại khu vực Trích Sài, quận Tây Hồ, Hà Nội. Xuất phát từ mong muốn tạo ra một không gian sống sạch sẽ, an toàn và giá cả hợp lý cho sinh viên và người lao động trẻ.
            </Paragraph>
            <Paragraph style={{ fontSize: '16px', lineHeight: 2, color: '#515154' }}>
              Qua từng năm, bằng sự tận tâm và lắng nghe, chúng tôi đã từng bước mở rộng quy mô — từ Trích Sài sang <strong>Tứ Liên, Âu Cơ, An Dương Vương</strong>, rồi vươn xa tới <strong>Long Biên</strong> và <strong>Hà Đông</strong>. Mỗi khu vực mới là một cột mốc, một bài học và một cơ hội để hoàn thiện dịch vụ.
            </Paragraph>
            <Paragraph style={{ fontSize: '16px', lineHeight: 2, color: '#515154', marginBottom: 0 }}>
              Năm 2020, chúng tôi chuyển đổi số — áp dụng <strong>hệ thống quản lý phòng trọ trực tuyến</strong>, hợp đồng điện tử, và thanh toán online. Ngày hôm nay, với hơn <strong>200 phòng cho thuê</strong> và <strong>1,500+ khách hàng</strong> tin tưởng, chúng tôi tự hào là một trong những đơn vị cho thuê phòng trọ uy tín nhất khu vực Hà Nội.
            </Paragraph>
          </Card>
        </motion.div>
      </div>

      <div style={{ maxWidth: '800px', margin: '60px auto 0', padding: isMobile ? '0 12px' : '0 24px' }}>
        <motion.div {...fadeUp()}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Title level={2} style={{ fontSize: '28px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
              Lịch sử phát triển
            </Title>
            <div style={{ width: '50px', height: '4px', background: '#0071e3', margin: '16px auto 0', borderRadius: '2px' }} />
          </div>
          <Timeline mode={isMobile ? 'left' : 'alternate'} items={TIMELINE_DATA.map((item, idx) => ({
            color: idx === TIMELINE_DATA.length - 1 ? '#af52de' : '#0071e3',
            dot: idx === TIMELINE_DATA.length - 1 ? <CheckCircleOutlined style={{ fontSize: '18px', color: '#af52de' }} /> : undefined,
            children: (
              <motion.div {...fadeUp(idx * 0.1)}>
                <Card style={{
                  borderRadius: '14px', border: 'none',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }} bodyStyle={{ padding: '16px 20px' }}>
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
              Giá trị cốt lõi
            </Title>
            <div style={{ width: '50px', height: '4px', background: '#34c759', margin: '16px auto 0', borderRadius: '2px' }} />
          </div>
          <Row gutter={[20, 20]}>
            {VALUES.map((v, i) => (
              <Col xs={24} sm={12} md={6} key={i}>
                <motion.div {...fadeUp(i * 0.1)}>
                  <Card style={{
                    borderRadius: '20px', border: 'none', height: '100%',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    transition: 'all 0.3s ease',
                  }} bodyStyle={{ padding: '28px 20px', textAlign: 'center' }}
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
              Sẵn sàng tìm phòng?
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', display: 'block', margin: '12px 0 28px' }}>
              Khám phá hàng trăm phòng trọ chất lượng ngay hôm nay
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
              Xem phòng ngay
            </Button>
          </Card>
        </motion.div>
      </div>


    </div>
  );
};

export default ExplorePage;
