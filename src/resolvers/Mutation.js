import casual from 'casual'; // switch to uuid when this becpmes somethign

const Mutation = {
  createUser(parent, { newUser }, { db: { users } }, info) {
    const emailTaken = users.some(user => user.email === newUser.email);
    const nameTaken = users.some(user => user.name === newUser.name);

    if (nameTaken || emailTaken) {
      throw new Error ('Email or user name already taken');
    }
    const user = { id: casual.uuid, ...newUser };
    users.push(user);

    return user;
  },
  createPost(parent, { newPost }, { db: { users, posts }, pubsub }, info) {
    const userExists = users.some((user) => user.id === newPost.authorId)

    if (!userExists) {
        throw new Error('User not found')
    }

    const post = {
        id: casual.uuid,
        ...newPost
    };

    posts.push(post);

    if (newPost.published) {
      pubsub.publish('post', { post });
    }

    return post;
},
createComment(parent, { newComment }, { db: { users, posts, comments }, pubsub }, info){
    const userExists = users.some((user) => user.id === newComment.authorId)
    const postExists = posts.some((post) => post.id === newComment.postId && post.published)

    if (!userExists || !postExists) {
        throw new Error('Unable to find user and post')
    }

    const comment = {
        id: casual.uuid,
        ...newComment,
    };

    comments.push(comment);

    pubsub.publish(`comment-post-${newComment.postId}`, { comment });

    return comment;
},

updateUser(parent, { id, updateOptions }, { db: { users } }, info) {
  const user = users.find((user) => user.id === id)

  if (!user) {
      throw new Error('User not found')
  }

  if (typeof updateOptions.email === 'string') {
      const emailTaken = users.some((user) => user.email === updateOptions.email)

      if (emailTaken) {
          throw new Error('Email taken')
      }

      user.email = updateOptions.email
  }

  if (typeof updateOptions.name === 'string') {
      user.name = updateOptions.name
  }

  if (typeof updateOptions.age !== 'undefined') {
      user.age = updateOptions.age
  }

  return user
},

updatePost(parent, { id, updateOptions }, { db: { posts } }, info) {
  const post = posts.find((post) => post.id === id);

  if (!post) {
      throw new Error('Post not found')
  }

  if (typeof updateOptions.title === 'string') {
      post.title = updateOptions.title
  }

  if (typeof updateOptions.body === 'string') {
      post.body = updateOptions.body
  }

  if (typeof updateOptions.published === 'boolean') {
      post.published = updateOptions.published
  }

  return post;
},

updateComment(parent, { id, updateOptions }, { db: { comments } }, info) {
  const comment = comments.find((comment) => comment.id === id);

  if (!comment) {
      throw new Error('Comment not found')
  }

  if (typeof updateOptions.text === 'string') {
      comment.text = updateOptions.text
  }

  return comment;
},

deleteUser(parent, { id }, { db: { users, posts, comments } }, info) {
  const userIndex = users.findIndex((user) => user.id === id)

  if (userIndex === -1) {
      throw new Error('User not found')
  }

  // Delete user
  const deletedUsers = users.splice(userIndex, 1)

  // Delete all posts by the user
  posts = posts.filter((post) => {
      const match = post.author === id

      if (match) {
          comments = comments.filter((comment) => comment.post !== post.id)
      }

      return !match
  })
  // Delete all comments by user
  comments = comments.filter((comment) => comment.author !== id)

  return deletedUsers[0]
},

deletePost(parent, { id }, { db: { posts, comments } }, info) {
  const postIndex = posts.findIndex(post => post.id === ID);

  if (postIndex === -1) {
    throw new Error('Post not found');
  }

  // Delete Post
  const deletedPost = posts.splice(postIndex, 1);
  // Delete associated comments
  comments = comments.filter(comment => comment.post !== id);

  return deletedPost[0];
},

deleteComment(parent, { id }, { db: { comments } }, info) {
  const commentIndex = comments.findIndex(post => post.id === ID);

  if (commentIndex === -1) {
    throw new Error('Comment not found');
  }

  // Delete Post
  const deletedComment = comments.splice(commentIndex, 1);

  return deletedComment[0];
},
};

export { Mutation as default };