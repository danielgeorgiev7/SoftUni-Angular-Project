export interface DatabasePost {
  data: DatabasePostData;
  likes: { string: true }[];
}

export interface DatabasePostData {
  createdAt: string;
  updatedAt: string;
  userId: string;
  username: string;
  userPhoto: string;
  attachedPhoto: string;
  postId: string;
  title: string;
  content: string;
}
