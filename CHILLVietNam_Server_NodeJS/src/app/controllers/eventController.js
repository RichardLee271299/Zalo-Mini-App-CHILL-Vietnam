const event = require('../models/event');
const EventModel = require('../models/event');
const PostModel = require('../models/post')
class eventController
{
    //[GET] /events
    show(req,res)
    {
        EventModel.find({})
        .then(data => {
            const eventObj = data.map(event => event.toObject())
            res.render('event', {events: eventObj})
        })
        .catch(err=>{
            res.send(err.message)
        })
    }

    //[GET] /events/add
    add(req,res)
    {
        PostModel.find({})
        .then(response => {
            const barObj = response.map(item => {
                const itemToObj = item.toObject()
               return {id: itemToObj._id,name: itemToObj.title}
            })
            res.render('addevent',{bars : barObj})
        })
        .catch(err => {
            res.send(err.message)
        })
    }

    // [POST] /events/store
    store(req,res)
    {
        const file = req.file;
        const newEvent = new EventModel({title: req.body.title, content: req.body.content, price: req.body.price ,thumb: file.filename,address: req.body.address, barID: req.body.barID, time: req.body.hours, date: req.body.date});
        newEvent.save()
        .then((response) => {
            res.redirect('/events')
        })
        .catch(err =>{
            console.log(err)
        })
    }

     // [GET] /events/:id/edit
    edit(req,res)
    {

        Promise.all([EventModel.findById(req.params.id), PostModel.find({})])
         .then(([eventData,postData]) => {

            //Đối tượng event khi tìm thấy chuyển sang obj
            const eventObj = eventData.toObject()

            //Danh sách bar chuyển sang object
            const barsObj = postData.map(item => item.toObject())
            //Tên quán bar đã chọn trước đó
            const selectedBar = barsObj.find(item => item._id.toString() === eventObj.barID)

            res.render('editevent', {
                event: eventObj,
                bars: barsObj,
                selectedBar: selectedBar.title
            })
         })
         .catch(err => {
             res.send(err.message)
         })
    }
     // [PUT] /events/:id
    update(req,res)
    {
        const dataUpdate = {title: req.body.title, content: req.body.content, price: req.body.price ,address: req.body.address, barID: req.body.barID, time: req.body.hours, date: req.body.date}
        EventModel.updateOne({_id: req.params.id}, dataUpdate)
        .then(() => {
            res.redirect('/events')
        })
        .catch(e =>{
            console.log(e)
        })
    }
    //[DELETE] /posts/:id/remove
    remove(req,res)
    {
        EventModel.findOneAndRemove({_id: req.params.id})
        .then(()=>{
            res.redirect('/events')
        })
        .catch(e => {
            res.send(e.message)
        })
    }
    
}


module.exports = new eventController