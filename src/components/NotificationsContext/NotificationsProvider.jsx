import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { AuthContext } from "../AuthContext/AuthContextProvider";
import {
  getNotificationsService,
  getUnreadCountService,
} from "../../services/notificationsServices";
export const NotificationsContext = createContext();

export default function NotificationsProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    if (!token) {
      setUnreadCount(0);
      return;
    }
    try {
      const response = await getUnreadCountService(token);
      setUnreadCount(response.data.data.unreadCount);
    } catch (error) {
      console.error("Error getting unreadCount");
    }
  }, [token]);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await getNotificationsService(token);
        setNotifications(response.data.data.notifications);
      } catch (error) {
        console.error("Error getting notifications");
      }
    };
    getNotifications();
  }, [token]);

  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        setNotifications,
        unreadCount,
        setUnreadCount,
        refreshUnreadCount,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
