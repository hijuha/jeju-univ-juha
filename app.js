// // let startingPokerChips = 100;
// // let players = 3;
// // let noOfStarterCards = 2;

// // let playerOnePoints = startingPokerChips;
// // let playerTwoPoints = startingPokerChips;
// // let playerThreePoints = startingPokerChips;

// // playerOnePoints -= 50;
// // playerTwoPoints -= 25;
// // playerThreePoints += 75;

// /* 게임 변수 3개 선언 */
// const STARTING_POKER_CHIPS = 100; // points
// const PLAYERS = 3;
// const NO_OF_STARTER_CARDS = 2;
// /* 3개의 플레이어 시작 점수 할당 */
// let playerOnePoints = STARTING_POKER_CHIPS;
// let playerTwoPoints = STARTING_POKER_CHIPS;
// let playerThreePoints = STARTING_POKER_CHIPS;
// /* 점수 배팅 */
// playerOnePoints -= 50;
// playerTwoPoints -= 25;
// playerThreePoints += 75;

// let playerOneName = "Chloe";
// let playerTwoName = "Jasmine";
// let playerThreeName = "Jen";
// console.log(
//   `Welcome! 챔피언십 타이틀은 ${playerOneName}, ${playerTwoName}, ${playerThreeName} 중 한 명에게 주어집니다. 각 선수는 ${STARTING_POKER_CHIPS} 의 칩을 가지고 시작합니다. 흥미진진한 경기가 될 것입니다. 최고의 선수가 승리하길 바랍니다!`
// );

// let gameHasEnded = false;
// gameHasEnded =
//   playerOnePoints + playerTwoPoints == 0 || // 플레이어3 우승 ((playerTwoPoints + playerThreePoints) == 0) || // 플레이어1 우승 ((playerOnePoints + playerThreePoints) == 0); // 플레이어2 우승
//   console.log("Game has ended: ", gameHasEnded);

// function displayGreeting() {
//   console.log("Hello, world!");
// }

// // name 이라는 매개 변수(parameter)를 가진 함수
// function displayGreeting(name) {
//   // name을 문자열에 넣는 새로운 message 변수를 생성
//   const message = `Hello, ${name}!`;
//   // message를 콘솔에 출력
//   console.log(message);
// }
// displayGreeting("hijuha");

// function displayGreeting(name, salutation = "Hello") {
//   console.log(`${salutation}, ${name}`);
// }
// displayGreeting("Christopher");
// // "Hello, Christopher"
// displayGreeting("Christopher", "Hi");
// // "Hi, Christopher"

// // TODO: Add hello code
// function getMessage(name) {
//   return "Hello, " + name + "...";
// }

// const message = getMessage("Ornella");
// document.write(message);

// // function displayDone() {
// //   console.log("Done!");
// // }
// // setTimeout(displayDone(), 3000); // 즉시 실행 setTimeout(displayDone, 3000); // 3초후 실행

// setTimeout(
//   () => {
//     // anonymous function
//     console.log("Done!");
//   },
//   3000 // 3000 milliseconds (3 seconds)
// );
