import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spinner } from "@heroui/react";
import { AuthContext } from "../AuthContext/AuthContextProvider";
import PostCard from "../PostCard/PostCard";
import { postDetailsService } from "../../services/postServices";

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
  const [post, setPost] = useState(null);
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
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <PostCard post={post} isDetailsView={true} />{" "}
          <Button color="primary" onClick={() => navigate("/")}>
            Back to Feed
          </Button>
        </>
      )}
    </>
  );
}
