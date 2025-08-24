window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("num_of_cards").value = "1";
})

function addCards() {
  const numOfCards = document.getElementById("num_of_cards");
  const cards  = document.getElementById("cards");

  const currentNumOfCard = parseInt(numOfCards.value, 10) || 0;
  const nextNumOfCard = currentNumOfCard + 1;

  if (nextNumOfCard > 10) {
    alert("Maximum Number of Cards: 10");
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "card";

  const ques = document.createElement("textarea");
  ques.name = `question${nextNumOfCard}`;
  ques.placeholder = `Question ${nextNumOfCard}`;

  const ans = document.createElement("textarea");
  ans.name = `answer${nextNumOfCard}`;
  ans.placeholder = `Answer ${nextNumOfCard}`;

  wrapper.appendChild(ques);
  wrapper.appendChild(ans);

  cards.appendChild(wrapper);
  numOfCards.value = String(nextNumOfCard);
}

async function loadCards(did) {
  let response = await fetch("/load_cards?deck_id=" + did);
  let cards = await response.json();
  let numOfCards = cards.length;
  let currentCard = 0, incorrect = 0, correct = 0;
  function showCard(){
    if (currentCard >= numOfCards) {
      document.getElementById("progress").innerText = "";
      document.getElementById("study_mode").innerHTML = '<div><p>All Done!</p><p>Correct: ' + correct + ', Incorrect: ' + incorrect + '</div>'; 
      return;
    }
    document.getElementById("study_mode").innerHTML = '<div>' +
                                                          '<p class="front">' + cards[currentCard].ques + '</p>' +
                                                          '<p class="back">' + cards[currentCard].ans + '</p>' +
                                                      '</div>' +
                                                      '<div>' +
                                                        '<button id="incorrect">Incorrect</button>' + 
                                                        '<button id="correct">Correct</button>' + 
                                                      '</div>';
    document.getElementById("progress").innerText = "Progress: " + (currentCard+1) + "    Correct: " + correct + "    Incorrect: " + incorrect;
    document.getElementById("incorrect").addEventListener("click", function() {
      incorrect++;
      currentCard++;
      showCard();
    })
    document.getElementById("correct").addEventListener("click", function() {
      correct++;
      currentCard++;
      showCard();
    }) 
  }
  showCard();
}
