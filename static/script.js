// reset value for num of cards on page reload
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("num_of_cards").value = "1";
})

// add cards wher creating a deck
function addCards() { 
  // get DOM of num of cards and cards area
  const numOfCards = document.getElementById("num_of_cards");
  const cards  = document.getElementById("cards");

  // get value of current and next num of card
  const currentNumOfCard = parseInt(numOfCards.value, 10) || 0;
  const nextNumOfCard = currentNumOfCard + 1;

  // check for limit of max cards
  if (nextNumOfCard > 10) {
    alert("Maximum Number of Cards: 10");
    return;
  }

  // create new element for card in memory 
  const wrapper = document.createElement("div");
  wrapper.className = "card mb-3 border-0";
  wrapper.innerHTML = `
      <div class="row g-3">
          <div class="col-12 col-md-6">
              <label class="form-label" for="question${nextNumOfCard}">Question ${nextNumOfCard}</label>
              <textarea class="form-control no-resize" id="question${nextNumOfCard}" name="question${nextNumOfCard}" rows="3" placeholder="Enter question"></textarea>
          </div>
          <div class="col-12 col-md-6">
              <label class="form-label" for="answer${nextNumOfCard}">Answer ${nextNumOfCard}</label>
              <textarea class="form-control no-resize" id="answer${nextNumOfCard}" name="answer${nextNumOfCard}" rows="3" placeholder="Enter answer"></textarea>
          </div>
          </div>
      </div>
  `;

  // update the count of cards
  document.getElementById("cardCountBadge").innerText = `${nextNumOfCard} / 10`;

  // add new element to page
  cards.appendChild(wrapper);
  // update num of cards
  numOfCards.value = String(nextNumOfCard);
}

// load cards during study
async function loadCards(did) {
  // remove start button
  document.getElementById("startBtn").remove();

  // get card details and wait for them to be parsed
  let response = await fetch("/load_cards?deck_id=" + did);
  let cards = await response.json();
  // Initialize counters for different values
  let numOfCards = cards.length;
  let currentCard = 0, incorrect = 0, correct = 0;

  // Show new/next card
  function showCard(){
    // all cards done
    if (currentCard >= numOfCards) {
      // remove progress bar and display end page
      document.getElementById("progress").remove();
      document.getElementById("study_mode").innerHTML = `
          <h4 class="mb-3">All Done! <span aria-hidden="true">✅</span></h4>
          <p class="mb-2">Correct: <strong>${correct}</strong> &nbsp; · &nbsp; Incorrect: <strong>${incorrect}</strong></p>
          <div class="d-flex justify-content-center gap-2 mt-3">
            <a href="/" class="btn primary-btn">
              <i class="bi bi-house-door me-1" aria-hidden="true"></i> Home
            </a>
          </div>
      `;
      return;
    }

    // display card
    document.getElementById("study_mode").innerHTML = `
        <div class="flip-card mb-3 align-items-center justify-content-center" id="flipCard" role="button" tabindex="0" aria-label="Flashcard. Press Enter or click to flip." style="height:100%; width:100%">
          <div class="flip-card-inner shadow-sm">
            <div class="flip-card-face flip-card-front p-3">
              <p class="front display-3 mb-0">${cards[currentCard].ques}</p>
            </div>
            <div class="flip-card-face flip-card-back p-3 text-muted">
              <p class="back display-4 mb-0">${cards[currentCard].ans}</p>
            </div>
          </div>
        </div>

        <div class="d-flex gap-2 mt-3 justify-content-around" style="width:100%">
          
            <button id="incorrect" class="btn btn-outline-danger">
              <i class="bi bi-x-lg me-1"></i> Incorrect
            </button>
            <button id="correct" class="btn primary-btn">
              <i class="bi bi-check-lg me-1"></i> Correct
            </button>
          
        </div>
    `;
    // Create/Update progress bar
    document.getElementById("progress").className = "badge rounded-pill bg-light primary-text fw-semibold px-3 py-2"
    document.getElementById("progress").innerText = "Progress: " + (currentCard+1) + "/" + numOfCards + "    Correct: " + correct + "    Incorrect: " + incorrect;

    const flipCard = document.getElementById("flipCard");
  const inner = flipCard.querySelector(".flip-card-inner");

  // Click toggles flip. Use a class on container for flipped state.
  function toggleFlip() {
    flipCard.classList.toggle("is-flipped");
  }

  // Click on the card flips it
  flipCard.addEventListener("click", function (e) {
    // If click came from a button inside, ignore (safety)
    if (e.target.closest("button")) return;
    toggleFlip();
  });

  // Keyboard accessibility: Enter or Space flips
  flipCard.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFlip();
    }
  });


    // display next card after users input
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

  // display first card
  showCard();
}
