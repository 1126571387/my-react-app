import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoginPage from '@/features/auth/LoginPage';
import PostListPage from '@/features/posts/PostListPage';
import PostDetailPage from '@/features/posts/PostDetailPage';
import ProtectedRoute from '@/components/ProtectedRoute';

import CreatePostPage from './features/posts/CreatePostPage';
import EditPostPage from './features/posts/EditPostPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/posts" element={<PostListPage />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
              <Route path="/posts/create" element={<CreatePostPage />} /> {/* 创建帖子路由 */}
              <Route path="/posts/edit/:id" element={<EditPostPage />} /> {/* 编辑帖子路由 */}
              <Route path="*" element={<PostListPage />} />
            </Route>
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;