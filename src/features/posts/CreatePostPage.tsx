import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/store';
import { createNewPost } from './postsSlice';
import { Container, Box, Button, TextField } from '@mui/material';
import Header from '@/components/Header';

const CreatePostPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    tags: '',
  });
  
  const [errors, setErrors] = useState({
    title: false,
    content: false
  });
  
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
    
    dispatch(createNewPost({
      title: postData.title,
      body: postData.content,
      tags
    }))
      .unwrap()
      .then(response => {
        alert(`Post "${response.title}" created with ID: ${response.id}`);
        navigate('/posts');
      })
      .catch(error => {
        alert(`Failed to create post: ${error.message}`);
      });
  };
  
  return (
    <>
 <>
      <Header title="Create New Post" />
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
            placeholder="e.g., I am in love with someone."
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
            helperText="e.g., love, relationships, emotions"
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/posts')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
            >
              Create Post
            </Button>
          </Box>
        </form>
      </Container>
    </>
    </>
  );
};

export default CreatePostPage;