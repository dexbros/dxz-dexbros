/** @format */

const express = require("express");
const router = express.Router();

router.get("/:id", async (req, res, next) => {
  try {
    var contests;
    var perPage = 20;
    var itemsStart = (req.query.page - 1) * perPage;
    var itemsCount = req.query.page * perPage;

    //console.log(req.query.sortBy);
    //console.log(req.query.type);
    if (req.query.tab == "active") {
      contests = await Contest.find({
        gameId: req.params.id.toString(),
        status: "active",
      })
        .sort({ [req.query.sortBy]: req.query.type })
        .skip(itemsStart)
        .limit(itemsCount);
    } else {
      contests = await Contest.find({
        gameId: req.params.id.toString(),
        status: { $ne: "active" },
      })
        .sort({ [req.query.sortBy]: req.query.type })
        .skip(itemsStart)
        .limit(itemsCount);
    }

    //var risk = await RiskManagement.find();
    res.status(200).json({ data: contests });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

router.get("/single/:id", async (req, res, next) => {
  try {
    var contest = await Contest.findById(req.params.id);
    //var risk = await RiskManagement.find();
    res.status(200).json({ data: contest });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

router.post("/edit-contest/:id", async (req, res, next) => {
  const {
    contestName,
    contestDesc,
    contestPrize,
    contestMemberCount,
    winnerSelection,
    contestEntryFee,
  } = req.body;

  try {
    var contest = await Contest.findByIdAndUpdate(
      req.params.id,
      {
        contestName: contestName,
        contestDesc: contestDesc,
        contestPrizePool: contestPrize,
        contestSize: contestMemberCount,
        entryFee: contestEntryFee,
        winnerSelection: winnerSelection,
      },
      { new: true }
    );
    //var risk = await RiskManagement.find();
    res.status(200).json({ data: contest });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

router.get("/:id/:code", async (req, res, next) => {
  try {
    if (req.query.tab == "active") {
      var contests = await Contest.find({
        gameId: req.params.id.toString(),
        contestCode: { $regex: req.params.code },
        status: "active",
      }).limit(req.query.page * 10);
    } else {
      var contests = await Contest.find({
        gameId: req.params.id.toString(),
        contestCode: { $regex: req.params.code },
        status: { $ne: "active" },
      }).limit(req.query.page * 10);
    }

    //var risk = await RiskManagement.find();
    res.status(200).json({ data: contests });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

// router.put("/cashout", async (req,res,next) => {
//     const { bet, cashoutPercentage, currentOdds, cashOutAmount } = req.body;
//     var bets = [bet];
//     var game = await (await fetch(`${process.env.EVENT_API_URL}${bets[0].gameId}`)).json();
//     var isOptionMarket = (game.results[0].optionMarkets && game.results[0].optionMarkets.length > 0) ? true : false;
//     var category = isOptionMarket ? game.results[0].optionMarkets.find(option => option.id == bets[0].categoryId) : game.results[0].Markets.find(option => option.id == bets[0].categoryId);
//     if(!category){
//         return res.status(400).json({errorMessage:"betslip__oddsMatchErr"}).end();
//     } else {
//         var option = isOptionMarket ? category.options.find(option => option.id == bets[0].optionId) : category.results.find(option => option.id == bets[0].optionId);
//         if(!option){
//             return res.status(400).json({errorMessage:"betslip__oddsMatchErr"}).end();
//         } else {
//             var foundOdds = isOptionMarket ? option.price.odds : option.odds;
//             if(parseFloat(foundOdds) != parseFloat(currentOdds)){
//                 console.log(foundOdds)
//                 console.log(currentOdds)
//                 console.log("single")
//                 return res.status(400).json({errorMessage:"betslip__oddsMatchErr"}).end();
//             }
//         }
//     }

//     //CONTINUE
//     // var recentBet = await BetDetails.findById(bet._id);
//     //console.log(recentBet);
//     //recentBet.status == 'awa'
//     var foundbet = await BetDetails.findByIdAndUpdate(bet._id, { status: 'cashout', odds:currentOdds.toString() }, {new:true}).where('status').equals('awaiting');
//     if(foundbet){
//         var foundBetSlip = await Betslip.findOneAndUpdate({commonId:foundbet.commonId}, { status: 'cashout' }, {new:true});
//         var newUser = await User.findByIdAndUpdate(req.user._id, { [foundbet.debitType]:(req.user[foundbet.debitType] + parseFloat(cashOutAmount)) }, {new:true})

//         var betHistory = new BetHistory({
//             optionName: foundbet.optionName,
//             category:foundbet.category,
//             categoryId:foundbet.categoryId,
//             gameId: foundbet.gameId,
//             optionId:foundbet.optionId,
//             odds:foundbet.odds,
//             teams:foundbet.teams,
//             commonId:foundbet.commonId,
//             betType:foundbet.betType,
//             totalStake:foundbet.totalStake,
//             totalReturn:parseFloat(cashOutAmount).toFixed(2),
//             netReturn:parseFloat(cashOutAmount - bet.totalStake).toFixed(2),
//             debitType:foundbet.debitType,
//             status:foundbet.status,
//             user:req.user._id
//         })

//         betHistory.save();

//         const token = jwt.sign({data:newUser._doc}, 'secret')
//         res.status(200).json({body:req.body, user:{...newUser._doc}, token});
//     } else {
//         return res.status(400).json({errorMessage:"betslip__oddsMatchErr"}).end();
//     }

// });

module.exports = router;
