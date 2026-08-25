const button = document.getElementById("runButton");
const message = document.getElementById("message");
const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");

const giftArea = document.getElementById("giftArea");
const mainGift = document.getElementById("mainGift");

const rewardPopup = document.getElementById("rewardPopup");
const rewardBox = document.querySelector(".rewardBox");
const rewardImage = document.getElementById("rewardImage");
const rewardMessage = document.getElementById("rewardMessage");
const playAgain = document.getElementById("playAgain");

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const mainFishContainer = document.querySelector(".mainFishContainer");
const funnyMessageElement = document.getElementById("funnyMessage");

let score = 0;
let timeLeft = 30;
let gameOver = false;
let giftClicks = 0;
let gameStarted = false;
let fishMoveCooldown = false;


// Funny messages
const funnyMessages = [
    "HAHA! You can't catch me 😂",
    "Too slow bro! 🏃💨",
    "Nice try! 😎",
    "You thought you could click me? 😂",
    "NOPE! 😈",
    "Almost... but not really 🤣",
    "Bro is still trying 💀",
    "Catch me if you can! 🏃",
    "I'm faster than your internet 😝",
    "Tu magaj vagar ni cho ke su? 😂",
    "Tarathi kai nay ukhde! 😎",
    "Tamarathi kai no thay, tamare mari javay! 😝💀",
    "Tu to pan, thay bhale kai nay 😂",
    "Pan apde apdu j chalu rakhvanu! 🔥",
    "Haju try kare che? 😂",
    "Bhai, reva de ne have 💀",
    "Aa button pan tari karta fast che 🏃💨",
    "Tu nahi pakdi shake mane 😈😜",
    "Aatlu badhu try kari ne pan kai nai thayu 😂",
    "Rano rana ni rite ho bhai 💀",
    "Nay bhegu thay ben have 😝"
];


// Rewards
const rewards = [
    {
        min: 1,
        max: 10,
        image: "https://i.etsystatic.com/41320167/r/il/5f9bde/6181658923/il_1080xN.6181658923_1v5e.jpg",
        message: "Aa lai ne bes, tari aukat aatli j che 😂"
    },
    {
        min: 11,
        max: 20,
        image: "https://static.vecteezy.com/system/resources/previews/050/610/005/large_2x/human-brain-anatomy-free-png.png",
        message: "Dimag mali gayu... have use pan karje 😂"
    },
    {
        min: 21,
        max: 30,
        image: "images/modi_melody.webp",
        message: "Enjoy Modi special melody 🍫😂"
    },
    {
        min: 31,
        max: 40,
        image: "https://static.vecteezy.com/system/resources/previews/021/950/409/large_2x/small-tree-growing-with-sunshine-in-garden-eco-concept-free-photo.jpg",
        message: "Grow this tree with your mind 🧠🌱"
    },
    {
        min: 41,
        max: 50,
        image: "https://static.vecteezy.com/system/resources/previews/049/352/690/non_2x/colorful-lollipop-transparent-background-png.png",
        message: "Aa le, have chup chap lollipop kha 😂"
    },
    {
        min: 51,
        max: 60,
        image: "https://thumbs.dreamstime.com/b/open-gift-box-joke-surprise-over-white-26581464.jpg",
        message: "tuy khato ja  💀😂"
    },
    {
        min: 61,
        max: 70,
        image: "https://img.freepik.com/premium-photo/steel-spoon-white-background_149301-4683.jpg?w=2000",
        message: "tame ane j layak rya cho have 😂"
    },
    {
        min: 71,
        max: 80,
        image: "https://img.freepik.com/premium-photo/blue-ballpoint-pen_960080-16354.jpg",
        message: "Pen uthao or likho chup chap! 😂"
    },
    {
        min: 81,
        max: 90,
        image: "https://tse3.mm.bing.net/th/id/OIP.w3ehfFgalB2esq6PRoJQaAAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
        message: "jetli speed thi score karyo atli speed thi gadi na chalavta le! 🔥"
    },
    {
        min: 91,
        max: 100,
        image: "https://th.bing.com/th/id/R.ea8cd068117d5b11fa0f12363953f671?rik=xgCe7rmmaQpyqA&riu=http%3a%2f%2fwishybazzar.com%2fwp-content%2fuploads%2f2025%2f10%2ffunny-food-wishes-1024x1024.webp&ehk=Z3c5565UOuVUpjlggVhB9Yby9Cq5kaG5b%2fFb0jDa4rk%3d&risl=&pid=ImgRaw&r=0",
        message: "BHAIIII! TU LEGEND CHO 🔥😂"
    }
];


// ============================
// FUNCTION: CALCULATE DETECTION DISTANCE (RESPONSIVE)
// ============================

function getDetectionDistance() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 480) {
        return 90; // Mobile: smaller detection distance
    } else if (screenWidth < 768) {
        return 110; // Tablet: medium detection distance
    }
    return 130; // Desktop: standard detection distance
}


// ============================
// FUNCTION: MOVE FISH (MAIN ESCAPE LOGIC)
// ============================

function moveFish() {
    // 1. Check game state
    if (!gameStarted || gameOver || fishMoveCooldown) {
        return;
    }

    // 2. Activate cooldown immediately
    fishMoveCooldown = true;

    // 3. Increase score exactly once
    score++;
    scoreText.innerText = score;

    // 4. Update center game message with random funny message
    const randomMessage = funnyMessages[
        Math.floor(Math.random() * funnyMessages.length)
    ];
    message.innerText = randomMessage;

    // 5. Update funny fish bubble with random message
    const funnyRandomMessage = funnyMessages[
        Math.floor(Math.random() * funnyMessages.length)
    ];
    funnyMessageElement.innerText = funnyRandomMessage;

    // 6. Calculate safe random position for the entire container
    const containerWidth = mainFishContainer.offsetWidth;
    const containerHeight = mainFishContainer.offsetHeight;
    const padding = 20;

    // Calculate max safe coordinates
    const maxX = Math.max(padding, window.innerWidth - containerWidth - padding);
    const maxY = Math.max(padding, window.innerHeight - containerHeight - padding);

    // Generate random position within safe bounds
    const randomX = padding + Math.random() * (maxX - padding);
    const randomY = padding + Math.random() * (maxY - padding);

    // 7. Move the container instantly (no transitions on left/top)
    mainFishContainer.style.left = randomX + "px";
    mainFishContainer.style.top = randomY + "px";

    // 8. Release cooldown after 80ms
    setTimeout(function () {
        fishMoveCooldown = false;
    }, 80);
}


// ============================
// DESKTOP MOUSE PROXIMITY DETECTION + MAGIC GLOW
// ============================

document.addEventListener("mousemove", function (event) {
    // Get fish center position
    const rect = button.getBoundingClientRect();
    const fishX = rect.left + rect.width / 2;
    const fishY = rect.top + rect.height / 2;

    // Get mouse position
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Calculate distance
    const distance = Math.sqrt(
        Math.pow(mouseX - fishX, 2) +
        Math.pow(mouseY - fishY, 2)
    );

    const detectionDist = getDetectionDistance();

    // If mouse is too close, trigger escape
    if (distance < detectionDist) {
        moveFish();
    }

    // Manage magic glow (slightly larger radius for visual effect)
    if (distance < detectionDist + 30) {
        button.classList.add("magic");
    } else {
        button.classList.remove("magic");
    }
});


// ============================
// TOUCH SUPPORT (Mobile)
// ============================

button.addEventListener("pointerdown", function (event) {
    // Only trigger for actual touch/pointer (not mouse)
    if (event.pointerType === "touch" || event.pointerType === "pen") {
        event.preventDefault();
        moveFish();
    }
});


// ============================
// TIMER
// ============================

let timer;

function startGame() {
    gameStarted = true;
    timer = setInterval(function () {
        timeLeft--;
        timerText.innerText = timeLeft;

        if (timeLeft <= 0) {
            gameOver = true;
            clearInterval(timer);

            button.style.display = "none";
            message.innerText =
                `💀 GAME OVER! Your score is ${score}! 😂`;

            setTimeout(function () {
                giftArea.classList.add("show");
            }, 1000);
        }
    }, 1000);
}


// ============================
// GIFT CLICK
// ============================

mainGift.addEventListener("click", function () {
    giftClicks++;

    // FIRST CLICK
    if (giftClicks === 1) {
        mainGift.classList.add("big");
        message.innerText =
            "Areee ek vaar j click karyo? 😂 Fari click kar!";
    }

    // SECOND CLICK
    if (giftClicks === 2) {
        let selectedReward = rewards.find(function (reward) {
            return score >= reward.min &&
                score <= reward.max;
        });

        // Score 100+ હોય તો last reward
        if (!selectedReward) {
            selectedReward =
                rewards[rewards.length - 1];
        }

        rewardImage.src =
            selectedReward.image;

        rewardMessage.innerText =
            selectedReward.message;

        rewardPopup.style.display = "flex";

        // Restart animation
        rewardBox.classList.remove("vibrate");
        void rewardBox.offsetWidth;
        rewardBox.classList.add("vibrate");
    }
});


// ============================
// PLAY AGAIN
// ============================

playAgain.addEventListener("click", function () {
    location.reload();
});


// ============================
// START BUTTON
// ============================

startButton.addEventListener("click", function () {
    startScreen.style.display = "none";
    startGame();
});
