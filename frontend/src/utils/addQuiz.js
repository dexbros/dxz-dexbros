import { store } from "../redux/store"

//import { putBet, replaceBet, setErrorMessage } from "../redux/betslip/betslip.actions";
import { putQuiz, replaceQuiz, setErrorMessage } from "../redux/contestSlip/contestslip.actions";

export const addQuiz = (bet, bets) => {
        console.log(bet);
        const foundBetIndex = bets.findIndex(b => (b.gameId == bet.gameId && b.categoryId == bet.categoryId && b.contestId == bet.contestId));
        if(foundBetIndex < 0){
            var quizCount = 0;

            bets.forEach(b => {
                if(b.contestId == bet.contestId){
                    quizCount++;
                }
            });

            if(quizCount < 11){
                store.dispatch(putQuiz(bet));
            } else{
                store.dispatch(setErrorMessage("contestSlip__overcounterror"))
            }
        } else{
            store.dispatch(replaceQuiz(foundBetIndex, bet));
        }
        
}