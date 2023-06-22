import * as oddslib from 'oddslib';

export const oddTypeChange = (odds, type) => {
    if(type == 'fractional'){
        return oddslib.from('decimal', odds).to(type);
        
    } else if(type == 'moneyline') {
        return parseInt(oddslib.from('decimal', odds).to(type))
        

    } else {
        return oddslib.from('decimal', odds).to(type).toFixed(3);
    }
}