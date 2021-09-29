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
        .catch( () => {
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
        .catch( () => {
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
            })
            .catch( () => {
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
            .catch( () => {
                res.status(500).json({ message: "The post information could not be modified" })
            })
        }
    }
})

// [DELETE] /api/posts/:id deletes a post

router.delete('/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(possiblePost => {
            if ( !possiblePost ) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                Posts.remove(req.params.id)
                    .then( () => {
                    res.status(200).json(possiblePost)
                })
            }
        })
        .catch( () => {
            res.status(500).json({ message: "The post could not be removed"})
        })
})

// [GET] /api/posts/:id/comments get comments 

router.get('/:id/comments' , (req, res) => {
    Posts.findById(req.params.id)
        .then(possiblePost => {
            if ( !possiblePost ) {
                res.status(404).json({ message: "The post with the specified ID does not exist"})
            } else {
                Posts.findPostComments(req.params.id)
                    .then(comments => {
                        res.status(200).json(comments)
                    })
            }
        })
        .catch( () => {
            res.status(500).json({ message: "The comments information could not be retrieved" })
        })
})

module.exports = router