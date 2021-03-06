var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
var Web3 = require('web3');
var contract = require('truffle-contract');
var lottoContract = require('./../build/contracts/LottoFactory.json');

var port = process.env.PORT || 4000;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

var lotto;
// setup contract
var Lotto = contract(lottoContract);
Lotto.setProvider(web3.currentProvider);
// initialize contract
Lotto.deployed().then(function (instance) {
    lotto = instance;
    app.listen(port, function () {
        console.log('Example app listening on port ' + port)
    });
}, function(err){
    console.log(err);
});

app.get('/create/:address/:number', function (req, res) {
    lotto.createLotto(req.params.number, {
        from: req.params.address,
        value: web3.toWei(0.01 , 'ether')
    }).then(function(result){
        console.log(result);
        res.send(result);
    }, function(err){
        console.log(err);
        res.send(err);
    });
});

// app.get("/account/:address",function(req,res){
//     lotto.balanceOf(req.params.address)
//     .then(function(result){
//         console.log(result);
//         res.send(result);
//     }, function(err){
//         console.log(err);
//         res.send(err);
//     })
// });

app.get("/lotto/:number",function(req,res){
    lotto.ownerOf(req.params.number)
    .then(function(result){
        console.log(result);
        res.send(result);
    }, function(err){
        console.log(err);
        res.send(err);
    })
});

app.get("/lucky/:number",function(req,res){
    lotto.setLuckyNumber(req.params.number, {
        from: web3.eth.accounts[0]
    })
    .then(function(result){
        console.log(result);
        res.send(result);
    }, function(err){
        console.log(err);
        res.send(err);
    })
});
