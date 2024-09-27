let bank = [10, 3, 6, 8, 2, 4, 10, 7, 9, 1];

let playerSum = 5 + 4;
let dealerSum = 10 + 3;
let turn = 0;

while (dealerSum < 17) {
  if (playerSum === 21) {
    console.log("BlackJack, Player win");
    break;
  } else if (playerSum > 21) {
    console.log("Player Bust, Dealer win");
    break;
  } else if (dealerSum > 21) {
    console.log("Dealer Bust, Player win");
    break;
  }

  let newPlayerCard = bank[turn];
  let newDealerCard = bank[turn + 1];
  playerSum += newPlayerCard;
  dealerSum += newDealerCard;

  turn++;
}

console.log(`Player has ${playerSum} points`);
console.log(`Dealer has ${dealerSum} points!`);

if (dealerSum >= 17) {
  if (playerSum > dealerSum) {
    console.log("Player win");
  } else if (playerSum < dealerSum) {
    console.log("Dealer win");
  } else {
    console.log("Draw");
  }
}
