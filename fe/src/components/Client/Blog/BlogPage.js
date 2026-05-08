import React, { useState } from 'react';
import { Typography, Row, Col, Card, Input, Button, List, Tag, Pagination } from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  SendOutlined,
  BookOutlined,
  BulbOutlined,
  HomeOutlined,
  SmileOutlined,
  DollarOutlined,
  GlobalOutlined,
  RightOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import banner_blog from '../../../assets/blog_banner.png';
import { useClientBreakpoints } from '../hooks/useClientBreakpoints';

const { Title, Text, Paragraph } = Typography;

const CATEGORIES = [
  { id: 1, name: "Kinh nghiệm thuê trọ", icon: <BookOutlined />, count: 24, color: '#eafaf1', iconColor: '#27ae60' },
  { id: 2, name: "Phong thủy", icon: <BulbOutlined />, count: 12, color: '#fef5e7', iconColor: '#f39c12' },
  { id: 3, name: "Trang trí & Nội thất", icon: <HomeOutlined />, count: 18, color: '#ebf5fb', iconColor: '#3498db' },
  { id: 4, name: "Cuộc sống", icon: <SmileOutlined />, count: 15, color: '#f5eef8', iconColor: '#8e44ad' },
  { id: 5, name: "Tài chính & Tiết kiệm", icon: <DollarOutlined />, count: 10, color: '#fef9e7', iconColor: '#f1c40f' },
  { id: 6, name: "Tin tức & Thị trường", icon: <GlobalOutlined />, count: 8, color: '#f4f6f7', iconColor: '#7f8c8d' },
];

const BLOG_POSTS = [
  {
    id: 1,
    title: "Kinh nghiệm thuê trọ cho sinh viên lần đầu xa nhà",
    summary: "Những điều sinh viên cần lưu ý để tìm được phòng trọ phù hợp, an toàn và tiết kiệm chi phí khi lần đầu xa nhà.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    category: "Kinh nghiệm thuê trọ",
    tagColor: "#27ae60",
    author: "Tiến Đức Land",
    date: "15/05/2024",
    views: "1.2k"
  },
  {
    id: 2,
    title: "7 mẹo phong thủy giúp phòng trọ nhỏ trở nên rộng rãi, thoáng mát",
    summary: "Áp dụng những mẹo phong thủy đơn giản để không gian sống trong phòng trọ luôn thoáng đãng và tràn đầy năng lượng.",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800",
    category: "Phong thủy",
    tagColor: "#f39c12",
    author: "Tiến Đức Land",
    date: "12/05/2024",
    views: "980"
  },
  {
    id: 3,
    title: "10 ý tưởng decor phòng trọ đẹp, tiết kiệm chi phí",
    summary: "Biến phòng trọ đơn điệu thành không gian xinh xắn, tiện nghi với những ý tưởng decor đơn giản và tiết kiệm.",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800",
    category: "Trang trí & Nội thất",
    tagColor: "#3498db",
    author: "Tiến Đức Land",
    date: "08/05/2024",
    views: "1.5k"
  },
  {
    id: 4,
    title: "Quản lý chi tiêu khi ở trọ: Bí quyết tiết kiệm mỗi tháng",
    summary: "Hướng dẫn cách lập kế hoạch chi tiêu khoa học giúp bạn sinh viên tiết kiệm hiệu quả khi sống xa nhà.",
    image: "https://images.unsplash.com/photo-1554224155-169641357599?auto=format&fit=crop&q=80&w=800",
    category: "Cuộc sống",
    tagColor: "#8e44ad",
    author: "Tiến Đức Land",
    date: "05/05/2024",
    views: "870"
  }
];

const FEATURED_POSTS = [
  { id: 1, title: "Checklist 12 điều cần kiểm tra khi đi xem phòng trọ", date: "10/05/2024", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=200" },
  { id: 2, title: "Khu vực nào ở TP.HCM dễ tìm phòng trọ giá tốt?", date: "09/05/2024", image: "https://images.unsplash.com/photo-1582653280603-75a42169bc8a?auto=format&fit=crop&q=80&w=200" },
  { id: 3, title: "Những chi phí phát sinh khi thuê trọ bạn nên biết", date: "07/05/2024", image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=200" },
  { id: 4, title: "Cách xử lý khi gặp chủ trọ khó tính", date: "06/05/2024", image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=200" },
];

const BlogPage = () => {
  const { isPhone } = useClientBreakpoints();

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '80px' }}>
      <div style={{
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        background: '#fff',
        overflow: 'hidden',
        marginBottom: '48px'
      }}>
        <img
          src={banner_blog}
          alt="Blog Banner"
          style={{
            width: '100%',
            height: isPhone ? '240px' : '420px',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isPhone ? '0 16px' : '0 24px' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Bài viết mới nhất</Title>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Text style={{ fontSize: '13px', color: '#888' }}>Sắp xếp:</Text>
                <Text strong style={{ fontSize: '13px', cursor: 'pointer' }}>Mới nhất <RightOutlined style={{ fontSize: '10px', transform: 'rotate(90deg)' }} /></Text>
              </div>
            </div>

            <List
              dataSource={BLOG_POSTS}
              renderItem={(post, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card
                    className="blog-card-hover"
                    style={{
                      borderRadius: '16px', border: '1px solid #f0f0f0',
                      marginBottom: '24px', overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                    }}
                    bodyStyle={{ padding: 0 }}
                  >
                    <Row gutter={[0, 0]}>
                      <Col xs={24} sm={10}>
                        <div style={{ position: 'relative', height: '100%', minHeight: '200px' }}>
                          <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <Tag style={{
                            position: 'absolute', top: '12px', left: '12px',
                            background: post.tagColor, border: 'none', color: '#fff',
                            borderRadius: '6px', fontWeight: 600, padding: '2px 10px'
                          }}>
                            {post.category}
                          </Tag>
                        </div>
                      </Col>
                      <Col xs={24} sm={14}>
                        <div style={{ padding: isPhone ? '16px' : '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <Title level={4} style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 700, lineHeight: 1.4 }}>
                            <Link to={`/blog/${post.id}`} style={{ color: '#1d1d1f' }}>{post.title}</Link>
                          </Title>
                          <Paragraph ellipsis={{ rows: 2 }} style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
                            {post.summary}
                          </Paragraph>
                          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: isPhone ? '8px' : '16px', color: '#888', fontSize: '12px', flexWrap: 'wrap' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <UserOutlined style={{ fontSize: '14px' }} /> {post.author}
                              </span>
                              <span>•</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <CalendarOutlined style={{ fontSize: '14px' }} /> {post.date}
                              </span>
                              <span>•</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <EyeOutlined style={{ fontSize: '14px' }} /> {post.views} lượt xem
                              </span>
                            </div>
                            <Link to={`/blog/${post.id}`} style={{ color: '#27ae60', fontWeight: 700, fontSize: '13px' }}>
                              Đọc tiếp <RightOutlined style={{ fontSize: '10px' }} />
                            </Link>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </motion.div>
              )}
            />

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Pagination
                defaultCurrent={1}
                total={100}
                showSizeChanger={false}
                itemRender={(page, type, originalElement) => {
                  if (type === 'prev') return <span style={{ color: '#0071e3', cursor: 'pointer' }}>Trước</span>;
                  if (type === 'next') return <span style={{ color: '#0071e3', cursor: 'pointer' }}>Sau</span>;
                  return originalElement;
                }}
              />
            </div>
          </Col>

          <Col xs={24} lg={8}>
            {/* Search Box */}
            <div style={{ marginBottom: '32px' }}>
              <Input
                placeholder="Tìm kiếm bài viết..."
                prefix={<SearchOutlined style={{ color: '#ccc' }} />}
                style={{
                  height: '48px', borderRadius: '12px', border: '1px solid #f0f0f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}
              />
            </div>

            {/* Categories */}
            <Card
              title={<span style={{ fontWeight: 700, fontSize: '16px' }}>Danh mục bài viết</span>}
              style={{ borderRadius: '16px', border: '1px solid #f0f0f0', marginBottom: '32px' }}
              headStyle={{ borderBottom: '1px solid #f8f9fa' }}
            >
              <List
                dataSource={CATEGORIES}
                renderItem={cat => (
                  <List.Item style={{ padding: '12px 0', border: 'none', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '8px',
                          background: cat.color, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: cat.iconColor, fontSize: '16px'
                        }}>
                          {cat.icon}
                        </div>
                        <Text style={{ fontSize: '14px', color: '#444' }}>{cat.name}</Text>
                      </div>
                      <Text style={{ color: '#888', fontSize: '13px' }}>{cat.count}</Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            {/* Featured Posts */}
            <Card
              title={<span style={{ fontWeight: 700, fontSize: '16px' }}>Bài viết nổi bật</span>}
              style={{ borderRadius: '16px', border: '1px solid #f0f0f0', marginBottom: '32px' }}
              headStyle={{ borderBottom: '1px solid #f8f9fa' }}
            >
              <List
                dataSource={FEATURED_POSTS}
                renderItem={post => (
                  <List.Item style={{ padding: '12px 0', border: 'none', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <img src={post.image} alt={post.title} style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div>
                        <Text strong style={{ fontSize: '13px', lineHeight: 1.4, display: 'block', marginBottom: '4px' }}>
                          {post.title}
                        </Text>
                        <Text style={{ fontSize: '11px', color: '#888' }}>{post.date}</Text>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            {/* Newsletter */}
            <Card
              style={{
                borderRadius: '16px', border: 'none',
                background: '#f0faf4',
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")'
              }}
            >
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%', background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', color: '#27ae60', fontSize: '24px',
                  boxShadow: '0 4px 12px rgba(39,174,96,0.1)'
                }}>
                  <SendOutlined />
                </div>
                <Title level={5} style={{ margin: '0 0 8px', color: '#1d4332' }}>Nhận tin mới từ Tiến Đức Land</Title>
                <Paragraph style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
                  Đăng ký nhận bản tin để không bỏ lỡ những bài viết hữu ích và cập nhật mới nhất.
                </Paragraph>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Input
                    placeholder="Nhập email của bạn"
                    style={{ borderRadius: '8px', border: '1px solid #d4edda', height: '40px' }}
                  />
                  <Button
                    type="primary"
                    style={{ background: '#27ae60', border: 'none', borderRadius: '8px', height: '40px', fontWeight: 600 }}
                  >
                    Đăng ký
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

    </div>
  );
};

export default BlogPage;
