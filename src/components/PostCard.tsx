"use client";

import {
  createComment,
  deletePost,
  getPosts,
  toggleLike,
} from "@/actions/post.action";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import DeleteAlertDialog from "./DeleteAlertDialog";
import Image from "next/image";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  HeartIcon,
  LogInIcon,
  MessageSquareIcon,
  SendIcon,
} from "lucide-react";
import { Textarea } from "./ui/textarea";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

const PostCard = ({
  post,
  dbUserId,
}: {
  post: Post;
  dbUserId: string | null;
}) => {
  const { user } = useUser();
  const [isCommenting, setisCommenting] = useState(false);
  const [newComment, setnewComment] = useState("");
  const [isLiking, setisLiking] = useState(false);
  const [isDeleting, setisDeleting] = useState(false);
  const [hasLiked, sethasLiked] = useState(
    post.likes.some((like) => like.userId === dbUserId)
  );
  const [optimisticLikes, setoptimisticLikes] = useState(post._count.likes);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setisLiking(true);
      sethasLiked((prev) => !prev);
      setoptimisticLikes((prev) => prev + (hasLiked ? -1 : 1));
      await toggleLike(post.id);
    } catch (error) {
      setoptimisticLikes(post._count.likes);
      sethasLiked(post.likes.some((like) => like.userId === dbUserId));
    } finally {
      setisLiking(false);
    }
  };

  const handleAddcomment = async () => {
    if (!newComment.trim() || isCommenting) return;

    try {
      setisCommenting(true);
      const result = await createComment(post.id, newComment);
      if (result?.success) {
        toast.success("Comment posted Successfully");
        setnewComment("");
      }
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setisCommenting(false);
    }
  };

  const handleDeletePost = async () => {
    if (isDeleting) return;
    try {
      setisDeleting(true);
      const result = await deletePost(post.id);
      if (result?.success) {
        toast.success("Post deleted Successfully");
      } else {
        throw new Error(result?.error);
      }
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setisDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex gap-3 sm:gap-4">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="size-8 sm:size-10">
                <AvatarImage
                  src={post.author.image ?? "/avatar.png"}
                  alt={post.author.username ?? "avatar"}
                />
              </Avatar>
            </Link>
            {/* post content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                  <Link
                    href={`/profile/${post.author.username}`}
                    className="hover:underline"
                  >
                    {post.author.name}
                  </Link>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link
                      href={`/profile/${post.author.username}`}
                      className="hover:underline"
                    >
                      @{post.author.username}
                    </Link>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
                {dbUserId === post.author.id && (
                  <DeleteAlertDialog
                    isDeleting={isDeleting}
                    onDelete={handleDeletePost}
                  />
                )}
              </div>
              <p className="mt-2 text-sm text-foreground break-words">
                {post.content}
              </p>
            </div>
          </div>
          {/* Image */}
          {post.image && (
            <div className="rounded-lg overflow-hidden">
              <Image
                src={post.image}
                alt="post content"
                className="w-full h-auto object-conver"
              />
            </div>
          )}
          {/* like and comment */}
          <div className="flex items-center pt-2 space-x-4">
            {user ? (
              <Button
                variant={"ghost"}
                size={"sm"}
                className={`text-muted-foreground gap-2 ${
                  hasLiked
                    ? "text-red-500 hover:text-red-600"
                    : "hover:text-red-500"
                }`}
                onClick={handleLike}
              >
                {hasLiked ? (
                  <HeartIcon className="size-5 fill-current" />
                ) : (
                  <HeartIcon className="size-5" />
                )}
                <span>{optimisticLikes}</span>
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="text-muted-foreground gap-2"
                >
                  <HeartIcon className="size-5" />
                  <span>{optimisticLikes}</span>
                </Button>
              </SignInButton>
            )}
            <Button
              variant={"ghost"}
              size={"sm"}
              className="text-muted-foreground gap-2 hover:text-blue-500"
              onClick={() => setShowComments((prev) => !prev)}
            >
              <MessageSquareIcon
                className={`size-5 ${
                  showComments && "fill-blue-500 text-blue-500"
                }`}
              />
              <span>{post._count.comments}</span>
            </Button>
          </div>
          {/* comments section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-4 pt-4 border-t"
              >
                <div className="space-y-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="size-8 flex-shrink-0">
                        <AvatarImage
                          src={comment.author.image ?? "/avatar.png"}
                        />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-medium text-sm">
                            {comment.author.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            @{comment.author.username}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            •
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="text-sm break-words">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {user ? (
                  <div className="flex space-x-3">
                    <Avatar className="size-8 flex-shrink-0">
                      <AvatarImage
                        src={user?.imageUrl ?? "/avatar.png"}
                        alt={user?.username ?? "Avatar"}
                      />
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setnewComment(e.target.value)}
                        className="min-h-[80px] resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          size={"sm"}
                          onClick={handleAddcomment}
                          className="flex items-center gap-2"
                          disabled={!newComment.trim() || isCommenting}
                        >
                          {isCommenting ? (
                            "Posting..."
                          ) : (
                            <>
                              <SendIcon className="size-4" />
                              Comment
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center p-4 border rounded-lg bg-background">
                    <SignInButton mode="modal">
                      <Button variant={"outline"} className="gap-2">
                        <LogInIcon className="size-4" />
                        Sign in to comment
                      </Button>
                    </SignInButton>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
