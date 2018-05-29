/*
 * Create a list that holds all of your cards
 */
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
/*------------VARIABLES--------------*/
let cards = $('.card').get(),
    cardsArray = $.makeArray(cards),
    matchedCards = $('.match').get(),
    matchedCardsArray = $.makeArray(matchedCards),
    openCards = $('.open').get(),
    openCardsArray = $.makeArray(openCards),
    moves = document.querySelector('.moves'),
    firstStar = document.querySelector('.one'),
    secondStar = document.querySelector('.two'),
    thirdStar = document.querySelector('.three');
cardsArray = shuffle(cardsArray);
/*-----------END VARIABLES----------*/

/*------PLAY & RESTART BUTTONS-----*/

$('.play').one('click', function () {
    $(this).css({
        'text-shadow': '5px 2px 5px #EECE90',
        'color': '#97B3AC'
    });
    Timer();
    Play();
});

$('.restart').click(function () {
    location.reload();
    Restart();
});

$(function Restart() {
    $('.card').removeClass('open show match');
    $('.deck').append(cardsArray);
});
/*------END PLAY & RESTART BUTTONS-----*/

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length
    var temporaryValue
    var randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*----------------PLAY------------------*/

var perf = performance.now(); /*START TIMER*/
function Play() {

    /*------SETTING UP A MOVES COUNTER----------*/
    let moveCounter = 0;
    let counter = document.querySelector('.counter');
    /* set up the event listener for a card. If a card is clicked:*/

    $('.card').click(function () {
        moveCounter++;
        counter.innerHTML = moveCounter;
        /*-------------END MOVES COUNTER-------------*/

        /*  - display the card's symbol */
        /*  - add the card to a *list* of "open" cards */

        let openCards = $('.open').get();
        let openCardsArray = $.makeArray(openCards);
        $(this).addClass('open show');

        /*  - if the list already has another card, check to see if the two cards match*/
        /*  - if the cards do not match, remove the cards from the list and hide the card's symbol */

        if (openCardsArray.length === 2) {
            $(openCardsArray).removeClass('open show');
        } else {

            /*  - if the cards do match, lock the cards in the open position */

            let openCards = $('.open').get();
            let openCardsArray = $.makeArray(openCards);

            /*-------ANIMATE OPENED CARDS--------*/

            if (openCardsArray.length === 2 && openCardsArray[0].innerHTML !== openCardsArray[1].innerHTML) {
                $(openCardsArray).addClass('noMatch');
                setTimeout(function () {
                    $(openCardsArray).removeClass('open show noMatch');
                }, 500);
            }
            if (openCardsArray.length === 2 && openCardsArray[0].innerHTML === openCardsArray[1].innerHTML) {
                $(openCardsArray).addClass('match');

                /*--------------END ANIMATE-------------*/

                let matchedCards = $('.match').get();
                let matchedCardsArray = $.makeArray(matchedCards);

                /*  - if all cards have matched, display a message with the final score*/

                if (matchedCardsArray.length === 16) {
                    var perf1 = performance.now(); /*END TIMER*/

                    /*-------------WIN MODAL MESSAGE (timer/moves dependant)--------------*/
                    let modal = document.querySelector('.modal');
                    let modalInfo = document.querySelector('.modal-info');
                    let audio = document.querySelector('#winSound');
                    $(function () {
                        let y = '';
                        let timeTaken = (perf1 - perf) / 1000;
                        let rating = timeTaken + moveCounter;
                        if (rating <= 60) {
                            y = '<span class="rate"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></span>';
                        }
                        if (rating > 60) {
                            y = '<span class="rate"><i class="fa fa-star"></i><i class="fa fa-star"></i></span>';
                        }
                        if (rating > 80) {
                            y = '<span class="rate"><i class="fa fa-star"></i></span>';
                        }
                        if (rating > 90) {
                            x = 0;
                            y = '<span class="noRate"><i class="far fa-bell bell"></i> no stars!</span>';
                        }
                        audio.play();
                        setTimeout(function () {
                            modal.style.display = "block";
                            modalInfo.innerHTML = `You won! It took you only ${(timeTaken).toFixed(0)} seconds and ${moveCounter} moves! Your star rating is: ${y}`;
                        }, 500)
                        console.log(rating); /*check if the moves/time taken sum is counted correctly*/
                    });
                    /*----------------END WIN MODAL MESSAGE ------------*/
                    console.log(perf1 - perf); /*check if the timer is counted correctly*/
                }
            }
        }
    });
}

/*-----------SETTING IN-GAME TIMER---------*/

function Timer() {

    /*------------IN-GAME MOVES COUNTER-------------*/
    let inMoveCounter = 0;
    let inCounter = document.querySelector('.counter');
    $('.card').click(function () {
        inMoveCounter++;
        inCounter.innerHTML = inMoveCounter;
        console.log(inMoveCounter);
    });
    /*------------END IN-GAME MOVES COUNTER----------*/

    let i = 60;
    let k = 0;
    let inTimer = document.querySelector('.sec');

    $(function Repeat() {
        inTimer.innerHTML = i;
        let start = window.setTimeout(Repeat, 1000);
        let inRating = k + inMoveCounter;
        /*  - increment the time and moves counter and display it on the page*/
        if (i >= 0) {
            i--;
            $(thirdStar).addClass('fa-spin');
        }

        if (k <= 60) {
            k++;
        }
        /*Make sure in-game star rating goes down gradually if no moves happened*/
        if ((inRating > 60 && inMoveCounter !== 0) || (i < 45 && inMoveCounter === 0)) {
            $(thirdStar).addClass('noStar');
            $(thirdStar).removeClass('fa-spin');
            $(secondStar).addClass('fa-spin');
        }

        if ((inRating > 80 && inMoveCounter !== 0) || (i < 30 && inMoveCounter === 0)) {
            $(secondStar).addClass('noStar');
            $(secondStar).removeClass('fa-spin');
            $(firstStar).addClass('fa-spin');
        }

        if ((inRating > 90 && inMoveCounter !== 0) || (i < 15 && inMoveCounter === 0)) {
            $(firstStar).addClass('noStar');
            $(firstStar).removeClass('fa-spin');
        }

        if (i < 0) {
            /*-----------GAME OVER MODAL MESSAGE--------*/
            let openCards = $('.open').get();
            let openCardsArray = $.makeArray(openCards);
            let matchedCards = $('.match').get();
            let matchedCardsArray = $.makeArray(matchedCards);
            let audio = document.querySelector('#loseSound');
            if (matchedCardsArray.length < 16) {
                let modal = document.querySelector('.modal');
                let modalInfo = document.querySelector('.modal-info');
                modal.style.display = "block";
                modalInfo.innerHTML = `Game Over!`;
                audio.play(3);
            }
            /*------------END MODAL MESSAGE ------------*/

            window.clearTimeout(start);
        }
    });
}
/*-----------END SETTING IN-GAME TIMER---------*/
