import { queryOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import axios from 'redaxios'

export type PostType = {
  id: string
  title: string
  body: string
}

export const fetchPosts = createServerFn({ method: 'GET' }).handler(
  async () => {
    console.info('Fetching posts...')
    return axios
      .get<Array<PostType>>('https://jsonplaceholder.typicode.com/posts')
      .then((r) => r.data.slice(0, 10))
  },
)

export const postsQueryOptions = () =>
  queryOptions({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(),
  })

// Server function: paginated posts
export const fetchPostsPage = createServerFn({ method: 'GET' })
  .inputValidator((data: { page: number; limit: number }) => data)
  .handler(async ({ data }) => {
    const { page, limit } = data
    console.info(`Fetching posts page=${page} limit=${limit}...`)
    const res = await axios.get<Array<PostType>>(
      `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`,
    )
    return res.data
  })

export const postsPageQueryOptions = (page: number, limit: number) =>
  queryOptions({
    queryKey: ['posts', 'page', { page, limit }],
    queryFn: () => fetchPostsPage({ data: { page, limit } }),
  })

export const fetchPost = createServerFn({ method: 'GET' })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    console.info(`Fetching post with id ${data}...`)
    const post = await axios
      .get<PostType>(`https://jsonplaceholder.typicode.com/posts/${data}`)
      .then((r) => r.data)
      .catch((err) => {
        console.error(err)
        if (err.status === 404) {
          throw notFound()
        }
        throw err
      })

    return post
  })

export const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ['post', postId],
    queryFn: () => fetchPost({ data: postId }),
  })

// Dependent query: posts by user
export const fetchPostsByUser = createServerFn({ method: 'GET' })
  .inputValidator((userId: string) => userId)
  .handler(async ({ data }) => {
    console.info(`Fetching posts by user ${data}...`)
    const res = await axios.get<Array<PostType>>(
      `https://jsonplaceholder.typicode.com/posts?userId=${data}`,
    )
    return res.data
  })

export const postsByUserQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['posts', 'byUser', userId],
    queryFn: () => fetchPostsByUser({ data: userId }),
  })
