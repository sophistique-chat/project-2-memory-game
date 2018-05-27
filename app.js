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
let cards = $('.card').get();
let cardsArray = jQuery.makeArray(cards);
cardsArray = shuffle(cardsArray);
let matchedCards = $('.match').get();
let matchedCardsArray = jQuery.makeArray(matchedCards);
let openCards = $('.open').get();
let openCardsArray = jQuery.makeArray(openCards);
let moves = document.querySelector('.moves');
let firstStar = document.querySelector('.one');
let secondStar = document.querySelector('.two');
let thirdStar = document.querySelector('.three');
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

    /* set up the event listener for a card. If a card is clicked:*/

    $('.card').click(function () {

        /*  - display the card's symbol */
        /*  - add the card to a *list* of "open" cards */

        let openCards = $('.open').get();
        let openCardsArray = jQuery.makeArray(openCards);
        $(this).addClass('open show');

        /*  - if the list already has another card, check to see if the two cards match*/
        /*  - if the cards do not match, remove the cards from the list and hide the card's symbol */

        if (openCardsArray.length === 2) {
            $(openCardsArray).removeClass('open show');
        } else {

            /*  - if the cards do match, lock the cards in the open position */

            let openCards = $('.open').get();
            let openCardsArray = jQuery.makeArray(openCards);

            /*-------ANIMATE OPENED CARDS--------*/

            if (openCardsArray.length === 2 && openCardsArray[0].innerHTML !== openCardsArray[1].innerHTML) {
                $(openCardsArray).addClass('noMatch');
                $(openCardsArray).animate({
                    "left": "+=10px"
                }, 50);
                $(openCardsArray).animate({
                    "left": "-=10px"
                }, 50);
                $(openCardsArray).animate({
                    "left": "+=10px"
                }, 50);
                $(openCardsArray).animate({
                    "left": "-=10px"
                }, 50);
                setTimeout(function () {
                    $(openCardsArray).removeClass('open show noMatch');
                }, 500);
            }
            if (openCardsArray.length === 2 && openCardsArray[0].innerHTML === openCardsArray[1].innerHTML) {
                $(openCardsArray).addClass('match');
                $(openCardsArray).css({
                    'position': 'relative'
                });
                $(openCardsArray).animate({
                    "width": "+=7px",
                    "height": "+=7px"
                }, 150);
                $(openCardsArray).animate({
                    "width": "-=7px",
                    "height": "-=7px"
                }, 150);

            /*--------------END ANIMATE-------------*/

                let matchedCards = $('.match').get();
                let matchedCardsArray = jQuery.makeArray(matchedCards);

                /*  - if all cards have matched, display a message with the final score*/

                if (matchedCardsArray.length === 16) {
                    var perf1 = performance.now(); /*END TIMER*/

/*------------WIN MODAL MESSAGE (timer dependant)--------------*/
                    let modal = document.querySelector('.modal');
                    let modalInfo = document.querySelector('.modal-info');
                    $(function () {
                        let x = 3;
                        let y = '';
                        let timeTaken = (perf1 - perf) / 1000;
                        if (timeTaken >= 45) {
                            x = 0;
                            y = '<span class="noRate"><i class="far fa-bell bell"></i> no stars!</span>';
                        }
                        if (timeTaken < 45 && timeTaken >= 30) {
                            y = '<span class="rate"><i class="fa fa-star"></i></span>';
                        }
                        if (timeTaken < 30 && timeTaken > 15) {
                            y = '<span class="rate"><i class="fa fa-star"></i><i class="fa fa-star"></i></span>';
                        }
                        if (timeTaken < 15 && timeTaken > 0) {
                            y = '<span class="rate"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></span>';
                        }
                        setTimeout(function () {
                            modal.style.display = "block";
                            modal.style.fontSize = '0.8em';
                            modalInfo.style.height = '380px';
                            modalInfo.innerHTML = `You won! It took you only ${(timeTaken).toFixed(0)} seconds! Your star rating is: ${y}`;
                        }, 500)
                    });
            /*------------END MODAL MESSAGE ------------*/
    console.log(perf1 - perf); /*check if the timer is counted correctly*/
                }
            }
        }
    });
}

/*-----------SETTING IN-GAME TIMER---------*/
function Timer() {
    let i = 60;
    let timer = document.querySelector('.sec');
    $(function Repeat() {
        timer.innerHTML = i;
        let start = window.setTimeout(Repeat, 1000);

        /*  - increment the time counter and display it on the page*/
        if (i >= 0) {
            $(thirdStar).addClass('fa-spin');
            i--;
        }
        if (i <= 44) {
            thirdStar.style.color = 'darkcyan';
            thirdStar.style.opacity = 0.5;
            $(thirdStar).removeClass('fa-spin');
            $(secondStar).addClass('fa-spin');
            moves.innerHTML = '2 Stars Left';
        }
        if (i <= 29) {
            secondStar.style.color = 'darkcyan';
            secondStar.style.opacity = 0.5;
            $(secondStar).removeClass('fa-spin');
            $(firstStar).addClass('fa-spin');
            moves.innerHTML = '1 Star Left';
        }
        if (i <= 14) {
            firstStar.style.color = 'darkcyan';
            firstStar.style.opacity = 0.5;
            $(firstStar).removeClass('fa-spin');
            moves.innerHTML = '0 Stars Left';
        }
        if (i < 0) {

            /*-----------GAME OVER MODAL MESSAGE---------------*/
            let openCards = $('.open').get();
            let openCardsArray = jQuery.makeArray(openCards);
            let matchedCards = $('.match').get();
            let matchedCardsArray = jQuery.makeArray(matchedCards);
            if (matchedCardsArray.length < 16) {
                let modal = document.querySelector('.modal');
                let modalInfo = document.querySelector('.modal-info');
                modal.style.display = "block";
                modalInfo.innerHTML = `Game Over!`;
            }
            /*------------END MODAL MESSAGE ------------*/
            window.clearTimeout(start);
        }
    });
}
/*-----------END SETTING IN-GAME TIMER---------*/
