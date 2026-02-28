import axios from "axios";
const BaseURL = import.meta.env.VITE_BASE_URL;

export const getNotificationsService = async (
  token,
  unread = false,
  page = 1,
  limit = 10,
) => {
  const response = axios.get(`${BaseURL}/notifications`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    params: {
      unread: unread,
      page: page,
      limit: limit,
    },
  });
  return response;
};

// Example of GET Notifications respons
/*
{
    "success": true,
    "message": "success",
    "data": {
        "notifications": [
            {
                "_id": "69a183d6056bdb7627501c38",
                "recipient": {
                    "_id": "69962211056bdb7627e028fd",
                    "name": "Mohamed Shalaby",
                    "photo": "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/1772275521673-bf38ec27-121e-44e3-bd2a-3d8141c533f0-1000138799.webp"
                },
                "actor": {
                    "_id": "699a0ab8056bdb7627079736",
                    "name": "Muhammed Khaled",
                    "photo": "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/1772161295274-df3aa5a0-f2f2-4fdb-93b2-6e6751752ed2-IMG_2634.webp"
                },
                "type": "like_post",
                "entityType": "post",
                "entityId": "69a17d58056bdb76274febfe",
                "isRead": false,
                "createdAt": "2026-02-27T11:45:26.864Z",
                "entity": {
                    "_id": "69a17d58056bdb76274febfe",
                    "body": "👋 Hi",
                    "user": "69962211056bdb7627e028fd",
                    "commentsCount": 1,
                    "topComment": {
                        "_id": "69a17ee7056bdb76274ff4c7",
                        "content": "test",
                        "commentCreator": {
                            "_id": "698cf4d93bf9737117644b32",
                            "name": "ahmed",
                            "photo": "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
                        },
                        "post": "69a17d58056bdb76274febfe",
                        "parentComment": null,
                        "likes": [],
                        "createdAt": "2026-02-27T11:24:23.369Z"
                    },
                    "sharesCount": 0,
                    "likesCount": 0,
                    "isShare": false,
                    "id": "69a17d58056bdb76274febfe"
                }
            },
}

*/

export const getUnreadCountService = async (token) => {
  const response = axios.get(`${BaseURL}/notifications/unread-count`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

/* 
Example of GET unread count response:

{
    "success": true,
    "message": "success",
    "data": {
        "unreadCount": 11
    }
}

*/

export const markNotificationAsReadService = async (token, notificationID) => {
  const response = axios.patch(
    `${BaseURL}/notifications/${notificationID}/read`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};

/*

Example of mark notifications as read service :

{
    "success": true,
    "message": "success",
    "data": {
        "notification": {
            "_id": "69a183d6056bdb7627501c38",
            "recipient": {
                "_id": "69962211056bdb7627e028fd",
                "name": "Mohamed Shalaby",
                "photo": "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/1772275521673-bf38ec27-121e-44e3-bd2a-3d8141c533f0-1000138799.webp"
            },
            "actor": {
                "_id": "699a0ab8056bdb7627079736",
                "name": "Muhammed Khaled",
                "photo": "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/1772161295274-df3aa5a0-f2f2-4fdb-93b2-6e6751752ed2-IMG_2634.webp"
            },
            "type": "like_post",
            "entityType": "post",
            "entityId": "69a17d58056bdb76274febfe",
            "isRead": true,
            "createdAt": "2026-02-27T11:45:26.864Z",
            "readAt": "2026-02-28T19:06:03.230Z",
            "entity": {
                "_id": "69a17d58056bdb76274febfe",
                "body": "👋 Hi",
                "user": "69962211056bdb7627e028fd",
                "commentsCount": 1,
                "topComment": {
                    "_id": "69a17ee7056bdb76274ff4c7",
                    "content": "test",
                    "commentCreator": {
                        "_id": "698cf4d93bf9737117644b32",
                        "name": "ahmed",
                        "photo": "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
                    },
                    "post": "69a17d58056bdb76274febfe",
                    "parentComment": null,
                    "likes": [],
                    "createdAt": "2026-02-27T11:24:23.369Z"
                },
                "sharesCount": 0,
                "likesCount": 0,
                "isShare": false,
                "id": "69a17d58056bdb76274febfe"
            }
        }
    }
}

*/

export const markAllNotificationAsReadService = async (token) => {
  const response = axios.patch(
    `${BaseURL}/notifications/read-all`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};

/* 
mark all notifications as read service response example:

{
    "success": true,
    "message": "success",
    "data": {
        "modifiedCount": 10
    }
}

*/
