import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Grid, CircularProgress, Box, Typography, Button,
    TextField, InputAdornment, IconButton, AppBar, Toolbar
} from '@mui/material';
import {
    useAppDispatch,
    useAppSelector
} from '@/store/store';
import {
    getPosts,
    fetchMorePosts,
    searchPostsAction,
    setSearchTerm,
    clearSearch
} from './postsSlice';
import PostCard from '@/components/PostCard';
import Header from '@/components/Header';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
const PostListPage: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const {
        posts,
        loading,
        loadingMore,
        error,
        total,
        hasMore,
        searchTerm,
        isSearching
    } = useAppSelector((state) => state.posts);

    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    useEffect(() => {
        // 如果没有搜索词，加载常规帖子列表
        if (!isSearching && !searchTerm) {
            dispatch(getPosts());
        }
    }, [dispatch, isSearching, searchTerm]);

    // 初始加载
    useEffect(() => {
        if (localSearchTerm.trim()) {
            dispatch(searchPostsAction(localSearchTerm));
        } else {
            dispatch(getPosts());
        }
    }, [dispatch]);

    // 处理搜索提交
    const handleSearchSubmit = () => {
        if (localSearchTerm.trim()) {
            // 设置redux中的搜索词
            dispatch(setSearchTerm(localSearchTerm));
            // 执行搜索操作
            dispatch(searchPostsAction(localSearchTerm));
        } else if (searchTerm) {
            // 清除搜索
            handleClearSearch();
        }
    };

    // 清除搜索
    const handleClearSearch = () => {
        dispatch(clearSearch());
        setLocalSearchTerm('');
    };

    // 回车提交搜索
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };


    // 滚动事件处理：检测是否滚动到底部
    const handleScroll = useCallback(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        // 当滚动到底部（距离底部100px以内）且没有正在加载，并且还有更多数据
        if (scrollTop + clientHeight >= scrollHeight - 100 && !loading && !loadingMore && hasMore) {
            dispatch(fetchMorePosts());
        }
    }, [loading, loadingMore, hasMore, dispatch]);

    // 监听滚动事件
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // 显示加载更多按钮（替代自动加载）
    const loadMoreHandler = () => {
        if (!loadingMore && hasMore) {
            dispatch(fetchMorePosts());
        }
    };

    // 如果初始加载，显示加载指示器
    if (loading && posts.length === 0) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    // 如果有错误显示错误信息
    if (error) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Typography color="error">Error: {error}</Typography>
            </Container>
        );
    }

    return (
        <>
            <Header title={isSearching ? "Search Results" : "Posts"} />

            {/* 搜索栏 */}
            <AppBar position="sticky" color="default" sx={{ mb: 2 }}>
                <Toolbar>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search posts by title or content..."
                        value={localSearchTerm}
                        onChange={(e) => setLocalSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: localSearchTerm && (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClearSearch} edge="end">
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSearchSubmit}
                        sx={{ ml: 2 }}
                        startIcon={<SearchIcon />}
                        disabled={loading}
                    >
                        Search
                    </Button>
                </Toolbar>
            </AppBar>
            {/* 添加创建新帖子按钮 */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/posts/create')}
                >
                    Create New Post
                </Button>
            </Box>
            {/* 显示搜索状态 */}
            {isSearching && localSearchTerm && (
                <Container maxWidth="md" sx={{ mb: 3 }}>
                    <Typography variant="h6">
                        {posts.length > 0 ?
                            `Found ${posts.length} posts for "${localSearchTerm}"` :
                            `No results for "${localSearchTerm}"`
                        }
                    </Typography>
                    {posts.length > 0 && (
                        <Button
                            variant="outlined"
                            onClick={handleClearSearch}
                            size="small"
                            sx={{ mt: 1 }}
                        >
                            Clear Search
                        </Button>
                    )}
                </Container>
            )}

            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Grid container spacing={3}>
                    {posts.map((post) => (
                        <Grid item xs={12} sm={6} md={4} key={post.id}>
                            <PostCard post={post} />
                        </Grid>
                    ))}
                </Grid>

                {/* 底部加载状态区域 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
                    {/* 加载更多时的指示器 */}
                    {loadingMore && <CircularProgress sx={{ my: 2 }} />}

                    {/* 显示加载更多按钮 */}
                    {!loadingMore && hasMore && (
                        <Button
                            variant="outlined"
                            onClick={loadMoreHandler}
                            disabled={loadingMore}
                            sx={{ mt: 2 }}
                        >
                            Load More Posts
                        </Button>
                    )}

                    {/* 没有更多数据时的提示 */}
                    {!hasMore && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            You've reached the end of the list ({posts.length} of {total} posts)
                        </Typography>
                    )}
                </Box>
            </Container>
        </>
    );
};

export default PostListPage;