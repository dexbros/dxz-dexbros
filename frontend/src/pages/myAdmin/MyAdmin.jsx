import * as React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setOddType } from "../../redux/oddType/oddType.actions";
import { setPageType } from '../../redux/page/page.actions';
import getCountdown from "../../utils/getCountDown";

import MainLayout from '../../layouts/main-layout.component';
import Collapse from '../../components/collapse/collapse.component';
//import BetSlip from "../../components/betslip/BetSlip";

import { useSocket } from "../../socket/socket";

//{`/admin-quiz/${eventId}/${eventDate}`}

const AdminContestView = ({contestCount, eventName, eventId, eventLeague, eventDate }) => {

    const navigate = useNavigate();


    const handleClick = (e) => {
        if(e.target.id == "edit-btn"){
            navigate(`/settle-quiz/${eventId}`)
        } else{
            navigate(`/admin-quiz/${eventId}/${eventDate}`);
        }
    }

    return <div className="adminContestView__container" onClick={handleClick}>
        <i className="fa fa-pen-to-square" id="edit-btn" />
        <div className="adminContestView__column">
            <div className="adminContestView__item">
                {eventName} ({contestCount})
            </div>
            <div className="adminContestView__item">
                {eventId} 
            </div>
        </div>
        <div className="adminContestView__column">
            <div className="adminContestView__item">
                {eventLeague}
            </div>
            <div className="adminContestView__item">
                {eventDate}
            </div>
        </div>
    </div>
}



function MyAdmin({ user, token, pregames, cricketgames, oddType, setOddType, setPageType, quizes }) {
    const [totalContests, setTotalContests] = React.useState(null);
    const [fData, setFData] = React.useState(null);
    
    
    useSocket();

    React.useLayoutEffect(() => {
        setPageType('quiz');
    },[]);

    React.useEffect(() => {
        var url = `http://localhost:5000/api/quiz/get-pre-events`;
        //var url = `http://localhost:5000/api/quiz/active-contest`;
        // Example POST method implementation:
        async function putData(url = '') {
            // Default options are marked with *
            const response = await fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc. // include, *same-origin, omit
            headers: {
            'Authorization': 'Bearer ' + token
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            mode: 'cors'
        });
        return response.json(); // parses JSON response into native JavaScript objects
        }
        
        putData(url)
        .then(data => {
            console.log(data);


            // var totalQuizes = [];

            // data.data.forEach(contestslip => {
            //     var foundIndex = totalQuizes.findIndex(t => t._id == contestslip.conId._id);
            //     if(foundIndex < 0){
            //         totalQuizes.push(contestslip.conId);
            //     }
            // })

            setTotalContests(data.data);	
        }).catch(err => console.log(err));
  },[]);

  React.useEffect(() => {
    if(totalContests){
        // var copyContests = {};

        //     totalContests.forEach(contestslip => {
        //         if(contestslip.gameName in copyContests){
        //             console.log("already there");
        //         } else{
        //             copyContests[contestslip.gameName] = [contestslip];
        //         }
        //     })
        //     setFData(copyContests);

            var allContests = {};

            totalContests.forEach(contestslip => {
                if(contestslip.sN in allContests){
                    allContests[contestslip.sN] = [...allContests[contestslip.sN], contestslip]
                } else{
                    allContests[contestslip.sN] = [contestslip];
                }
            })
            setFData(allContests);
    }
  },[totalContests]);

  
    


  return (
      	<MainLayout>
            <div className="resultsContainer">
                {
                    !fData && <span className="noResults">Fetching Results Please Wait...</span>
                }
                {
                    fData && Object.keys(fData).length < 1 && <span className="noResults">No Contest Was Found</span>
                }
                {
                    fData && Object.keys(fData).map(k => {
                       return <Collapse key={k} open={false} title={`${k} (${fData[k].length})`} columnStyle={true} biggerHead={true}>
                           {
                                fData[k].map(item => {
                                    return <AdminContestView 
                                        key={item._id}
                                        contestCount={item.cC}
                                        eventName={item.gN}
                                        eventId={item._id}
                                        eventLeague={item.lN}
                                        eventDate={getCountdown(item.gSD)}
                                    />
                                })
                            }
                       </Collapse>
                       
                       
                        // return <div key={k}>
                        //     <div className="sport__header-container">
                        //         {/* <i className="fa fa-baseball sport__header__icon"></i> */}
                        //         <div className="sport__league">
                        //             {k}
                        //         </div>
                        //         {/* <div className="sport__headers">
                        //             <div className="sport__header">
                        //                 1
                        //             </div>
                        //             <div className="sport__header">
                        //                 X
                        //             </div>
                        //             <div className="sport__header">
                        //                 2
                        //             </div>
                        //         </div> */}
                        //     </div>
                            
                        //     {
                        //         fData[k].map(item => {
                        //             return <AdminContestView 
                        //                 key={item._id}
                        //                 contestCount={item.cC}
                        //                 eventName={item.gN}
                        //                 eventId={item.gId}
                        //                 eventLeague={item.lN}
                        //                 eventDate={getCountdown(item.gSD)}
                        //             />
                        //         })
                        //     }
                            
                        // </div>
                    })
                }
                {
                    // newPostLoading && <span className="noResults">Loading more...</span>
                }
            </div>
      	</MainLayout>
  );
}

const mapStateToProps = state => ({
    user: state.user.user,
    token: state.user.token,
    pregames: state.pregame.games,
    cricketgames: state.pregame.cricketData,
    oddType: state.oddType.oddType,
    bets: state.betslip.bets,
    quizes: state.contestslip.quizes
})

const mapDispatchToProps = dispatch => ({
    setOddType: oddType => dispatch(setOddType(oddType)),
    setPageType: (pageType) => dispatch(setPageType(pageType))
})
 

export default connect(mapStateToProps, mapDispatchToProps)(MyAdmin);