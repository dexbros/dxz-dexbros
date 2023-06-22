
const getCountdown = (eventDate) => {
    var countDownDate = new Date(eventDate).getTime();

        // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    //var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    if(days < 1 && hours < 1 && minutes < 1){
        var countDown = "EXPIRED";
    } else if(days < 1  && hours < 1){
        var countDown = minutes + "m ";
    } else if(days < 1){
        var countDown = hours + "h "
        + minutes + "m ";
    } else{
        var countDown = days + "d " + hours + "h "
        + minutes + "m ";
    }
    

    // If the count down is finished, write some text
    if (distance < 0) {
        return "EXPIRED";
    }

    return countDown;
}

export default getCountdown;
