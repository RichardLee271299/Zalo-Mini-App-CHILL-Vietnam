const AccountModel = require('../models/account');
class loginController
{
    show(req,res)
    {
        req.session.destroy()
        res.render('login', {layout: 'login-layout.hbs'})
    }
    login(req,res)
    {
        const {username, password} = req.body
        AccountModel.findOne({username: username})
            .then((acc)=>{
                //Không tìm thấy tài khoản hoặc sai mật khẩu

                if(acc != null)
                {
                    if(acc.toObject().password !== password)
                    {
                        res.json({status: "ER",message: "Tên đăng nhập hoặc mật khẩu không đúng!"})
                    }
                    else
                    {
                        req.session.loggedIn = true;
                        res.json({status: "OK",message: "Đăng nhập thành công!"})
                    }
                }
                else
                {
                    res.json({status: "ER",message: "Tên đăng nhập hoặc mật khẩu không đúng!"})
                }

            })
            .catch(err =>{
                res.send(500).message(err)
            })

    }
}
module.exports = new loginController