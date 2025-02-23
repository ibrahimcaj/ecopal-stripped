import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import GlobalContext from './GlobalContext';
import { FontsStyles } from './Styles';
import COLORS from './utils/constants/COLORS';
import { PostComment } from './types/PostComment';
import { addComment, fetchComments, toggleCommentLike } from './managers/PostManager';
import { relativeTimeFormat } from './utils/relativeTimeFormat';
import { HeartIcon } from './icons/HeartIcon';
import { useSelector } from 'react-redux';
import { selectUser } from './state/userSlice';
import { PlusIcon } from './icons/PlusIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Main: React.FC = ({ children }) => {
  const context = useContext(GlobalContext);
  const { bottomSheetRef } = context;
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);

  useEffect(() => {
    AsyncStorage.clear();
  }, []);

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;
    await addComment(context.currentPostId, newComment);

    const fetchedComments = await fetchComments(context.currentPostId);
    console.log('Fetched comments after adding:', fetchedComments);
    setComments(fetchedComments);
    setNewComment('');
  };

  const handleToggleCommentLike = async (commentId: string) => {
    await toggleCommentLike(context.currentPostId, commentId);
    const fetchedComments = await fetchComments(context.currentPostId);
    setComments(fetchedComments);
  };

  return (
    <View style={{ flex: 1 }}>
      {children}

      <BottomSheet
        index={-1}
        enablePanDownToClose
        enableDynamicSizing={false}
        snapPoints={['1%', '50%']}
        backdropComponent={BottomSheetBackdrop}
        backgroundStyle={{
          backgroundColor: COLORS.white,
        }}
        ref={bottomSheetRef}
        onChange={async (index) => {
          if (index >= 0) {
            setComments([]); // Clear comments array
            setLoading(true);
            const fetchedComments = await fetchComments(context.currentPostId);
            console.log('Fetched comments on bottom sheet open:', fetchedComments);
            setComments(fetchedComments);
            setLoading(false);
          }
        }}>
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            padding: 16,
            gap: 16,
          }}>
          <Text style={[FontsStyles.h3, FontsStyles.weightRegular]}>Komentari</Text>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
            />
          ) : (
            comments.map((comment) => (
              <View
                key={comment.id}
                style={{ width: '100%', marginVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Image
                  source={{ uri: comment.author.photoURL }}
                  style={{ width: 38, height: 38, borderRadius: 100 }}
                />
                <View>
                  <Text style={[FontsStyles.h4, FontsStyles.weightLight, { color: COLORS.gray }]}>
                    {comment.author.name}
                  </Text>
                  <Text style={[FontsStyles.h3, FontsStyles.weightLight]}>{comment.content}</Text>
                  <Text style={[FontsStyles.h4, FontsStyles.weightLight, { color: COLORS.gray }]}>
                    {relativeTimeFormat(comment.createdAt)}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleToggleCommentLike(comment.id)}
                  style={{ marginLeft: 'auto' }}>
                  <HeartIcon
                    size={20}
                    color={comment.likes.includes(user.value.id) ? 'red' : 'black'}
                    fill={comment.likes.includes(user.value.id) ? 'red' : 'none'}
                  />
                </TouchableOpacity>
              </View>
            ))
          )}

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput
              cursorColor={COLORS.black}
              selectionColor={COLORS.black}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Napišite komentar..."
              style={[
                FontsStyles.weightLight,
                FontsStyles.h3,
                {
                  flex: 1,
                  height: '100%',
                  width: '100%',
                  backgroundColor: COLORS.secondary,
                  borderRadius: 32,
                  padding: 12,
                },
              ]}></TextInput>

            <TouchableOpacity
              onPress={handleAddComment}
              style={[
                {
                  width: 48,
                  height: 48,

                  justifyContent: 'center',
                  alignItems: 'center',

                  backgroundColor: COLORS.secondary,
                  borderRadius: 32,
                },
              ]}>
              <PlusIcon
                size={32}
                color={COLORS.black}
              />
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default Main;
