// pages/Notifications/Notifications.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, Avatar, Button } from "@heroui/react";
import { CheckCheck } from "lucide-react";
import {
  markAllNotificationAsReadService,
  markNotificationAsReadService,
} from "../../services/notificationsServices";
import { NotificationsContext } from "../../components/NotificationsContext/NotificationsProvider";
import { AuthContext } from "../../components/AuthContext/AuthContextProvider";

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, setNotifications, refreshUnreadCount } =
    useContext(NotificationsContext);
  const { token } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleNotificationClick = async (notif) => {
    // Mark as read if not already read
    if (!notif.isRead) {
      try {
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n)),
        );
        await markNotificationAsReadService(token, notif._id);
        refreshUnreadCount();
      } catch (error) {
        console.error("Failed to mark as read", error);
      }
    }

    // Navigate to post details using entity._id or entityId
    const postId = notif.entity?._id || notif.entityId;

    if (postId) {
      navigate(`/post/${postId}`);
    } else {
      console.warn("No post ID found in notification:", notif);
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsLoading(true);
    try {
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true })),
      );
      await markAllNotificationAsReadService(token);
      refreshUnreadCount();
    } catch (error) {
      console.error("Failed to mark all as read", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationMessage = (type) => {
    switch (type) {
      case "like_post":
        return "liked your post.";
      case "comment":
        return "commented on your post.";
      case "share":
        return "shared your post.";
      default:
        return "interacted with your profile.";
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h1>
        <Button
          size="sm"
          className="bg-[#5E17EB]/10 text-[#5E17EB] font-medium hover:bg-[#5E17EB]/20"
          startContent={<CheckCheck size={16} />}
          onClick={handleMarkAllAsRead}
          isLoading={isLoading}
        >
          Mark all as read
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {!notifications || notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No notifications yet.
          </p>
        ) : (
          notifications.map((notif) => (
            <Card
              key={notif._id}
              isPressable
              onClick={() => handleNotificationClick(notif)}
              className={`w-full shadow-sm border transition-colors ${
                notif.isRead
                  ? "bg-white border-gray-100 dark:bg-gray-900 dark:border-gray-800"
                  : "bg-[#5E17EB]/5 border-[#5E17EB]/20 dark:bg-[#5E17EB]/10"
              }`}
            >
              <CardBody className="p-4 flex flex-row items-center gap-4">
                <Avatar
                  src={notif.actor?.photo || "https://via.placeholder.com/40"}
                  alt={notif.actor?.name || "User"}
                  size="md"
                  className="flex-shrink-0"
                />
                <div className="flex-1 flex flex-col text-left">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-bold">{notif.actor?.name}</span>{" "}
                    {getNotificationMessage(notif.type)}
                  </p>
                  <span className="text-xs text-gray-400 mt-1">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
                {!notif.isRead && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5E17EB] flex-shrink-0" />
                )}
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
