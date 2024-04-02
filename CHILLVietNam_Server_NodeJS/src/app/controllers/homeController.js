
class HomeController
{
    show(req,res)
    {
       res.render('home')
    }
}

module.exports = new HomeController