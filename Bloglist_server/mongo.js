// usage: node mongo.js yourpassword title author url likes
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
console.log('password: ', password)

const url =
  `mongodb+srv://fullstackopen:${password}@cluster0fullstackopen.lxizek2.mongodb.net/blogList?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url).then(res => console.log('DB connection res: ', res))

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
    title: 'Added from mongo.js',
    author: 'tester',
    url: 'http://localhost:3003/api/blogs',
    likes: 0
})

blog.save().then(result => {
  console.log('blog saved!')
  mongoose.connection.close()
})
