import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spinner } from "@heroui/react";
import { AuthContext } from "../AuthContext/AuthContextProvider";
import PostCard from "../PostCard/PostCard";
import CommentsList from "../CommentsList/CommentsList";
import { postDetailsService } from "../../services/postServices";
import { getCommentsService } from "../../services/commentsServices";

export default function PostDetails() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  //   Post Details example data
  const postDetails = {
    success: true,
    message: "success",
    data: {
      post: {
        _id: "69976a28056bdb7627ee3345",
        body: "Sharing this great post @mentor_user",
        privacy: "public",
        user: {
          _id: "699720f2056bdb7627e98c06",
          name: "nourhan muhammed",
          username: "nourhanmuhammed",
          photo:
            "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/1771537615672-69d20b74-e3db-408d-93c3-93fb2373102b-0b33229652784be0dfcaac91b8f8487b.webp",
        },
        sharedPost: {
          _id: "6997682b056bdb7627ee199b",
          image:
            "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/1771530282773-b8096d4a-ba3e-4fad-ae0b-d8aac5f30e2f-2.webp",
          privacy: "public",
          user: {
            _id: "699720f2056bdb7627e98c06",
            name: "nourhan muhammed",
            username: "nourhanmuhammed",
            photo:
              "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/1771537615672-69d20b74-e3db-408d-93c3-93fb2373102b-0b33229652784be0dfcaac91b8f8487b.webp",
          },
          sharedPost: null,
          likes: ["699720f2056bdb7627e98c06", "69965fc4056bdb7627e37cbd"],
          createdAt: "2026-02-19T19:44:43.497Z",
          commentsCount: 0,
          topComment: null,
          sharesCount: 1,
          likesCount: 2,
          isShare: false,
          id: "6997682b056bdb7627ee199b",
        },
        likes: ["69965fc4056bdb7627e37cbd"],
        createdAt: "2026-02-19T19:53:12.837Z",
        commentsCount: 0,
        topComment: null,
        sharesCount: 0,
        likesCount: 1,
        isShare: true,
        id: "69976a28056bdb7627ee3345",
        bookmarked: false,
      },
    },
  };
  const postComments = {
    success: true,
    message: "success",
    data: {
      comments: [
        {
          _id: "699aefe6056bdb76270e2fef",
          content: "asdasd",
          commentCreator: {
            _id: "6994b602056bdb7627d2176f",
            name: "Hamada",
            username: "hamada4",
            photo:
              "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png",
          },
          post: "699ae9fb056bdb76270e1c49",
          parentComment: null,
          likes: [],
          createdAt: "2026-02-22T12:00:38.261Z",
          repliesCount: 0,
        },
        {
          _id: "699aea45056bdb76270e1d42",
          content: "Maadi new comment 2",
          commentCreator: {
            _id: "6994b602056bdb7627d2176f",
            name: "Hamada",
            username: "hamada4",
            photo:
              "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png",
          },
          post: "699ae9fb056bdb76270e1c49",
          parentComment: null,
          likes: [],
          createdAt: "2026-02-22T11:36:37.826Z",
          repliesCount: 0,
        },
        {
          _id: "699aea11056bdb76270e1cba",
          content: "Maadi new comment 1",
          commentCreator: {
            _id: "6994b602056bdb7627d2176f",
            name: "Hamada",
            username: "hamada4",
            photo:
              "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png",
          },
          post: "699ae9fb056bdb76270e1c49",
          parentComment: null,
          likes: [],
          createdAt: "2026-02-22T11:35:45.209Z",
          repliesCount: 0,
        },
      ],
    },
    meta: {
      pagination: {
        currentPage: 1,
        limit: 20,
        total: 3,
        numberOfPages: 1,
      },
    },
  };
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    const getPostDetails = async () => {
      try {
        setIsLoading(true);
        const response = await postDetailsService(token, id);
        setPost(response.data.data.post);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getPostDetails();
  }, [token, id]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;
      try {
        setIsLoadingComments(true);
        const response = await getCommentsService(token, id);
        setComments(response.data.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoadingComments(false);
      }
    };
    fetchComments();
  }, [token, id]);
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
          <PostCard post={post} isDetailsView={true} />

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Comments ({comments.length})
            </h3>
            {isLoadingComments ? (
              <div className="flex justify-center py-8">
                <Spinner size="md" />
              </div>
            ) : (
              <CommentsList comments={comments} />
            )}
          </div>

          <Button
            color="primary"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            ← Back to Feed
          </Button>
        </div>
      )}
    </>
  );
}
