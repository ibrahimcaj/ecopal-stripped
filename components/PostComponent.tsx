import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Button } from 'react-native';
import { ProfilePicture } from './ProfilePicture';
import { FontsStyles } from '../Styles';
import { relativeTimeFormat } from '../utils/relativeTimeFormat';
import COLORS from '../utils/constants/COLORS';
import { Post } from '../types/Post';
import { CommentIcon } from '../icons/CommentIcon';
import { HeartIcon } from '../icons/HeartIcon';
import { togglePostLike, addComment, fetchComments, toggleCommentLike } from '../managers/PostManager';
import GlobalContext from '../GlobalContext';
import { useSelector } from 'react-redux';
import { selectUser } from '../state/userSlice';
import { PostComment } from '../types/PostComment';
import auth from '@react-native-firebase/auth';

interface PostComponentProps {
  post: Post;
}

const PostComponent: React.FC<PostComponentProps> = ({ post }) => {
  const user = useSelector(selectUser);
  const context = useContext(GlobalContext);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [increment, setIncrement] = useState(0);

  const handleCommentPress = async () => {
    context.bottomSheetRef.current?.expand();
    context.setCurrentPostId(post.id);
    const fetchedComments = await fetchComments(post.id);
    setComments(fetchedComments);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;
    await addComment(post.id, newComment);
    const fetchedComments = await fetchComments(post.id);
    setComments(fetchedComments);
    setNewComment('');
  };

  useEffect(() => {
    if (post.likes.includes(auth().currentUser!.uid)) setIncrement(1);
  }, []);

  return (
    <View
      key={post.id}
      style={{ gap: 16, paddingVertical: 16 }}>
      {/* POST MAIN INFORMATION */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <ProfilePicture
          size={38}
          photoURL={post.author.photoURL}
        />
        <View style={{ flexDirection: 'column' }}>
          <Text style={[FontsStyles.h3, FontsStyles.weightLight]}>{post.author.name}</Text>
          <Text style={[FontsStyles.h3, FontsStyles.weightLight, { color: COLORS.gray }]}>
            {relativeTimeFormat(post.createdAt)}
          </Text>
        </View>
      </View>

      <Text style={[FontsStyles.h3, FontsStyles.weightLight]}>{post.title}</Text>

      {/* MEDIA */}
      {post.media[0] && (
        <View
          style={{
            width: '100%',
            height: 200,
            backgroundColor: '#eeeeee',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
          <Image
            src={post.media[0]}
            style={{ width: '100%', height: '100%' }}></Image>
        </View>
      )}

      {/* CTAS */}
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        {/* LIKE BUTTON */}
        <TouchableOpacity
          style={{ flexDirection: 'row', gap: 4, alignItems: 'center', justifyContent: 'center' }}
          onPress={async () => {
            await togglePostLike(context, post.id);

            if (increment === 1) setIncrement(0);
            else setIncrement(1);
          }}>
          <HeartIcon
            size={28}
            color={increment === 1 ? 'red' : 'black'}
            fill={increment === 1 ? 'red' : 'none'}
          />
          <Text style={[FontsStyles.h3, FontsStyles.weightLight]}>{post.likes.length + increment}</Text>
        </TouchableOpacity>
        {/* COMMENT BUTTON */}
        <TouchableOpacity onPress={handleCommentPress}>
          <CommentIcon size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostComponent;
