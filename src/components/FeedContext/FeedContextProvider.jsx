import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { AuthContext } from "../AuthContext/AuthContextProvider";
import { getBookmarksService } from "../../services/postServices";

export const FeedContext = createContext({
  bookmarkCount: 0,
  isBookmarkCountLoading: true,
  setBookmarkCount: () => {},
  refreshBookmarkCount: () => {},
});

export default function FeedContextProvider({ children }) {
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [isBookmarkCountLoading, setIsBookmarkCountLoading] = useState(true);
  const { token } = useContext(AuthContext);

  const refreshBookmarkCount = useCallback(async () => {
    setIsBookmarkCountLoading(true);
    if (!token) {
      setBookmarkCount(0);
      setIsBookmarkCountLoading(false);
      return;
    }

    try {
      const response = await getBookmarksService(token, 1, 1);
      const count = response.data.meta.pagination.total || 0;
      setBookmarkCount(count);
    } catch (error) {
      console.error("Error fetching bookmark count:", error);
      setBookmarkCount(0);
    } finally {
      setIsBookmarkCountLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshBookmarkCount();
  }, [refreshBookmarkCount]);

  const value = useMemo(
    () => ({
      bookmarkCount,
      isBookmarkCountLoading,
      setBookmarkCount,
      refreshBookmarkCount,
    }),
    [bookmarkCount, isBookmarkCountLoading, refreshBookmarkCount],
  );

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}
