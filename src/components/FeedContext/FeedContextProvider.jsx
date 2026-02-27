import React, { createContext, useMemo, useState } from "react";

export const FeedContext = createContext({
  bookmarkCount: 0,
  setBookmarkCount: () => {},
});

export default function FeedContextProvider({ children }) {
  const [bookmarkCount, setBookmarkCount] = useState(0);

  const value = useMemo(
    () => ({
      bookmarkCount,
      setBookmarkCount,
    }),
    [bookmarkCount],
  );

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}
