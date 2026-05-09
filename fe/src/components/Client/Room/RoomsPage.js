import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Button, Empty, Input, Select, Checkbox, Radio, Collapse, Drawer, Skeleton, Pagination } from 'antd';
import {
  SearchOutlined, EnvironmentOutlined, FilterOutlined,
  ColumnWidthOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getAllRooms } from '../../../services/customer/HomeService';
import { ListingRoomCard as RoomCard } from './subcomponents/ListingCards';
import { LOCATIONS, FALLBACK_IMAGES } from './RoomConstants';
import banner_rooms from '../../../assets/banner_rooms.png';
import { useClientBreakpoints } from '../hooks/useClientBreakpoints';
const { Text } = Typography;
const { Panel } = Collapse;

const PRICE_OPTIONS = [
  { label: 'Dưới 2 triệu', value: '0-2000000' },
  { label: '2 - 3 triệu', value: '2000000-3000000' },
  { label: '3 - 4 triệu', value: '3000000-4000000' },
  { label: '4 - 5 triệu', value: '4000000-5000000' },
  { label: 'Trên 5 triệu', value: '5000000-99999999' },
];

const AREA_OPTIONS = [
  { label: 'Dưới 20m²', value: '0-20' },
  { label: '20 - 30m²', value: '20-30' },
  { label: '30 - 50m²', value: '30-50' },
  { label: 'Trên 50m²', value: '50-999' },
];

const RoomsPage = () => {
  const { tName } = useLanguage();
  const navigate = useNavigate();
  const [allRooms, setAllRooms] = useState([]);
  const [dataRooms, setDataRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [locationSearch, setLocationSearch] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const { isPhone } = useClientBreakpoints();

  const LOCATIONS_T = LOCATIONS.filter(l => l.key !== 'all').map(loc => ({
    ...loc,
    name: tName(loc.name),
    count: Math.floor(Math.random() * 1000) + 200,
  }));

  const filteredLocations = LOCATIONS_T.filter(loc =>
    loc.name.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const fetchRooms = async (page = currentPage, size = pageSize) => {
    setLoading(true);
    try {
      const response = await getAllRooms(page, size);
      const content = response.content || [];
      const vacantRooms = content.filter(room => room.status === "TRONG");
      const sorted = vacantRooms.sort((a, b) => new Date(b.lastModifiedDate || 0) - new Date(a.lastModifiedDate || 0));
      const mapped = sorted.map((room, idx) => ({
        ...room,
        displayImage: FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]
      }));
      setAllRooms(mapped);
      
      setCurrentPage(response.number !== undefined ? response.number : 0);
      setTotalElements(response.totalElements !== undefined ? response.totalElements : content.length);
      setPageSize(response.size !== undefined ? response.size : 10);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to load rooms:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(0, pageSize); }, []);

  const handlePageChange = (page, size) => {
    const zeroBasedPage = page - 1;
    setCurrentPage(zeroBasedPage);
    setPageSize(size);
    fetchRooms(zeroBasedPage, size);
  };

  // Filter and sort
  useEffect(() => {
    let filtered = [...allRooms];

    if (selectedLocations.length > 0) {
      filtered = filtered.filter(room => {
        const name = (room.houseName || room.name || '').toLowerCase();
        return selectedLocations.some(loc => name.includes(loc.toLowerCase()));
      });
    }

    if (selectedPrice) {
      const [min, max] = selectedPrice.split('-').map(Number);
      filtered = filtered.filter(room => room.price >= min && room.price <= max);
    } else if (priceMin || priceMax) {
      const min = Number(priceMin) || 0;
      const max = Number(priceMax) || 999999999;
      filtered = filtered.filter(room => room.price >= min && room.price <= max);
    }

    if (selectedArea) {
      const [min, max] = selectedArea.split('-').map(Number);
      filtered = filtered.filter(room => (room.acreage || 0) >= min && (room.acreage || 0) <= max);
    }

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.lastModifiedDate || 0) - new Date(a.lastModifiedDate || 0));
    } else if (sortBy === 'price_asc') {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    setDataRooms(filtered);
  }, [allRooms, selectedLocations, selectedPrice, selectedArea, sortBy, priceMin, priceMax]);

  const clearAllFilters = () => {
    setSelectedLocations([]);
    setSelectedPrice(null);
    setSelectedArea(null);
    setPriceMin('');
    setPriceMax('');
    setLocationSearch('');
  };

  const handleLocationCheck = (locName, checked) => {
    if (checked) {
      setSelectedLocations(prev => [...prev, locName]);
    } else {
      setSelectedLocations(prev => prev.filter(l => l !== locName));
    }
  };

  // Sidebar Filter Component
  const FilterSidebar = () => (
    <div style={{
      background: '#fff', borderRadius: '16px', padding: '24px',
      border: '1px solid #f0f0f0', position: 'sticky', top: '100px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Text strong style={{ fontSize: '18px' }}>Bộ lọc</Text>
        <Button type="link" onClick={clearAllFilters} style={{ color: '#27ae60', fontWeight: 600, padding: 0 }}>
          <CloseCircleOutlined /> Xóa bộ lọc
        </Button>
      </div>

      {/* Location Filter */}
      <Collapse defaultActiveKey={['location', 'price', 'area']} ghost expandIconPosition="end"
        style={{ background: 'transparent' }}
      >
        <Panel header={<Text strong style={{ fontSize: '15px' }}>Khu vực</Text>} key="location"
          style={{ borderBottom: '1px solid #f5f5f5' }}
        >
          <Input
            placeholder="Tìm kiếm khu vực"
            prefix={<SearchOutlined style={{ color: '#bbb' }} />}
            value={locationSearch}
            onChange={e => setLocationSearch(e.target.value)}
            style={{ marginBottom: '12px', borderRadius: '10px', border: '1px solid #e8e8e8', background: '#fafafa' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
            {filteredLocations.map(loc => (
              <Checkbox
                key={loc.key}
                checked={selectedLocations.includes(loc.name)}
                onChange={e => handleLocationCheck(loc.name, e.target.checked)}
                style={{ fontSize: '14px' }}
              >
                {loc.name} <span style={{ color: '#999', fontSize: '12px' }}>({loc.count})</span>
              </Checkbox>
            ))}
          </div>
        </Panel>

        <Panel header={<Text strong style={{ fontSize: '15px' }}>Khoảng giá</Text>} key="price"
          style={{ borderBottom: '1px solid #f5f5f5' }}
        >
          <Radio.Group
            value={selectedPrice}
            onChange={e => { setSelectedPrice(e.target.value); setPriceMin(''); setPriceMax(''); }}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            {PRICE_OPTIONS.map(opt => (
              <Radio key={opt.value} value={opt.value} style={{ fontSize: '14px' }}>
                {opt.label}
              </Radio>
            ))}
          </Radio.Group>

        </Panel>

        <Panel header={<Text strong style={{ fontSize: '15px' }}>Diện tích</Text>} key="area">
          <Radio.Group
            value={selectedArea}
            onChange={e => setSelectedArea(e.target.value)}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            {AREA_OPTIONS.map(opt => (
              <Radio key={opt.value} value={opt.value} style={{ fontSize: '14px' }}>
                {opt.label}
              </Radio>
            ))}
          </Radio.Group>
        </Panel>
      </Collapse>
    </div>
  );

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '80px' }}>

      {/* HERO BANNER - full width */}
      <div style={{ position: 'relative', marginBottom: '40px' }}>
        <img
          src={banner_rooms}
          alt="Tìm phòng trọ phù hợp"
          style={{
            width: '100%',
            height: isPhone ? '200px' : '320px',
            objectFit: 'cover',
            objectPosition: isPhone ? 'left center' : 'center',
            display: 'block',
          }}
        />

        {/* SEARCH BAR - overlapping banner */}
        <div style={{
          position: 'relative',
          marginTop: isPhone ? '-12px' : '-36px',
          padding: isPhone ? '0 12px' : '0 24px',
          zIndex: 10,
        }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{
              background: '#fff', borderRadius: '16px', padding: isPhone ? '12px' : '14px 20px',
              display: 'flex', gap: '12px', alignItems: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              flexWrap: isPhone ? 'wrap' : 'nowrap',
            }}>
              <div style={{ flex: 1, minWidth: isPhone ? '100%' : '180px' }}>
                <Text style={{ fontSize: '11px', color: '#999', display: 'block', marginBottom: '2px' }}>Khu vực</Text>
                <Select
                  placeholder="Chọn khu vực"
                  suffixIcon={<EnvironmentOutlined />}
                  style={{ width: '100%' }}
                  bordered={false}
                  options={LOCATIONS_T.map(l => ({ label: l.name, value: l.key }))}
                  onChange={val => {
                    const loc = LOCATIONS_T.find(l => l.key === val);
                    if (loc) handleLocationCheck(loc.name, true);
                  }}
                />
              </div>
              <div style={{ width: '1px', height: '36px', background: '#e8e8e8', display: isPhone ? 'none' : 'block' }} />
              <div style={{ flex: 1, minWidth: isPhone ? '100%' : '180px' }}>
                <Text style={{ fontSize: '11px', color: '#999', display: 'block', marginBottom: '2px' }}>Khoảng giá</Text>
                <Select
                  placeholder="Chọn khoảng giá"
                  bordered={false}
                  style={{ width: '100%' }}
                  options={PRICE_OPTIONS.map(o => ({ label: o.label, value: o.value }))}
                  onChange={val => setSelectedPrice(val)}
                  value={selectedPrice}
                  allowClear
                />
              </div>
              <div style={{ width: '1px', height: '36px', background: '#e8e8e8', display: isPhone ? 'none' : 'block' }} />
              <div style={{ flex: 1, minWidth: isPhone ? '100%' : '180px' }}>
                <Text style={{ fontSize: '11px', color: '#999', display: 'block', marginBottom: '2px' }}>Diện tích</Text>
                <Select
                  placeholder="Chọn diện tích"
                  suffixIcon={<ColumnWidthOutlined />}
                  bordered={false}
                  style={{ width: '100%' }}
                  options={AREA_OPTIONS.map(o => ({ label: o.label, value: o.value }))}
                  onChange={val => setSelectedArea(val)}
                  value={selectedArea}
                  allowClear
                />
              </div>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                style={{
                  background: '#27ae60', border: 'none', borderRadius: '12px',
                  height: '48px', padding: '0 28px', fontWeight: 700, fontSize: '15px',
                  minWidth: isPhone ? '100%' : '140px',
                  boxShadow: '0 4px 12px rgba(39,174,96,0.3)'
                }}
              >
                Tìm kiếm
              </Button>
            </div>
          </motion.div>
        </div>
      </div>


      {/* MAIN CONTENT */}
      <div style={{ margin: isPhone ? '16px 0 0' : '32px 0 0', padding: isPhone ? '0 12px' : '0 24px' }}>
        <Row gutter={24}>
          {/* LEFT SIDEBAR */}
          {!isPhone && (
            <Col xs={0} md={7} lg={6}>
              <FilterSidebar />
            </Col>
          )}

          {/* RIGHT CONTENT */}
          <Col xs={24} md={17} lg={18}>
            {/* Results header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '20px', flexWrap: 'wrap', gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Text strong style={{ fontSize: '16px', color: '#333' }}>
                  {loading ? 'Đang tải...' : `${dataRooms.length} kết quả phù hợp`}
                </Text>
                {isPhone && (
                  <Button 
                    icon={<FilterOutlined />} 
                    onClick={() => setFilterDrawerVisible(true)}
                    style={{ borderRadius: '8px', border: '1px solid #27ae60', color: '#27ae60' }}
                  >
                    Lọc
                  </Button>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Text style={{ fontSize: '13px', color: '#888' }}>Sắp xếp:</Text>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: '160px' }}
                  options={[
                    { label: 'Mới nhất', value: 'newest' },
                    { label: 'Giá tăng dần', value: 'price_asc' },
                    { label: 'Giá giảm dần', value: 'price_desc' },
                  ]}
                />
              </div>
            </div>

            {/* Room Listings */}
            {loading ? (
              <div>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{
                    display: 'flex',
                    flexDirection: isPhone ? 'column' : 'row',
                    background: '#fff', borderRadius: '16px',
                    overflow: 'hidden', marginBottom: '16px', border: '1px solid #f0f0f0'
                  }}>
                    <Skeleton.Button active style={{
                      width: isPhone ? '100%' : '280px',
                      height: '200px',
                      borderRadius: 0
                    }} />
                    <div style={{ flex: 1, padding: '20px' }}>
                      <Skeleton active paragraph={{ rows: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : dataRooms.length > 0 ? (
              <div>
                {dataRooms.map((room, index) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    index={index}
                    onClick={() => navigate(`/room/${room.slug}-${room.id}`)}
                  />
                ))}
                {totalElements > 0 && (
                  <div style={{ textAlign: 'center', marginTop: '32px', marginBottom: '16px' }}>
                    <Pagination
                      current={currentPage + 1}
                      pageSize={pageSize}
                      total={totalElements}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      showTotal={(total) => `Tổng số ${total} phòng`}
                    />
                  </div>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center', padding: '80px 0',
                  background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0'
                }}
              >
                <Empty description={<Text style={{ color: '#888', fontSize: '16px' }}>Không tìm thấy phòng trọ phù hợp</Text>} />
                <Button
                  type="primary"
                  onClick={clearAllFilters}
                  style={{
                    marginTop: '20px', background: '#27ae60', border: 'none',
                    borderRadius: '12px', fontWeight: 600, height: '44px', padding: '0 28px'
                  }}
                >
                  Xóa bộ lọc & xem tất cả
                </Button>
              </motion.div>
            )}
          </Col>
        </Row>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        title="Bộ lọc tìm kiếm"
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
        width={320}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ padding: '24px' }}>
           <FilterSidebar />
        </div>
      </Drawer>
    </div>
  );
};

export default RoomsPage;
