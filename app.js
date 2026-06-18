const tokenPrice = 0.01;
let tokenBalance = 0;
let totalEthSpent = 0;

const purchases = [];

const buyBtn =
document.getElementById("buyBtn");

const balanceElement =
document.getElementById("balance");

const statusElement =
document.getElementById("status");

const ethInput =
document.getElementById("ethAmount");

const totalEthElement =
document.getElementById("totalEth");

const historyElement =
document.getElementById("history");

buyBtn.addEventListener("click", buyTokens);

function buyTokens() {

    const ethAmount =
    Number(ethInput.value);

    if (ethAmount <= 0) {

        statusElement.textContent =
        "Please enter a valid ETH amount.";

        return;
    }

    const purchasedTokens =
    Math.floor(ethAmount / tokenPrice);

    tokenBalance += purchasedTokens;

    totalEthSpent += ethAmount;

    purchases.push({
        eth: ethAmount,
        tokens: purchasedTokens
    });

    balanceElement.textContent =
    `${tokenBalance} Tokens`;

    totalEthElement.textContent =
    `${totalEthSpent} ETH`;

    statusElement.textContent =
    `Successfully purchased ${purchasedTokens} Tokens`;

    renderHistory();

    ethInput.value = "";
}

function renderHistory() {

    historyElement.innerHTML = "";

    for (let purchase of purchases) {

        const li =
        document.createElement("li");

        li.textContent =
        `${purchase.eth} ETH → ${purchase.tokens} Tokens`;

        historyElement.appendChild(li);
    }
}