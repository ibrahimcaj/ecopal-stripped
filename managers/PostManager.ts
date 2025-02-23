import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { debugLog } from '../utils/DebugLogger';

import { showToast } from '../utils/Toast';
import { Post } from '../types/Post';
import { PostComment } from '../types/PostComment';
import { useContext } from 'react';
import GlobalContext from '../GlobalContext';

export const fetchAllPosts = async () => {
  try {
    const user = auth().currentUser;
    if (!user) {
      showToast('User not authenticated');
      return [];
    }

    const postsSnapshot = await firestore().collection('users').doc(user.uid).collection('posts').get();
    const posts = postsSnapshot.docs.map((doc) => {
      const post = doc.data() as Post;
      post.id = doc.id;
      return post;
    });

    debugLog('POST MANAGER', 'Fetched all posts successfully', posts.length);
    return posts;
  } catch (error) {
    debugLog('POST MANAGER', 'Error fetching posts', error);
    showToast('Error fetching posts');
    return [];
  }
};

export const addPost = async (context: any, postContent: string, mediaUrl: string) => {
  debugLog('POST MANAGER', 'Adding post...');
  try {
    const user = auth().currentUser;
    if (!user) {
      showToast('User not authenticated');
      return;
    }

    var post = new Post(
      '',
      postContent,
      {
        id: auth().currentUser!.uid,
        name: auth().currentUser!.displayName || '',
        photoURL: auth().currentUser!.photoURL || '',
      },
      mediaUrl ? [mediaUrl] : []
    );
    console.log(post);
    const pushedPost = await firestore().collection('users').doc(auth().currentUser!.uid).collection('posts').add(post);
    post.id = pushedPost.id;

    context.setPosts([post, ...context.posts]);

    debugLog('POST MANAGER', 'Post added successfully', post.id);
    showToast('Post added successfully');
  } catch (error) {
    debugLog('POST MANAGER', 'Error adding post', error);
    showToast('Error adding post');
  }
};

export const togglePostLike = async (context: any, postId: string) => {
  debugLog('POST MANAGER', 'Toggling post like...');
  try {
    const user = auth().currentUser;
    if (!user) {
      showToast('User not authenticated');
      return;
    }

    const postRef = firestore().collection('posts').doc(postId);

    const postDoc = await postRef.get();
    if (!postDoc.exists) {
      showToast('Post not found');
      return;
    }

    const post = postDoc.data() as Post;
    const userId = user.uid;
    var likes = post.likes || [];

    if (likes.includes(userId)) {
      likes = likes.filter((id) => id !== userId);
    } else {
      likes.push(userId);
    }

    console.log(likes);

    await postRef.set({ likes: likes }, { merge: true });
    debugLog('POST MANAGER', 'Post like toggled successfully', postId, likes);
  } catch (error) {
    debugLog('POST MANAGER', 'Error toggling post like', error);
    showToast('Error toggling post like');
  }
};

export const addComment = async (postId: string, commentContent: string) => {
  try {
    const user = auth().currentUser;
    if (!user) {
      showToast('User not authenticated');
      return;
    }

    var comment = new PostComment(
      '',
      {
        id: auth().currentUser!.uid,
        name: auth().currentUser!.displayName || '',
        photoURL: auth().currentUser!.photoURL || '',
      },
      commentContent,
      [],
      Date.now()
    );
    const pushedComment = await firestore()
      .collection('users')
      .doc(auth().currentUser!.uid)
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .add(comment);
    comment.id = pushedComment.id;

    debugLog('POST MANAGER', 'Comment added successfully', comment.id);
    showToast('Comment added successfully');
  } catch (error) {
    debugLog('POST MANAGER', 'Error adding comment', error);
    showToast('Error adding comment');
  }
};

export const fetchComments = async (postId: string): Promise<PostComment[]> => {
  try {
    const user = auth().currentUser;
    if (!user) {
      showToast('User not authenticated');
      return [];
    }

    const commentsSnapshot = await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .get();

    const comments = commentsSnapshot.docs.map((doc) => {
      const comment = doc.data() as PostComment;
      comment.id = doc.id;
      return comment;
    });

    debugLog('POST MANAGER', 'Fetched comments successfully', postId, comments.length, comments);
    return comments;
  } catch (error) {
    debugLog('POST MANAGER', 'Error fetching comments', error);
    showToast('Error fetching comments');
    return [];
  }
};

export const toggleCommentLike = async (postId: string, commentId: string) => {
  debugLog('POST MANAGER', 'Toggling comment like...');
  try {
    const user = auth().currentUser;
    if (!user) {
      showToast('User not authenticated');
      return;
    }

    const commentRef = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .doc(commentId);

    const commentDoc = await commentRef.get();
    if (!commentDoc.exists) {
      showToast('Comment not found');
      return;
    }

    const comment = commentDoc.data() as PostComment;
    const userId = user.uid;
    var likes = comment.likes || [];

    if (likes.includes(userId)) {
      likes = likes.filter((id) => id !== userId);
    } else {
      likes.push(userId);
    }

    await commentRef.update({ likes: likes });
    debugLog('POST MANAGER', 'Comment like toggled successfully', commentId, likes);

    // @ts-ignore
    context.setComments(context.comments!.map((c) => (c.id === commentId ? { ...c, likes: likes } : c)));
  } catch (error) {
    debugLog('POST MANAGER', 'Error toggling comment like', error);
    showToast('Error toggling comment like');
  }
};

export const fetchUserPosts = async (userId: string): Promise<Post[]> => {
  try {
    const postsSnapshot = await firestore().collection('users').doc(userId).collection('posts').get();
    const posts = postsSnapshot.docs.map((doc) => {
      const post = doc.data() as Post;
      post.id = doc.id;
      return post;
    });

    debugLog('POST MANAGER', 'Fetched user posts successfully', posts.length);
    return posts;
  } catch (error) {
    debugLog('POST MANAGER', 'Error fetching user posts', error);
    showToast('Error fetching user posts');
    return [];
  }
};
