const router = require('express').Router()
const {isAuth} = require('../middlewares/authMiddleware')
const housingService = require('../services/housingService');


router.get('/', async (req, res)=>{
    // тук продължава създаването на картичката
    let housings = await housingService.getAll()
    res.render('housing', {housings})
});

router.get('/create', isAuth, (req, res)=>{
    res.render('housing/create')
});

router.post('/create', isAuth, async (req, res)=>{
    try{
        await housingService.create({...req.body, owner: req.user._id});

        res.redirect('/housing');
    }catch(error){
        res.render('housing/create', {error: getErrorMessage(error)})
    }
   
});
// ERROR HANDLER in CREATE, must do the rest
function getErrorMessage(error){
    let errorNames = Object.keys(error.errors);
    if(errorNames.length>0){
        return error.errors[errorNames[0]]
    }else{
        return error.message
    }
}

router.get("/:housingId/details", async (req, res)=>{
    let housing = await housingService.getOne(req.params.housingId)

    let housingData = await housing.toObject();

    let isOwner = housingData.owner == req.user?._id

    let tenants = housing.getTenants();

    let isAvailable = housing.availablePieces>0;
    
    let isRented = housing.tenants.some(x => x._id == req.user?._id)
    
    res.render('housing/details', {...housingData, isOwner, tenants, isAvailable, isRented})
    
})
async function isOwner(req, res, next){
    let housing = await housingService.getOne(req.params.housingId);
    if(housing.owner == req.user._id){
        res.redirect(`/housing/${req.params.housingId}/details`)
    }else{
        next()
    }
}
async function isntOwner(req, res, next){
    let housing = await housingService.getOne(req.params.housingId);
    if(housing.owner != req.user._id){
        next()
    }else{
        res.redirect(`/housing/${req.params.housingId}/details`)
    }
}

router.get('/:housingId/rent', async (req, res)=>{
    await housingService.addTenant(req.params.housingId, req.user._id)
    res.redirect(`/housing/${req.params.housingId}/details`)
})

router.get('/:housingId/delete', isntOwner, async(req, res)=>{

    await housingService.delete(req.params.housingId);
    res.redirect('/housing')
})

router.get('/:housingId/edit', isntOwner, async (req, res)=>{
    let housing = await housingService.getOne(req.params.housingId)
    res.render('housing/edit', {...housing.toObject()});
})

router.post('/:housingId/edit', isntOwner, async (req, res)=>{
    await housingService.updateOne(req.params.housingId, req.body);
    res.redirect(`/housing/${req.params.housingId}/details`)
})
module.exports = router;