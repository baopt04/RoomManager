import React from 'react';
import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Client/Layout/Header';
import Footer from '../../components/Client/Layout/Footer';

const { Content } = Layout;

const ClientLayout = ({ children }) => {
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Header />
      
      <Content style={{ paddingTop: '72px' }}>
        {children}
      </Content>

      <Footer />
    </Layout>
  );
};

export default ClientLayout;

