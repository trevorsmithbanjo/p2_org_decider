const path = require("path");
var db = require("../models");
var passport = require("../config/passport");
const isAuthenticated = require('../config/middleware/isAuthenticated');


module.exports = (app) => {
    // Homepage Route
    app.get('/', (req, res) => {
        if (req.user) {
            res.redirect('/dashboard');
        }
        res.render('index');
    });

    app.get('/index', (req, res) => {
        if (req.user) {
            res.redirect('/dashboard');
        }
        res.render('index');
    });

    // Sign Up Route
    app.get('/login', (req, res) => {
        if (req.user) {
            res.redirect('/dashboard');
        }
        res.render("login");
    });

    // ==========================================
    // ==========================================
    //  MAIN DASHBAORD PAGE
    // ==========================================
    // ==========================================

    app.get("/dashboard", isAuthenticated, (req, res) => {
        console.log('//// HTML ROUTE ////');
        // Generic Title / name for main page -- Non Dynamic
        let name = "Welcome to Yay or Nay"
        let allCategories = [];
        let allLinks = [];
        let allIDs = []

        // grabbing both the category and ID from the table

        db.Category.findAll({
            attributes: [
                'category',
                'id'
            ],
            where: {
                'OrgId': req.user.OrgId
            }
        }).then((dbCategory) => {
            // Empty array variables wills store individual data for name, url, and ids
            // let allCategories = [];
            // let allLinks = [];
            // let allIDs = []
            console.log('===== EMPTY ARRAY =====')
            if (dbCategory.length > 0) {
                // for loop iterates through dbCategory and pushes individual items to empty arrays
                for (let i = 0; i < dbCategory.length; i++) {
                    allIDs.push(dbCategory[i].dataValues.id)
                    allLinks.push('/' + dbCategory[i].dataValues.category)
                    allCategories.push(dbCategory[i].dataValues.category);
                }
            }
            else {
                console.log('No Categories Found')
            }
            console.log(allCategories)
            console.log(allLinks)
            console.log(allIDs)
            // on render, we pass a page title, categories, links, and ID Numbers

            res.render("dash-home", { title: `${name}`, categories: allCategories, links: allLinks, idNum: allIDs });
        })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    })


    // ==========================================
    // ==========================================
    //  CATEGORY PAGE
    // ==========================================
    // ==========================================


    app.get("/dashboard/:category", isAuthenticated, (req, res) => {
        let name = req.params.category;
        let id = null;
        let allCategories = [];
        let allLinks = [];
        let allIDs = []
        let allIdeaNames = []
        let allIdeaDesc = []
        let allIdeaIds = []

        // Arrays to hold idea cards that are false
        let activeFalse = []
        let ideaNameFalse = []
        let ideaDescFalse = []
        let ideaIdFalse = []

        // arrays to hold idea cards that are true
        let activeTrue = []
        let ideaNameTrue = []
        let ideaDescTrue = []
        let ideaIdTrue = []

        // First DB Query
        db.Category.findAll({
            where: {
                'OrgId': req.user.OrgId
            },
            attributes: [
                'category',
                'id'
            ],
            include: [
                {
                    model: db.Idea,
                }
            ],

        }).then((dbCategory) => {
            // for loop iterates through dbCategory and pushes individual items to empty arrays
            if (dbCategory.length > 0) {
                // category = dbCategory;
                for (let i = 0; i < dbCategory.length; i++) {
                    allIDs.push(dbCategory[i].dataValues.id)
                    allLinks.push('/' + dbCategory[i].dataValues.category)
                    allCategories.push(dbCategory[i].dataValues.category);
                    allIdeaNames.push(dbCategory[i].dataValues.name);
                    if (dbCategory[i].dataValues.category === name) {
                        id = dbCategory[i].dataValues.id;
                        // console.log('id to store as data attribute:', id);
                    }
                }
            }
            else {
                console.log('No Categories Found')
            }
        }).then(() => {
            // Second DB Query
            db.Idea.findAll({
                attributes: [
                    'name',
                    'description',
                    'id',
                    'votes',
                    'categoryId',
                    'userId',
                    'winner',
                    'active'
                ],
                where: {
                    'CategoryId': id,
                }

            }).then((dbSuggestions) => {
                if (dbSuggestions.length > 0) {
                    console.log(dbSuggestions)
                    // For some reaosn I have to redeclare this empty array otherwise undefined gets added to the beginning
                    // allIdeaNames = [];
                    // ideaNameFalse = [];
                    // ideaNameTrue = [];
                    for (let i = 0; i < dbSuggestions.length; i++) {
                        if (dbSuggestions[i].dataValues.active === false) {
                            console.log('======== FALSE ======')
                            ideaNameFalse.push(dbSuggestions[i].dataValues.name)
                            ideaDescFalse.push(dbSuggestions[i].dataValues.description)
                            ideaIdFalse.push(dbSuggestions[i].dataValues.id)
                        } else {
                            console.log('======== TRUE ======')
                            ideaNameTrue.push(dbSuggestions[i].dataValues.name)
                            ideaDescTrue.push(dbSuggestions[i].dataValues.description)
                            ideaIdTrue.push(dbSuggestions[i].dataValues.id)
                        }

                        console.log('True', ideaNameFalse)
                        console.log('False', ideaNameTrue)

                        // allIdeaNames.push(dbSuggestions[i].dataValues.name)
                        // console.log('//////// NAMES ///////')
                        // console.log(dbSuggestions[i].dataValues.name)
                        // allIdeaDesc.push(dbSuggestions[i].dataValues.description)
                        // allIdeaIds.push(dbSuggestions[i].dataValues.id)
                    }
                }
                else {
                    // Redeclaring this empty array here as well, just to ensure it stays empty when there are no items in the table
                    allIdeaNames = [];
                    console.log('No Ideas Found')
                }
            })
        }).then(() => {
            // Using a timeout because the queries were not running fast enough
            setTimeout(() => {

                console.log('==============================')
                console.log('1st DB Query: ', allCategories)

                console.log('2nd DB Query False', ideaNameFalse)
                console.log('2nd DB Query True', ideaNameTrue)
                console.log('==============================')

                res.render("category", {
                    title: ` ${name}: Yay or Nay?`,
                    categories: allCategories,
                    links: allLinks,
                    idNum: allIDs,
                    id: id,
                    ideaNameFalse: ideaNameFalse,
                    ideaTextFalse: ideaDescFalse,
                    ideaIdsFalse: ideaIdFalse,
                    ideaNameTrue: ideaNameTrue,
                    ideaTextTrue: ideaDescTrue,
                    ideaIdsTrue: ideaIdTrue,
                });
            }, 500);
        })


        // .catch((err) => {
        //     console.log(err);
        //     res.status(500).json(err);
        // });

    });









}


