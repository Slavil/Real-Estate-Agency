const router = require('express').Router();

const homeController = require('./controllers/homeController');
const authController = require('./controllers/authController');
const housingController = require('./controllers/housingController');

router.use(homeController)
router.use('/auth', authController)// когато има посочено име отпред, заявката няма да влезе тук освен ако не започва с името
router.use('/housing', housingController);
router.use('*', (req, res)=>{
    res.render('404');
})


module.exports = router;
