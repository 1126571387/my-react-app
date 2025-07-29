import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type{ Post } from '@/types/apiTypes';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ minHeight: 180, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div">
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          {post.body.substring(0, 50)}...
        </Typography>
        <Typography variant="caption" display="block" sx={{ mb: 1 }}>
          👍 {post.reactions.likes} | 🔖 {post.tags.join(', ')}
        </Typography>
      </CardContent>
      <Button
        size="small"
        onClick={() => navigate(`/posts/${post.id}`)}
        sx={{ alignSelf: 'flex-end', m: 1 }}
      >
        View Details
      </Button>
    </Card>
  );
};

export default PostCard;