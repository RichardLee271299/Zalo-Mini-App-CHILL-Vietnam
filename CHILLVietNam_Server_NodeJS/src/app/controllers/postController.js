const path = require('path');
const multer = require('multer');
const PostModel = require('../models/post')
class PostController
{


    // [GET] /posts
    show(req,res)
    {
        PostModel.find({})
        .then(posts => {
            const postsObj = posts.map(post => post.toObject())
            res.render('posts', {posts: postsObj})
        })
        .catch(err => {
            console.log(err)
            res.send(500)
        })
    }

    // [GET] /posts/add
    add(req,res)
    {
        res.render('addpost')
    }

    
    // [POST] /posts/store
    store(req,res)
    {
        const file = req.file;
        const chkFeatured = req.body.chkfeatured ? true : false;
        const newPost = new PostModel({title: req.body.title, content: req.body.content, price: req.body.price ,thumb: file.filename,address: req.body.address, isFeatured: chkFeatured});
        newPost.save()
        .then(() => {
            res.redirect('/posts')
        })
        .catch(e =>{
            console.log(e)
        })
    }

     // [GET] /posts/:id/edit
    edit(req,res)
    {
        PostModel.findById(req.params.id)
        .then(post => {
            res.render('editpost', {post: post.toObject()})
        })
        .catch(err => {
            console.log(err)
            res.send(500)
        })
    }

    // [PUT] /posts/:id
    update(req,res)
    {
        const chkFeatured = req.body.chkfeatured ? true : false;
        const dataUpdate = {title: req.body.title, content: req.body.content, price: req.body.price ,address: req.body.address,isFeatured: chkFeatured }
        PostModel.updateOne({_id: req.params.id}, dataUpdate)
        .then(() => {
            res.redirect('/posts')
        })
        .catch(e =>{
            console.log(e)
        })

    }

    //[DELETE] /posts/:id/remove
    remove(req,res)
    {
        PostModel.findOneAndRemove({_id: req.params.id})
        .then(()=>{
            res.redirect('/posts')
        })
        .catch(e => {
            res.send(500)
        })
    }


}


module.exports = new PostController
