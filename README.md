# 🗄️ SocialMedia_API

Social Media API is a backend based on ExpressJS let you put users, posts and comments for your social media website

-   [🔐 Authentication](#🔐-authentication)
-   [📗 Usage](#📗-usage)
    -   [Users](#users)
        -   [POST an user](#post-an-user)
        -   [GET all users](#get-all-users)
        -   [GET a single user by id](#get-a-single-user-by-id)
        -   [PUT a single user by id](#put-a-single-user-by-id)
        -   [DELETE a single user by id](#delete-a-single-user-by-id)
    -   [Posts](#posts)
        -   [POST a post](#post-a-post)
        -   [GET all posts](#get-all-posts)
        -   [GET a single post by id](#get-a-single-post-by-id)
        -   [PUT a single post by id](#put-a-single-post-by-id)
        -   [DELETE a single post by id](#delete-a-single-post-by-id)
    -   [Comments](#comments)
        -   [POST a comment](#post-a-comment)
        -   [GET all comments by given id of a post](#get-all-comments-by-given-id-of-a-post)
        -   [GET a single comment by id](#get-a-single-comment-by-id)
        -   [PUT a single comment by id](#put-a-single-comment-by-id)
        -   [DELETE a single comment by id](#delete-a-single-comment-by-id)
-   [🌱 Contributing Guide](#🌱-contributing-guide)

Accepted request types (HTTP verbs) are: GET, POST, PUT, DELETE.

I have given examples using the [axios](https://www.npmjs.com/package/axios) package to process the data in the API.

```console
~$ npm i axios
```

# 🔐 Authentication

Except for POST user requsts, all other requests require authentication. So the request header `(x-auth-token)` must include the token. Token can be obtained by login.

NOTE: 'PUT' and 'DELETE' requests can only be made by their owner.

## Login

```js
const axios = require("axios");

let token;

async function login() {
    const result = await axios.post("http://localhost:3000/api/login/", {
        email: "email3@email.com",
        password: "12345678",
    });

    token = result.data.token;

    console.log(result.data);
}

login();
```

Result

```js
{
    msg: 'Login successful',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDE5ODk0YTRkMTQzZjUzNzBjZDlkZjEiLCJpYXQiOjE2Nzk0MDA5MTF9.QfXEe-e24c0thaquvuoCmhgXjcyLJRhew9SiacSC2gA'
  }

```

# 📗 Usage

## Users

### POST an user

```js
const axios = require("axios");

async function postUser() {
    const result = await axios.post("http://localhost:3000/api/users/", {
        fName: "name",
        lName: "name",
        email: "email3@email.com",
        password: "12345678",
    });

    console.log(result.data);
}

postUser();
```

Result

```json
{
    "fName": "name",
    "lName": "name",
    "email": "email3@email.com",
    "password": "protected",
    "_id": "641994c8656181961d5afcf6",
    "datetime": "2023-03-21T11:28:08.969Z",
    "__v": 0
}
```

### GET all users

```js
const axios = require("axios");

async function getAllUsers() {
    const result = await axios.get("http://localhost:3000/api/users/", {
        headers: {
            "x-auth-token": token,
        },
    });
    console.log(result.data);
}

getAllUsers();
```

Result

```js
[
    {
        _id: "6419894a4d143f5370cd9df1",
        fName: "name",
        lName: "name",
        email: "email@email.com",
        datetime: "2023-03-21T10:39:06.699Z",
    },
    {
        _id: "6419894a4d143f5370cd9dfa",
        fName: "name",
        lName: "name",
        email: "email2@email.com",
        datetime: "2023-03-21T10:39:06.792Z",
    },
    {
        _id: "641994c8656181961d5afcf6",
        fName: "name",
        lName: "name",
        email: "email3@email.com",
        datetime: "2023-03-21T11:28:08.969Z",
    },
];
```

### GET a single user by id

```js
const axios = require("axios");

async function getSingleUser() {
    const result = await axios.get(
        "http://localhost:3000/api/users/641994c8656181961d5afcf6",
        {
            headers: {
                "x-auth-token": token,
            },
        }
    );
    console.log(result.data);
}

getSingleUser();
```

Result

```js
{
  _id: '641994c8656181961d5afcf6',
  fName: 'Lorem',
  lName: 'Ipsum',
  email: 'emaill@email.com',
  datetime: '2023-03-21T11:28:08.969Z'
}
```

### PUT a single user by id

```js
const axios = require("axios");

async function putSingleUser() {
    const result = await axios.put(
        "http://localhost:3000/api/users/6419894a4d143f5370cd9df1",
        { fName: "Lorem 1" },
        {
            headers: {
                "x-auth-token": token,
            },
        }
    );
    console.log(result.data);
}

putSingleUser();
```

Result

```js
{
    msg: "User updated";
}
```

### DELETE a single user by id

```js
const axios = require("axios");

async function deleteSingleUser() {
    const result = await axios.delete(
        "http://localhost:3000/api/users/6419894a4d143f5370cd9df1",
        {
            headers: {
                "x-auth-token": token,
            },
        }
    );
    console.log(result.data);
}

deleteSingleUser();
```

Result

```js
{
    msg: "User deleted";
}
```

## Posts

### POST a post

```js
const axios = require("axios");

async function postPost() {
    const result = await axios.post("http://localhost:3000/api/posts/", {
        title: "title",
        body: "body",
    });

    console.log(result.data);
}

postPost();
```

Result

```js
{
  userId: '6419894a4d143f5370cd9df1',
  title: 'title',
  body: 'body',
  _id: '64199b1b656181961d5afd10',
  datetime: '2023-03-21T11:55:07.987Z',
  __v: 0
}
```

### GET all posts

```js
const axios = require("axios");

async function getAllPosts() {
    const result = await axios.get("http://localhost:3000/api/posts/", {
        headers: {
            "x-auth-token": token,
        },
    });
    console.log(result.data);
}

getAllPosts();
```

Result

```js
[
    {
        userId: "6419894a4d143f5370cd9df1",
        title: "title",
        body: "body",
        _id: "64199b1b656181961d5afd10",
        datetime: "2023-03-21T11:55:07.987Z",
        __v: 0,
    },
];
```

### GET a single post by id

```js
const axios = require("axios");

async function getSinglePost() {
    const result = await axios.get(
        "http://localhost:3000/api/posts/64199b1b656181961d5afd10",
        {
            headers: {
                "x-auth-token": token,
            },
        }
    );
    console.log(result.data);
}

getSinglePost();
```

Result

```js
{
    userId: "6419894a4d143f5370cd9df1",
    title: "title",
    body: "body",
    _id: "64199b1b656181961d5afd10",
    datetime: "2023-03-21T11:55:07.987Z",
    __v: 0,
}
```

### PUT a single post by id

```js
const axios = require("axios");

async function putSinglePost() {
    const result = await axios.put(
        "http://localhost:3000/api/posts/64199b1b656181961d5afd10",
        { title: "new title" },
        {
            headers: {
                "x-auth-token": token,
            },
        }
    );
    console.log(result.data);
}

putSinglePost();
```

Result

```js
{
    msg: "Post updated";
}
```

### DELETE a single post by id

```js
const axios = require("axios");

async function deleteSinglePost() {
    const result = await axios.delete(
        "http://localhost:3000/api/posts/64199b1b656181961d5afd10",
        {
            headers: {
                "x-auth-token": token,
            },
        }
    );
    console.log(result.data);
}

deleteSinglePost();
```

Result

```js
{
    msg: "Post deleted";
}
```

## Comments

### POST a comment

```js
const axios = require("axios");

async function postComment() {
    const result = await axios.post(
        "http://localhost:3000/api/posts/64199b1b656181961d5afd10/comments/",
        {
            body: "body",
        },
        {
            headers: {
                "x-auth-token": token,
            },
        }
    );

    console.log(result.data);
}

postComment();
```

Result

```js
{
  postId: '64199b1b656181961d5afd10',
  userId: '6419894a4d143f5370cd9df1',
  body: 'body',
  _id: '64199d85656181961d5afd2e',
  datetime: '2023-03-21T12:05:25.270Z',
  __v: 0
}
```

### GET all comments by given id of a post

```js
const axios = require("axios");

async function getAllComments() {
    const result = await axios.get(
        "http://localhost:3000/api/posts/64199b1b656181961d5afd10/comments",
        {
            headers: {
                "x-auth-token": token,
            },
        }
    );
    console.log(result.data);
}

getAllComments();
```

Result

```js
[
    {
        postId: "64199b1b656181961d5afd10",
        userId: "6419894a4d143f5370cd9df1",
        body: "body",
        _id: "64199d85656181961d5afd2e",
        datetime: "2023-03-21T12:05:25.270Z",
        __v: 0,
    },
];
```

### GET a single comment by id

```js
const axios = require("axios");

async function getSingleComment() {
    const result = await axios.get(
        "http://localhost:3000/api/posts/64199b1b656181961d5afd10/comments/64199d85656181961d5afd2e",
        {
            headers: {
                "x-auth-token": token,
            },
        }
    );
    console.log(result.data);
}

getSingleComment();
```

Result

```js
{
    postId: "64199b1b656181961d5afd10",
    userId: "6419894a4d143f5370cd9df1",
    body: "body",
    _id: "64199d85656181961d5afd2e",
    datetime: "2023-03-21T12:05:25.270Z",
    __v: 0,
}
```

### PUT a single comment by id

```js
const axios = require("axios");

async function putSingleComment() {
    const result = await axios.put(
        "http://localhost:3000/api/posts/64199b1b656181961d5afd10/comments/64199d85656181961d5afd2e",
        { body: "new body" },
        {
            headers: {
                "x-auth-token": token,
            },
        }
    );
    console.log(result.data);
}

putSingleComment();
```

Result

```js
{
    msg: "Comment updated";
}
```

### DELETE a single comment by id

```js
const axios = require("axios");

async function deleteSingleComment() {
    const result = await axios.delete(
        "http://localhost:3000/api/posts/64199b1b656181961d5afd10/comments/64199d85656181961d5afd2e",
        {
            headers: {
                "x-auth-token": token,
            },
        }
    );
    console.log(result.data);
}

deleteSingleComment();
```

Result

```js
{
    msg: "Comment deleted";
}
```

# 🌱 Contributing Guide

-   Fork the project from the `main` branch and submit a Pull Request (PR)

    -   Explain what the PR fixes or improves.

    -   If your PR aims to add a new feature, provide test functions as well.

-   Use sensible commit messages

    -   If your PR fixes a separate issue number, include it in the commit message.

-   Use a sensible number of commit messages as well

    -   e.g. Your PR should not have 1000s of commits.
