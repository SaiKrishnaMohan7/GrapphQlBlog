const Post = {
  author(parent, args, { db: { users } }, info) {
      return users.find((user) => {
          return user.id === parent.authorId
      })
  }
};

export { Post as default };
