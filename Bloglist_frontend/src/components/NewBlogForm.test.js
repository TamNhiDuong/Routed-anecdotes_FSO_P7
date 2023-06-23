// Run test: CI=true npm test
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'

import NewBlogForm from './NewBlogForm'

test('<NewBlogForm /> calls the event handler it received as props with the right details when a new blog is created', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<NewBlogForm addBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')

  const submitButton = screen.getByText('save')

  await user.type(titleInput, 'Test Title')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'Test URL')
  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0].title).toBe('Test Title')
  expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
  expect(createBlog.mock.calls[0][0].url).toBe('Test URL')
})