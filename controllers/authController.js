const router = require('express').Router();
const {isGuest, isAuth} = require('../middlewares/authMiddleware')
const authService = require('../services/authServices')

const {AUTH_COOKIE_NAME}=require('../constants')

router.get('/login', isGuest, (req, res)=>{
    res.render('auth/login')
});

router.post('/login', isGuest, async (req, res)=>{
    const {username, password} = req.body;

    try{
        let token = await authService.login({username, password})
        res.cookie(AUTH_COOKIE_NAME, token)
        res.redirect('/');
        
    }
    catch(err){
        // to do: return proper notification
        res.end();
    }
})

router.get('/register', isGuest, (req, res)=>{
    res.render('auth/register')
}); 


router.post('/register', isGuest, async (req, res)=>{
    const{name, username, password, rePassword} = req.body
// валидатор на паролата
    if(password !== rePassword){
        res.locals.error = 'Password mismatch';     // каква грешка да изведе при несъвпадащи пароли при регистрация
        return res.render('auth/register')
    }
    try{
        await authService.register({name, username, password})

        // Login

        let token = await authService.login({
            username, 
            password
        })
        
        res.cookie(AUTH_COOKIE_NAME, token)

        res.redirect('/')

    }catch(err){

    }
});

// logout action

router.get('/logout', isAuth, (req, res)=>{
    res.clearCookie(AUTH_COOKIE_NAME);
    res.redirect('/')
})

module.exports = router;