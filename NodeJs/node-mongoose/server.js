var mongoose = require('mongoose'),
    assert = require('assert');

var Dishes = require('./models/dishes');
var Promotions = require('./models/promotions');
var Leaders = require('./models/leadership')

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");

    // create a new dish
    Dishes.create({
        name: 'Uthapizza',
        description: 'Test',
        image: 'images/uthapizza.png',
        category: 'mains',
        price: '$4.99',      
        comments: [
            {
                rating: 3,
                comment: 'This is insane',
                author: 'Matt Daemon'
            }
        ]
    }, function (err, dish) {
        if (err) throw err;
        console.log('Dish created!');
        console.log(dish);

        var id = dish._id;

        // get all the dishes
        setTimeout(function () {
            Dishes.findByIdAndUpdate(id, {
                    $set: {
                        description: 'Updated Test'
                    }
                }, {
                    new: true
                })
                .exec(function (err, dish) {
                    if (err) throw err;
                    console.log('Updated Dish!');
                    console.log(dish);

                    dish.comments.push({
                        rating: 5,
                        comment: 'I\'m getting a sinking feeling!',
                        author: 'Leonardo di Carpaccio'
                    });

                    dish.save(function (err, dish) {
                        console.log('Updated Comments!');
                        console.log(dish);
                    });
                });
        }, 3000);
    });
  
    Promotions.create({
        name: 'Promo 1',
        description: 'Promo 1 description',
        image: 'images/promo1.png',
        price: '$1,999.99'
    }, function (err, promo) {
        if (err) throw err;
        console.log('Promo created!');
        console.log(promo);

        var id = promo._id;

        setTimeout(function () {
            Promotions.findByIdAndUpdate(id, {
                $set: {
                    description: 'Updated promo'
                }
            }, {
                new: true
            })
                .exec(function (err, promo) {
                    if (err) throw err;
                    console.log('Updated Promo!');
                    console.log(promo);
                });
        }, 3000);
    });
  
    Leaders.create({
        name: 'Leader 1',
        description: 'Leader 1 description',
        image: 'images/leader1.png',
        designation: 'Leader 1 Designation',
        abbr: 'Abbreviature'
    }, function (err, leader) {
        if (err) throw err;
        console.log('Leader created!');
        console.log(leader);

        var id = leader._id;

        setTimeout(function () {
            Leaders.findByIdAndUpdate(id, {
                $set: {
                    description: 'Updated leader'
                }
            }, {
                new: true
            })
                .exec(function (err, leader) {
                    if (err) throw err;
                    console.log('Updated Leader!');
                    console.log(leader);
                });
        }, 3000);
    });

    setTimeout(function(){
        db.collection('dishes').drop(function () {
            db.collection('promotions').drop(function () {
                db.collection('leaders').drop(function () {
                    db.close();
                });
            });
        });
    }, 12000);
});