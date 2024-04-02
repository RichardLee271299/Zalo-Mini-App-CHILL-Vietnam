const homeRouter = require('./home');
const posts = require('./posts');
const getimage = require('./getimage');
const apiRouter = require('./apiClient');
const bookingRouter = require('./booking');
const loginRouter = require('./login');
const eventRouter = require('./event');
function router(app) {
    app.use('/events',eventRouter)
    app.use('/api', apiRouter)
    app.use('/login', loginRouter)
    app.use('/getimage',getimage)
    app.use('/posts', posts);
    app.use('/', bookingRouter);
}

module.exports = router;
