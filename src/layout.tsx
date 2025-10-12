import React from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import UsersPage from './pages/Page.Users';
import ProductsPage from './pages/Page.Products';
import CategoriesPage from './pages/Page.Categories';
import ProductColorsPage from './pages/Page.ProductColors';
import ProductSizesPage from './pages/Page.ProductSizes';
import OrdersPage from './pages/Page.Orders';
import LoginPage from './pages/Page.Login';
import { useAtom } from 'jotai';
import { AUTH } from './store';

const { Header, Sider, Content } = Layout;

const items = [
  {
    key: 'users',
    icon: <UserOutlined />,
    label: <Link to="/users">Quản lý người dùng</Link>,
  },
  {
    key: 'products',
    icon: <AppstoreOutlined />,
    label: <Link to="/products">Quản lý sản phẩm</Link>,
  },
  {
    key: 'categories',
    icon: <AppstoreOutlined />,
    label: <Link to="/categories">Quản lý danh mục</Link>,
  },
  {
    key: 'product-colors',
    icon: <AppstoreOutlined />,
    label: <Link to="/product-colors">Quản lý màu sản phẩm</Link>,
  },
  {
    key: 'product-sizes',
    icon: <AppstoreOutlined />,
    label: <Link to="/product-sizes">Quản lý size sản phẩm</Link>,
  },
  {
    key: 'orders',
    icon: <ShoppingCartOutlined />,
    label: <Link to="/orders">Quản lý đơn hàng</Link>,
  },
];

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth] = useAtom(AUTH)
  const location = useLocation()
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}

const RootLayout: React.FC = () => (
  <Router>
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={285}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255,255,255,0.2)', color: '#fff', textAlign: 'center', lineHeight: '32px', fontWeight: 'bold' }}>
          CMS
        </div>
        <Menu theme="dark" mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 'bold', fontSize: 18 }}>Simple CMS with Ant Design</div>
          <AuthActions />
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/users" element={<Protected><UsersPage /></Protected>} />
              <Route path="/products" element={<Protected><ProductsPage /></Protected>} />
              <Route path="/orders" element={<Protected><OrdersPage /></Protected>} />
              <Route path="/categories" element={<Protected><CategoriesPage /></Protected>} />
              <Route path="/product-colors" element={<Protected><ProductColorsPage /></Protected>} />
              <Route path="/product-sizes" element={<Protected><ProductSizesPage /></Protected>} />
              <Route path="*" element={<Navigate to="/products" replace />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  </Router>
);

const AuthActions: React.FC = () => {
  const [auth, setAuth] = useAtom(AUTH)
  const logout = () => {
    const next = { isAuthenticated: false }
    setAuth(next)
    localStorage.setItem('auth', JSON.stringify(next))
  }
  if (!auth.isAuthenticated) {
    return <Link to="/login">Đăng nhập</Link>
  }
  return <Button onClick={logout}>Đăng xuất</Button>
}

export default RootLayout;
