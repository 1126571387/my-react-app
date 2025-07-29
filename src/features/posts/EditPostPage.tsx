import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { updateExistingPost } from './postsSlice';
import { Container, Box, Button, TextField, CircularProgress } from '@mui/material';
import Header from '@/components/Header';

const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const currentPost = useAppSelector(state => 
    state.posts.posts.find(post => post.id === Number(id)) || 
    state.posts.currentPost
  );
  
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    tags: '',
  });
  
  const [errors, setErrors] = useState({
    title: false,
    content: false
  });
  
  // 加载帖子数据
  useEffect(() => {
    if (currentPost) {
      setPostData({
        title: currentPost.title,
        content: currentPost.body,
        tags: currentPost.tags.join(', '),
      });
    }
  }, [currentPost]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
    
    // 清除错误状态
    if (name === 'title' || name === 'content') {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    const hasTitleError = postData.title.trim() === '';
    const hasContentError = postData.content.trim() === '';
    setErrors({ title: hasTitleError, content: hasContentError });
    
    if (hasTitleError || hasContentError) {
      return;
    }
    
    const tags = postData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    
    if (currentPost) {
      dispatch(updateExistingPost({
        id: currentPost.id,
        postData: {
          title: postData.title,
          body: postData.content,
          tags
        }
      }))
        .unwrap()
        .then(updatedPost => {
          alert(`"${updatedPost.title}" updated successfully!`);
          navigate(`/posts/${currentPost.id}`);
        })
        .catch(error => {
          alert(`Update failed: ${error.message}`);
        });
    }
  };
  
  if (!currentPost) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }
  
  return (
    <>
      <Header title="Edit Post" />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={postData.title}
            onChange={handleChange}
            margin="normal"
            required
            error={errors.title}
            helperText={errors.title && 'Title is required'}
          />
          
          <TextField
            fullWidth
            label="Content"
            name="content"
            value={postData.content}
            onChange={handleChange}
            margin="normal"
            multiline
            minRows={4}
            required
            error={errors.content}
            helperText={errors.content && 'Content is required'}
          />
          
          <TextField
            fullWidth
            label="Tags (comma separated)"
            name="tags"
            value={postData.tags}
            onChange={handleChange}
            margin="normal"
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate(`/posts/${currentPost.id}`)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
            >
              Update Post
            </Button>
          </Box>
        </form>
      </Container>
    </>
  );
};

export default EditPostPage;