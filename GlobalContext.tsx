import React, { createContext, useEffect, useRef, useState } from 'react';
import { showToast } from './utils/Toast';
import { Post } from './types/Post';
import BottomSheet from '@gorhom/bottom-sheet';

// global context provider
const GlobalContext = createContext<{
  [key: string]: any;
  posts: Post[] | null;
  setPosts: (value: Post[]) => void;
  completedQuests: string[];
  setCompletedQuests: (value: string[]) => void;
  bottomSheetRef: React.RefObject<BottomSheet>;
  currentPostId: string;
  setCurrentPostId: (value: string) => void;
}>({
  posts: null,
  setPosts: () => {},
  completedQuests: [],
  setCompletedQuests: () => {},
  bottomSheetRef: { current: null },
  currentPostId: '',
  setCurrentPostId: () => {},
});

export default GlobalContext;

export const GlobalContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // GLOBAL CONTEXT STATE
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [currentPostId, setCurrentPostId] = useState<string>('');

  useEffect(() => {
    // get the default error handler
    const defaultErrorHandler = ErrorUtils.getGlobalHandler();
    // overwrite the error handler
    const customErrorHandler = (error: Error, isFatal?: boolean | undefined) => {
      console.log('Custom error handler:', error); // log the error
      showToast(error.message); // display toast
      // call the default handler afterwards
      defaultErrorHandler(error, false);
    };
    ErrorUtils.setGlobalHandler(customErrorHandler); // overwrite the original error handler
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        posts,
        setPosts,
        completedQuests,
        setCompletedQuests,
        bottomSheetRef,
        currentPostId,
        setCurrentPostId,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};
