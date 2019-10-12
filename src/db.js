const users = [{
  id: '1',
  name: 'Andrew',
  email: 'andrew@example.com',
  age: 27
}, {
  id: '2',
  name: 'Sarah',
  email: 'sarah@example.com'
}, {
  id: '3',
  name: 'Mike',
  email: 'mike@example.com'
}]

const posts = [{
  id: '10',
  title: 'GraphQL 101',
  body: 'This is how to use GraphQL...',
  published: true,
  authorId: '1'
}, {
  id: '11',
  title: 'GraphQL 201',
  body: 'This is an advanced GraphQL post...',
  published: false,
  authorId: '1'
}, {
  id: '12',
  title: 'Programming Music',
  body: '',
  published: true,
  authorId: '2'
}]

const comments = [{
  id: '102',
  text: 'This worked well for me. Thanks!',
  authorId: '3',
  postId: '10'
}, {
  id: '103',
  text: 'Glad you enjoyed it.',
  authorId: '1',
  postId: '10'
}, {
  id: '104',
  text: 'This did no work.',
  authorId: '2',
  postId: '11'
}, {
  id: '105',
  text: 'Nevermind. I got it to work.',
  authorId: '1',
  postId: '12'
}];

const db = {
  users,
  posts,
  comments
}

export { db as default };
