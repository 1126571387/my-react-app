


import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchPosts, fetchPostById, createPost, updatePost, deletePost, searchPosts } from '@/services/postsApi';
import type { Post, UpdatePostResponse, DeletePostResponse, CreatePostResponse } from '@/types/apiTypes';

interface PostsState {
    posts: Post[];
    currentPost: Post | null;
    loading: boolean;
    loadingMore: boolean; // 添加加载更多状态
    error: string | null;
    skip: number; // 当前分页位置
    limit: number; // 每页数据量
    total: number; // 总数据量
    hasMore: boolean; // 是否还有更多数据可加载
    searchTerm: string; // 搜索关键字
    isSearching: boolean; // 是否正在搜索
    currentEditingPost: Post | null; // 当前正在编辑的帖子
}

const initialState: PostsState = {
    posts: [],
    currentPost: null,
    loading: false,
    loadingMore: false, // 初始为 false
    error: null,
    skip: 0,
    limit: 10,
    total: 0,
    hasMore: true, // 初始为 true
    searchTerm: '', // 初始化为空
    isSearching: false, // 默认不在搜索状态
    currentEditingPost: null,
};

// 创建新帖子
export const createNewPost = createAsyncThunk(
    'posts/createNew',
    async (postData: {
        title: string;
        body: string;
        tags: string[];
    }, { getState }) => {
        const { auth } = getState() as { auth: { user: { id: number } | null } };
        const userId = auth.user?.id;

        if (!userId) {
            throw new Error('User not authenticated');
        }

        const createData = {
            title: postData.title,
            userId,
            body: postData.body,
            tags: postData.tags
        };

        return createPost(createData);
    }
);



// 更新帖子
export const updateExistingPost = createAsyncThunk(
    'posts/updateExisting',
    async ({ id, postData }: {
        id: number;
        postData: {
            title?: string;
            body?: string;
            tags?: string[];
        }
    }) => {
        return updatePost(id, postData);
    }
);

// 删除帖子 
export const deleteExistingPost = createAsyncThunk(
    'posts/deleteExisting',
    async (postId: number) => {
        const response = await deletePost(postId);

        return response;
    }
);

// 添加搜索异步操作
export const searchPostsAction = createAsyncThunk('posts/search', async (query: string, thunkAPI) => {
    return await searchPosts(query);
});

// 初始化加载帖子列表
export const getPosts = createAsyncThunk('posts/getPosts', async (_, thunkAPI) => {
    const state = thunkAPI.getState() as { posts: PostsState };
    const { limit, skip } = state.posts;
    return await fetchPosts(limit, skip);
});

// 加载更多帖子 - 新的异步操作
export const fetchMorePosts = createAsyncThunk('posts/fetchMorePosts', async (_, thunkAPI) => {
    const state = thunkAPI.getState() as { posts: PostsState };
    const { skip, limit, total, posts } = state.posts;

    // 如果已经加载完全部数据，则不再请求
    if (posts.length >= total) {
        return { posts: [], total, skip, limit };
    }

    const newSkip = skip + limit;
    return await fetchPosts(limit, newSkip);
});

export const getPostById = createAsyncThunk('posts/getPostById', async (id: string) => {
    return await fetchPostById(id);
});


const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        resetOperationStatus: (state) => {
            state.loading = false;
            state.error = null;
        },
        // 新增：设置搜索关键字
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
        // 新增：清除搜索状态
        clearSearch: (state) => {
            state.searchTerm = '';
            state.isSearching = false;
            state.posts = [];
            state.skip = 0;
            state.total = 0;
            state.hasMore = true;
        },
        // 设置当前编辑的帖子
        setEditingPost: (state, action: PayloadAction<Post | null>) => {
            state.currentEditingPost = action.payload;
        }
    },
    extraReducers: (builder) => {
        // 处理创建帖子
        builder.addCase(createNewPost.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createNewPost.fulfilled, (state, action: PayloadAction<CreatePostResponse>) => {
            // 按照图片1的响应格式处理返回数据
            const newPost: Post = {
                id: action.payload.id,
                title: action.payload.title,
                body: action.payload.body || '',
                tags: action.payload.tags || [],
                reactions: action.payload.reactions || { likes: 0, dislikes: 0 },
                views: action.payload.views || 0,
                userId: action.payload.userId
            };

            state.posts = [newPost, ...state.posts];
            state.total += 1;
            state.loading = false;
        });
        builder.addCase(createNewPost.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to create post';
            state.loading = false;
        });

        // 处理更新帖子
        builder.addCase(updateExistingPost.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateExistingPost.fulfilled, (state, action: PayloadAction<UpdatePostResponse>) => {
            // 更新列表中的帖子
            state.posts = state.posts.map(post =>
                post.id === action.payload.id ? action.payload : post
            );

            // 如果当前查看的是被更新的帖子，更新当前帖子状态
            if (state.currentPost?.id === action.payload.id) {
                state.currentPost = action.payload;
            }

            state.loading = false;
        });
        builder.addCase(updateExistingPost.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to update post';
            state.loading = false;
        });

        // 处理删除帖子
        builder.addCase(deleteExistingPost.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteExistingPost.fulfilled, (state, action: PayloadAction<DeletePostResponse>) => {
            const deletedPostId = action.payload.id;

            // 从列表中移除帖子
            state.posts = state.posts.filter(post => post.id !== deletedPostId);

            // 如果当前查看的是被删除的帖子，清除当前帖子状态
            if (state.currentPost?.id === deletedPostId) {
                state.currentPost = null;
            }

            state.total -= 1;
            state.loading = false;
        });
        builder.addCase(deleteExistingPost.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to delete post';
            state.loading = false;
        });

        // 搜索开始
        builder.addCase(searchPostsAction.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.isSearching = true;
        });

        // 搜索成功
        builder.addCase(searchPostsAction.fulfilled, (state, action) => {
            const { posts, total } = action.payload;
            state.posts = posts;
            state.total = total;
            state.loading = false;
            state.hasMore = false; // 搜索不加载更多
            state.skip = state.posts.length;
        });

        // 搜索失败
        builder.addCase(searchPostsAction.rejected, (state, action) => {
            state.error = action.error.message || 'Search failed';
            state.loading = false;
            state.isSearching = false;
        });
        // 初始化加载处理
        builder.addCase(getPosts.pending, (state) => {
            if (state.skip === 0) {
                state.loading = true;
            }
            state.error = null;
        });
        builder.addCase(getPosts.fulfilled, (state, action) => {
            const { posts, total } = action.payload;
            state.posts = posts; // 初始加载覆盖现有数据
            state.total = total;
            state.skip = posts.length; // 更新skip位置
            state.hasMore = state.posts.length < total;
            state.loading = false;
        });
        builder.addCase(getPosts.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to fetch posts';
            state.loading = false;
        });

        // 加载更多处理
        builder.addCase(fetchMorePosts.pending, (state) => {
            state.loadingMore = true;
            state.error = null;
        });
        builder.addCase(fetchMorePosts.fulfilled, (state, action) => {
            const { posts, total } = action.payload;
            state.posts = [...state.posts, ...posts]; // 将新数据追加到现有数据
            state.total = total;
            state.skip = state.posts.length; // 更新skip位置
            state.hasMore = state.posts.length < total;
            state.loadingMore = false;
        });
        builder.addCase(fetchMorePosts.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to fetch more posts';
            state.loadingMore = false;
        });

        // 单个帖子详情（保持不变）
        builder.addCase(getPostById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getPostById.fulfilled, (state, action) => {
            state.currentPost = action.payload;
            state.loading = false;
        });
        builder.addCase(getPostById.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to fetch post';
            state.loading = false;
        });
    }
});

export const { setSearchTerm, clearSearch, setEditingPost, resetOperationStatus } = postsSlice.actions;
export default postsSlice.reducer;

