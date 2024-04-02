const { response } = require('express');
const PostModel = require('../models/post')
const EventModel = require('../models/event')
const BookingModel = require('../models/booking')
const CustomerModel = require('../models/customer')
const axios = require('axios');
const nodemailer = require('nodemailer');

class APIClientsController
{

     // [GET] /api/posts
    allpost(req,res)
    {
        PostModel.find({})
            .then(posts => {
                const postsArr = posts.map(post => 
                {
                    var postObj = post.toObject()
                    postObj.thumb = `https://app.chillvietnam.com/uploads/${post.thumb}`
                    return postObj
                })
            
                res.json(postsArr)
            })
            .catch(err => {
                console.log(err)
                res.send(err.message)
            })
    }

     // [GET] /api/events
    events(req,res)
    {
        EventModel.find({})
            .then(response => {

                response.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateA - dateB;
                });
              

                const eventArr = response.map( item => 
                {
                    var eventObj = item.toObject()
                    eventObj.thumb = `https://app.chillvietnam.com/uploads/${eventObj.thumb}`
                    return eventObj
                })
            
                res.json(eventArr)
            })
            .catch(err => {
                console.log(err)
                res.send(err.message)
            })
     }

    // [GET] /api/featuredposts
    featuredposts(req,res)
    {
        PostModel.find({isFeatured: false})
            .then(posts => {
                const postsArr = posts.map(post => 
                {
                    var postObj = post.toObject()
                    postObj.thumb = `https://app.chillvietnam.com/uploads/${post.thumb}`
                    return postObj
                })
               
                res.json(postsArr)
            })
            .catch(err => {
                console.log(err)
                res.send(err.message)
            })
    }
    // [GET] /api/recommendedposts
    recommendedpost(req,res)
    {
        PostModel.find({isFeatured: true})
            .then(posts => {
                const postsArr = posts.map(post => 
                {
                    var postObj = post.toObject()
                    postObj.thumb = `https://app.chillvietnam.com/uploads/${post.thumb}`
                    return postObj
                })
                res.json(postsArr)
            })
            .catch(err => {
                console.log(err)
                res.send(err.message)
            })
    }

     // [GET] /api/eventdetail/:id
     eventdetail(req,res)
     {
        var idDetail = req.params.id;
        EventModel.findById(idDetail)
            .then(event => {
                console.log(event)
                var eventObj = event.toObject();
                eventObj.thumb = `https://app.chillvietnam.com/uploads/${event.thumb}`
                res.json(eventObj)
            })
            .catch(err => {
                console.log(err)
                res.send(err.message)
            })
     }
    // [GET] /api/postdetail/:id
    postdetail(req,res)
    {
        var idDetail = req.params.id;
        PostModel.findById(idDetail)
        .then(post => {
            var postObj = post.toObject();
            postObj.thumb = `https://app.chillvietnam.com/uploads/${post.thumb}`;
            res.json(postObj)
        })
        .catch(err => {
            console.log(err)
            res.send(err.message)
        })
    }
    // [GET] /api/customer/:id
    getcustomer = (req,res) =>
    {
        const customer_id = req.params.id;

        CustomerModel.findById(customer_id)
            .then((customer)=>{
                if(customer)
                {
                    res.json({status: "OK"})
                }
                else
                {
                    res.json({status: "ER"})
                }
            })
            .catch(err => {
            res.send(500).json({message: "Cannot query database"})
            })
    }
    // [POST] /api/customer
    savecustomer(req,res)
    {
        const newCustomer = new CustomerModel(req.body)
        newCustomer.save()
        .then(()=>{
            res.setHeader('Content-Type', 'application/json');
            res.json({
                status: "OK",
            })
        })
        .catch(err => {
            res.setHeader('Content-Type', 'application/json');
            res.json({
                status: "ER",
                message: err
            })
        })
    }
    // [GET] /api/booking
    booking = (req,res) =>
    {
        const body = req.body
        var bookingData = {}
        //book from event
        if(body.event)
        {
            PostModel.findById(body.brand)
            .then(response=>{
                const bar = response.toObject();
                bookingData = {name: body.name, phone: body.phone, date: body.date, members: body.members ,brand: bar.title,event:body.event}
                return new BookingModel(bookingData).save()
            })
            .then(()=>{
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    status: "OK",
                    message: "Booking thành công, CHILL VietNam sẽ liên hệ lại với quý khách!"
                })
            })
            .catch(err => {

                res.setHeader('Content-Type', 'application/json');
                res.json({
                    status: "ER",
                    message: err.message
                })
            })
        }
        else
        {
            const newBooking = new BookingModel(body)
            newBooking.save()
            .then(()=>{
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    status: "OK",
                    message: "Booking thành công, CHILL VietNam sẽ liên hệ lại với quý khách!"
                })
            })
            .catch(err => {

                res.setHeader('Content-Type', 'application/json');
                res.json({
                    status: "ER",
                    message: err.message
                })
            })
        }

       

    
        //Gửi email 
        let bookingInfo = ""
        if(!body.event)
        {
            bookingInfo = `${req.body.name} <br> ${req.body.phone} <br> ${req.body.members} người <br> ${req.body.date} <br> ${req.body.brand} <br>`
        }
        else
        {
            bookingInfo = `${req.body.name} <br> ${req.body.phone} <br> ${req.body.members} người <br> ${req.body.date} <br> Sự kiện: ${bookingData.brand}  <br> ${req.body.brand}`
        }
        this.sendEmail(bookingInfo)
            .then(response => {
                console.log(response)
            })
            .catch(err => {
                console.log(err)
            })
    }

    // [GET] /api/sendtoken/:token
    sendtoken = (req,res) =>
    {
        const userToken = req.query.usertoken;
        const accessToken = req.query.accesstoken;

        if(userToken == "" || accessToken == "")
        {
            console.log("Không đủ thông tin")
            res.send(403)
        }

        //Decode token to phone
        this.sendtokentozalo(userToken,accessToken)
        .then(response => {
            if(response.data.data)
            {
                res.json({
                    status: "OK",
                    phone: `+${response.data.data.number}`
                })
            }
            else
            {
                res.json({
                    status: "ER",
                    message: response.data.message
                })
            }
        })
        .catch(err => {
            res.send(500)
        })
    }

    sendtokentozalo(token, accessToken)
    {
        const endpoint = "https://graph.zalo.me/v2.0/me/info";
        const secrect_key = "2SpgXBy5c9SXJcm0g42q";

        axios.defaults.headers.common['access_token'] = accessToken;
        axios.defaults.headers.common['code'] = token;
        axios.defaults.headers.common['secret_key'] = secrect_key;

        return (axios(endpoint,{})
        .then(response => {
            return response
        })
        .catch(error => {
            throw error
        }))
    }


    sendEmail(content)
    {
        const smtpEndpoint = 'email-smtp.ap-southeast-1.amazonaws.com'; 
        const port = '2587'; // smtp port 
        const smtpUsername = 'AKIAVYPUTYT5GQ56DH7B'; // smtp username
        const smtpPassword = 'BMP1v645a69wo7UGl3SPgU5B2H75pS+fwX+IAanFpQ92'; // smtp password 

        // khởi tạo một transporter để gởi mail
        const transporter = nodemailer.createTransport({
            host: smtpEndpoint,
            port: port,
            auth: {
                user: smtpUsername,
                pass: smtpPassword
            }
        });
         // mail option, có nhiều option khác như cc, bcc, ...
        let mailOptions = {
            from: 'no-reply@vndc.vn',
            to: 'hxlinh1683@gmail.com',
            // to: 'phuongdong271299@gmail.com',
            subject: "Booking CHILL Vietnam",
            html: content,
        };

        return (
            transporter.sendMail(mailOptions)
            .then(data => {
                return data
            })
            .catch(err => {
               throw err
            })
        )

    }
    zalowebhook(req,res)
    {
        res.send(200)
    }

    /*
        API OUTDATE
    */

    // [GET] /api/recommendedpost/:id
    recommendpostdetail(req,res)
    {
        var idDetail = req.params.id;
        PostModel.findById(idDetail)
        .then(post => {
            var postObj = post.toObject()
            postObj.thumb = `https://app.chillvietnam.com/uploads/${post.thumb}`
            res.json(postObj)
        })
        .catch(err => {
            console.log(err)
            res.send(500)
        })
    }
    // [GET] /api/featuredpost/:id
    featuredpostdetail(req,res)
    {
        var idDetail = req.params.id;
        PostModel.findById(idDetail)
        .then(post => {
            var postObj = post.toObject()
            postObj.thumb = `https://app.chillvietnam.com/uploads/${post.thumb}`
            res.json(postObj)
        })
        .catch(err => {
            console.log(err)
            res.send(500)
        })
    }


}
module.exports = new APIClientsController