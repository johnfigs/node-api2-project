// implement your posts router here
const express = require('express')
const Posts = require('./posts-model')
const router = express.Router()

// [GET] /api/posts - get all posts
router.get('/', (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "The posts information could not be retrieved"
            })
        })
})

// [GET] /api/posts/:id - get post by id
router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if(post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "The post information could not be retrieved"
            })
        })
})

router.post('/', (req, res) => {
    const { title, contents } = req.body
    if ( !title || !contents ) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        Posts.insert(req.body)
            .then(newPostId => {
                const { id } = newPostId
                Posts.findById(id)
                    .then(post => {
                        res.status(201).json(post)
                    })
                    .catch(error => {
                        console.log(error)
                    })
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({
                    message: "There was an error while saving the post to the database"
                })
            })
    }
})

// [PUT] /api/posts/:id updates a post

router.put('/:id', async (req, res) => {
    const { title, contents } = req.body
    const possiblePost = await Posts.findById(req.params.id)
    if( !possiblePost ) {
        res.status(404).json({ message: "The post with the specified ID does not exist" })
    } else {
        if ( !title || !contents ) {
            res.status(400).json({ message: "Please provide title and contents for the post" })
        } else{
        Posts.update(req.params.id, req.body)
            .then(updatedPost => {
                console.log(updatedPost)
                Posts.findById(req.params.id)
                    .then(post => {
                        res.status(200).json(post)
                    })
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ message: "The post information could not be modified" })
            })
        }
    }
})

module.exports = router