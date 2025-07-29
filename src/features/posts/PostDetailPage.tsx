import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography, Button, CircularProgress, Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getPostById } from './postsSlice';
import Header from '@/components/Header';
import { deleteExistingPost } from './postsSlice';

const PostDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { currentPost, loading } = useAppSelector((state) => state.posts);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            dispatch(getPostById(id));
        }
    }, [dispatch, id]);

    const handleDelete = () => {
        if (currentPost && window.confirm('Are you sure you want to delete this post?')) {
            dispatch(deleteExistingPost(currentPost.id))
                .unwrap()
                .then((deletedResponse) => {
                    alert(`"${deletedResponse.title}" has been deleted!`);
                    navigate('/posts');
                })
                .catch(error => {
                    alert(`Delete failed: ${error.message}`);
                });
        }
    };

    if (loading || !currentPost) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }
    return (
        <>
            <Header title="Post Details" />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Card sx={{ boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h5" component="div" gutterBottom>
                            {currentPost.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Post ID: {currentPost.id} | User ID: {currentPost.userId}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {currentPost.body}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            Tags: {currentPost.tags.join(', ')}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            👍 {currentPost.reactions.likes} likes | 👎 {currentPost.reactions.dislikes} dislikes
                        </Typography>
                        <Button
                            variant="outlined"
                            sx={{ mt: 2 }}
                            onClick={() => navigate('/posts')}
                        >
                            Back to Posts
                        </Button>
                        {/* 添加操作按钮 */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ flex: 1 }}
                                onClick={() => navigate(`/posts/edit/${currentPost.id}`)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                sx={{ flex: 1 }}
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
};

export default PostDetailPage;