import React, { useState } from 'react';
import { Typography, Row, Col, Card, Button, Tag, Divider, Space, Breadcrumb, Avatar } from 'antd';
import {
  EyeOutlined,
  LeftOutlined,
  ShareAltOutlined,
  FacebookOutlined,
  TwitterOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useClientBreakpoints } from '../hooks/useClientBreakpoints';

const { Title, Text, Paragraph } = Typography;

const RELATED_POSTS = [
  {
    id: 2,
    title: "7 mẹo phong thủy giúp phòng trọ nhỏ trở nên rộng rãi",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800",
    date: "12/05/2024"
  },
  {
    id: 3,
    title: "10 ý tưởng decor phòng trọ đẹp, tiết kiệm chi phí",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800",
    date: "08/05/2024"
  }
];

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isPhone } = useClientBreakpoints();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const blogPost = {
    id: id,
    title: "Kinh nghiệm thuê trọ cho sinh viên lần đầu xa nhà",
    author: "Tiến Đức Land",
    date: "15/05/2024",
    views: "1.2k",
    category: "Kinh nghiệm thuê trọ",
    tagColor: "#27ae60",
    featuredImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
    content: (
      <div className="blog-rich-text">
        <Paragraph style={{ fontSize: '16px', lineHeight: 1.8 }}>
          Thuê trọ lần đầu là một thử thách lớn đối với các bạn tân sinh viên khi bước chân vào môi trường đại học xa lạ. Việc tìm kiếm một nơi ở an toàn, phù hợp với túi tiền và thuận tiện đi lại không phải là điều dễ dàng. Dưới đây là những kinh nghiệm xương máu giúp bạn tránh khỏi những rắc rối không đáng có.
        </Paragraph>

        <Title level={3} style={{ marginTop: '32px' }}>1. Xác định nhu cầu và ngân sách</Title>
        <Paragraph style={{ fontSize: '16px', lineHeight: 1.8 }}>
          Trước khi bắt đầu tìm kiếm, hãy xác định rõ bạn cần gì: Ở một mình hay ở ghép? Gần trường hay chấp nhận đi xa một chút để có giá rẻ hơn? Ngân sách tối đa cho việc thuê phòng (bao gồm cả điện, nước, internet) là bao nhiêu? Việc này giúp bạn thu hẹp phạm vi tìm kiếm và không bị choáng ngợp bởi quá nhiều thông tin.
        </Paragraph>

        <Title level={3} style={{ marginTop: '32px' }}>2. Kiểm tra kỹ thông tin trước khi đi xem phòng</Title>
        <Paragraph style={{ fontSize: '16px', lineHeight: 1.8 }}>
          Đừng vội vàng đi xem phòng ngay khi thấy một mẩu tin đăng hấp dẫn. Hãy liên hệ với chủ trọ để hỏi rõ các thông tin cơ bản: Giá phòng có đúng như tin đăng không? Chi phí điện nước tính như thế nào? Có chung chủ không? Giờ giấc ra vào tự do hay có hạn chế?
        </Paragraph>

        <div style={{ margin: '40px 0', borderRadius: '16px', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=800" alt="Checking room" style={{ width: '100%' }} />
          <Text italic style={{ display: 'block', textAlign: 'center', marginTop: '12px', color: '#888' }}>Luôn kiểm tra kỹ hiện trạng phòng trước khi ký hợp đồng</Text>
        </div>

        <Title level={3} style={{ marginTop: '32px' }}>3. Checklist các hạng mục cần kiểm tra</Title>
        <Paragraph style={{ fontSize: '16px', lineHeight: 1.8 }}>
          Khi đến xem phòng, hãy chú ý các điểm sau:
          <ul>
            <li>Hệ thống điện, nước có hoạt động bình thường không? (Thử bật đèn, mở vòi nước).</li>
            <li>Cửa sổ, cửa chính có chắc chắn và có khóa an toàn không?</li>
            <li>Tường có bị thấm dột hay nứt nẻ không?</li>
            <li>Khu vực xung quanh có ồn ào hay ngập lụt khi trời mưa không?</li>
            <li>An ninh khu vực có tốt không?</li>
          </ul>
        </Paragraph>

        <Title level={3} style={{ marginTop: '32px' }}>4. Lưu ý về hợp đồng thuê trọ</Title>
        <Paragraph style={{ fontSize: '16px', lineHeight: 1.8 }}>
          Hợp đồng là văn bản pháp lý quan trọng nhất bảo vệ quyền lợi của bạn. Hãy đọc kỹ từng điều khoản, đặc biệt là: tiền đặt cọc (bao nhiêu và điều kiện hoàn lại), thời hạn hợp đồng, các chi phí phát sinh hàng tháng, và trách nhiệm sửa chữa hư hỏng. Đừng bao giờ đặt cọc tiền nếu chưa có giấy tờ biên nhận rõ ràng.
        </Paragraph>

        <Title level={3} style={{ marginTop: '32px' }}>Kết luận</Title>
        <Paragraph style={{ fontSize: '16px', lineHeight: 1.8 }}>
          Hy vọng những chia sẻ trên sẽ giúp các bạn sinh viên tự tin hơn trong việc tìm kiếm "ngôi nhà thứ hai" của mình. Nếu có bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với đội ngũ Tiến Đức Land để được tư vấn miễn phí!
        </Paragraph>
      </div>
    )
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingBottom: isPhone ? '60px' : '100px' }}>
      {/* Header Info */}
      <div style={{ background: '#f8f9fa', padding: isPhone ? '24px 0' : '60px 0', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isPhone ? '0 16px' : '0 24px' }}>
          <Breadcrumb style={{ marginBottom: '24px' }}>
            <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/blog">Blog</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Chi tiết bài viết</Breadcrumb.Item>
          </Breadcrumb>

          <Tag style={{
            background: blogPost.tagColor, border: 'none', color: '#fff',
            borderRadius: '6px', fontWeight: 600, padding: '2px 12px', marginBottom: '16px'
          }}>
            {blogPost.category}
          </Tag>

          <Title level={1} style={{ fontSize: isPhone ? '24px' : '40px', fontWeight: 800, margin: '0 0 24px', lineHeight: 1.3 }}>
            {blogPost.title}
          </Title>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar size={40} style={{ backgroundColor: '#27ae60' }}>TD</Avatar>
              <div>
                <Text strong style={{ display: 'block', fontSize: '15px' }}>{blogPost.author}</Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#888', fontSize: '13px' }}>
                  <span>{blogPost.date}</span>
                  <span>•</span>
                  <span><EyeOutlined /> {blogPost.views} lượt xem</span>
                </div>
              </div>
            </div>
            <Space size="middle">
              <Button icon={<FacebookOutlined />} shape="circle" />
              <Button icon={<TwitterOutlined />} shape="circle" />
              <Button icon={<ShareAltOutlined />} shape="circle" />
            </Space>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: isPhone ? '24px auto 0' : '40px auto 0', padding: isPhone ? '0 16px' : '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Featured Image */}
          <div style={{ borderRadius: isPhone ? '16px' : '24px', overflow: 'hidden', marginBottom: isPhone ? '24px' : '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
            <img src={blogPost.featuredImage} alt={blogPost.title} style={{ width: '100%', display: 'block' }} />
          </div>

          {/* Article Body */}
          {blogPost.content}

          <Divider style={{ margin: '60px 0 40px' }} />

          {/* Tag Cloud */}
          <div style={{ marginBottom: '40px' }}>
            <Space size="small" wrap>
              <Text strong style={{ marginRight: '8px' }}>Tags:</Text>
              <Tag style={{ borderRadius: '8px', padding: '4px 12px' }}>Thuê trọ</Tag>
              <Tag style={{ borderRadius: '8px', padding: '4px 12px' }}>Sinh viên</Tag>
              <Tag style={{ borderRadius: '8px', padding: '4px 12px' }}>Kinh nghiệm</Tag>
            </Space>
          </div>

          {/* Related Posts */}
          <div style={{ marginTop: isPhone ? '40px' : '80px' }}>
            <Title level={4} style={{ marginBottom: '24px', fontWeight: 700 }}>Bài viết liên quan</Title>
            <Row gutter={[24, 24]}>
              {RELATED_POSTS.map(post => (
                <Col xs={24} sm={12} key={post.id}>
                  <Card
                    hoverable
                    cover={<img src={post.image} alt={post.title} style={{ height: '180px', objectFit: 'cover' }} />}
                    style={{ borderRadius: '16px', overflow: 'hidden' }}
                    onClick={() => navigate(`/blog/${post.id}`)}
                  >
                    <Title level={5} style={{ fontSize: '15px', margin: '0 0 8px', lineHeight: 1.4 }}>{post.title}</Title>
                    <Text style={{ color: '#888', fontSize: '13px' }}>{post.date}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Navigation Back */}
          <div style={{ marginTop: '60px', textAlign: 'center' }}>
            <Button
              icon={<LeftOutlined />}
              onClick={() => navigate('/blog')}
              style={{ borderRadius: '10px', height: '44px', padding: '0 24px' }}
            >
              Quay lại danh sách blog
            </Button>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default BlogDetail;
