import { store } from "../redux/store"

import { putBet, replaceBet, setErrorMessage } from "../redux/betslip/betslip.actions";

export const addBet = (bet, betType, bets) => {
        // console.log(bet);
        // const foundBetIndex = bets.findIndex(b => (b.gameId == bet.gameId && b.categoryId == bet.categoryId));
        // if(foundBetIndex < 0){
        //     if(bets.length < 11){
        //         store.dispatch(putBet(bet));
        //     } else{
        //         store.dispatch(setErrorMessage("betslip__parlaySelectionErr"))
        //     }
        // } else{
        //     store.dispatch(replaceBet(foundBetIndex, bet));
        // }
        if(bet.odds > 1.01 && bet.odds < 99){
            if(betType == 'single'){
                if(bets.length < 10){
                    store.dispatch(putBet(bet));
                } else{
                    store.dispatch(setErrorMessage("betslip__singleSelectionErr"));
                }
                
            } else if(betType == 'multi'){
                const foundBetIndex = bets.findIndex(b => (b.gameId == bet.gameId && b.categoryId == bet.categoryId));
                if(foundBetIndex < 0){
                    if(bets.length < 8){
                        store.dispatch(putBet(bet));
                    } else{
                        store.dispatch(setErrorMessage("betslip__parlaySelectionErr"))
                    }
                } else{
                    store.dispatch(replaceBet(foundBetIndex, bet));
                }  
            } else if(betType == 'system'){
                const foundBetIndex = bets.findIndex(b => (b.gameId == bet.gameId && b.categoryId == bet.categoryId));
                if(foundBetIndex < 0){
                    store.dispatch(setErrorMessage("betslip__systemSelectionErr"))
                } else{
                    store.dispatch(replaceBet(foundBetIndex, bet));
                }
            }
        }
        
}