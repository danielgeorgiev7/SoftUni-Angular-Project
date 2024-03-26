export interface DatabaseComment {
  data: DatabaseCommentData;
  likes: { string: true }[];
}

export interface DatabaseCommentData {
  createdAt: string;
  updatedAt: string;
  userId: string;
  username: string;
  userPhoto: string;
  attachedPhoto: string;
  postId: string;
  commentId: string;
  comment: string;
}
