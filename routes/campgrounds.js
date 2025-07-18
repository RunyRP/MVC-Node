const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {campgroundSchema} = require('../schemas.js');
const {isLoggedIn} = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const CampGround = require('../models/campground');

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
};

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await CampGround.find({})
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/',isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new CampGround(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id).populate('reviews');
    if(!campground) {
        req.flash('error', 'Cannot find that campground!'); 
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
})); 

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    if(!campground) {
        req.flash('error', 'Cannot find that campground!'); 
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}));

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}));

module.exports = router;