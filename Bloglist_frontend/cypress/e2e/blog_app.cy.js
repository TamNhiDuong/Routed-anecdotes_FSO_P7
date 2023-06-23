// npm run cypress:open
describe('Blog app e2e test', () => {
  beforeEach(function() {
    // Reset DB states
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    // Create a new user
    const user = {
      name: 'Tester',
      username: 'testusername',
      password: 'testpassword'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.visit('http://localhost:3000')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testusername')
      cy.get('#password').type('testpassword')
      cy.get('#login-button').click()
      cy.contains('Tester logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testusername')
      cy.get('#password').type('testpass')
      cy.get('#login-button').click()
      cy.contains('Wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      // log in user here
      cy.get('#username').type('testusername')
      cy.get('#password').type('testpassword')
      cy.get('#login-button').click()
      cy.contains('Tester logged in')

      // create a blog
      cy.createBlog({
        title: 'First blog',
        author: 'First blog author',
        url: 'First blog url'
      })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#blog-title').type('Test blog')
      cy.get('#blog-author').type('Test blog author')
      cy.get('#blog-url').type('Test blog url')
      cy.contains('save').click()
      cy.contains('Test blog')
    })

    it('User can like a blog', function() {
      cy.contains('First blog').parent().find('button').click()
      cy.contains('like').click()
      cy.contains('Likes: 1')
    })

    it('Creator of a blog can delete it', function() {
      // create a blog
      cy.contains('new blog').click()
      cy.get('#blog-title').type('Test Blog 2')
      cy.get('#blog-author').type('Test author 2')
      cy.get('#blog-url').type('Test blog url 2')
      cy.contains('save').click()
      // view blog
      cy.contains('Test Blog 2').parent().find('button').click()
      // delete blog
      cy.contains('delete').click()
      cy.contains('Test Blog 2').should('not.exist')
    })

    it('Only creator of a blog can see delete button, not everyone', function() {
      // creator of the blog can see delete button
      cy.contains('First blog').parent().find('button').click()
      cy.contains('delete')

      // logout, create a new acc, login, not see delete button of "First blog"
      cy.contains('logout').click()

      const user = {
        name: 'Tester2',
        username: 'testusername2',
        password: 'testpassword2'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)

      cy.get('#username').type('testusername2')
      cy.get('#password').type('testpassword2')
      cy.get('#login-button').click()

      cy.contains('First blog').parent().find('button').click()
      cy.contains('delete').should('not.exist')
    })

    it('Test blogs are ordered according to likes with the blog with the most likes being first', function() {
      // create blogs
      cy.createBlog({
        title: 'Blogs with 1 like',
        author: 'Tester',
        url: 'test url'
      })

      cy.createBlog({
        title: 'Blogs with 2 likes',
        author: 'Tester',
        url: 'test url'
      })

      // like blogs
      cy.contains('Blogs with 1 like').parent().find('button').click()
      cy.get('.lbtn').click()
      cy.contains('Likes: 1')

      cy.contains('Blogs with 2 likes').parent().find('button').click()
      cy.contains('Blogs with 2 likes').get('.lbtn').click({ multiple: true })
      cy.contains('Likes: 1')
      cy.contains('Blogs with 2 likes').get('.lbtn').click({ multiple: true })
      cy.contains('Likes: 2')

      // open
      cy.contains('First blog').parent().find('button').click()

      cy.get('.blogDetails').eq(0).should('contain', 'Blogs with 2 likes')
      cy.get('.blogDetails').eq(1).should('contain', 'Blogs with 1 like')
      cy.get('.blogDetails').eq(2).should('contain', 'First blog')
    })
  })

})