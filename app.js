// ===== Contract Info =====
const TOKEN_ADDRESS = "0x6c811F30c2Ac4972Aa4173A3b7D648e0eA3E082f";
const SALE_ADDRESS = "0x1C824a5551197cefd866538678313a7e86305F4C";

const TOKEN_ABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
];

const SALE_ABI = [
    "function buyToken() payable",
    "function tokenPrice() view returns (uint256)",
    "function totalEthRaised() view returns (uint256)",
    "function totalTransactions() view returns (uint256)",
    "event TokenPurchased(address buyer, uint256 ethAmount, uint256 tokenAmount)"
];

// ===== Global Variables =====
let provider;
let signer;
let userAddress;
let tokenContract;
let saleContract;

// ===== DOM Elements =====
const connectBtn = document.getElementById("connectBtn");
const walletElement = document.getElementById("wallet");
const priceElement = document.getElementById("price");
const balanceElement = document.getElementById("balance");
const statusElement = document.getElementById("status");
const ethInput = document.getElementById("ethAmount");
const buyBtn = document.getElementById("buyBtn");
const totalEthElement = document.getElementById("totalEth");
const historyElement = document.getElementById("history");

// ===== Event Listeners =====
connectBtn.addEventListener("click", connectWallet);
buyBtn.addEventListener("click", buyTokens);

// ===== Connect Wallet =====
async function connectWallet() {

    if (typeof window.ethereum === "undefined") {
        statusElement.textContent = "MetaMask পাওয়া যাচ্ছে না। Install করুন।";
        return;
    }

    try {
        statusElement.textContent = "Connecting...";

        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        signer = await provider.getSigner();
        userAddress = await signer.getAddress();

        walletElement.textContent =
            userAddress.slice(0, 6) + "..." + userAddress.slice(-4);

        connectBtn.textContent = "Connected ✅";
        connectBtn.disabled = true;

        tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
        saleContract = new ethers.Contract(SALE_ADDRESS, SALE_ABI, signer);

        statusElement.textContent = "Wallet connected!";

        await loadContractData();
        listenForPurchases();

    } catch (error) {
        console.error(error);
        statusElement.textContent = "Connection failed: " + error.message;
    }
}

// ===== Load Contract Data =====
async function loadContractData() {

    try {
        const price = await saleContract.tokenPrice();
        priceElement.textContent = ethers.formatEther(price) + " ETH";

        const balance = await tokenContract.balanceOf(userAddress);
        balanceElement.textContent = ethers.formatEther(balance) + " NHT";

        const totalEth = await saleContract.totalEthRaised();
        totalEthElement.textContent = ethers.formatEther(totalEth) + " ETH";

    } catch (error) {
        console.error(error);
        statusElement.textContent = "Data load failed: " + error.message;
    }
}

// ===== Buy Tokens =====
async function buyTokens() {

    if (!saleContract) {
        statusElement.textContent = "আগে wallet connect করুন।";
        return;
    }

    const ethAmount = ethInput.value;

    if (!ethAmount || Number(ethAmount) <= 0) {
        statusElement.textContent = "Valid ETH amount দিন।";
        return;
    }

    try {
        statusElement.textContent = "MetaMask-এ confirm করুন...";

        const tx = await saleContract.buyToken({
            value: ethers.parseEther(ethAmount)
        });

        statusElement.textContent = "Transaction pending...";

        await tx.wait();

        statusElement.textContent = "✅ Purchase successful!";

        ethInput.value = "";

        await loadContractData();

    } catch (error) {
        console.error(error);
        statusElement.textContent = "❌ Failed: " + error.message;
    }
}

// ===== Listen for Purchase Events =====
function listenForPurchases() {

    saleContract.on("TokenPurchased", (buyer, ethAmount, tokenAmount) => {

        const li = document.createElement("li");

        li.textContent =
            ethers.formatEther(ethAmount) + " ETH → " +
            ethers.formatEther(tokenAmount) + " NHT" +
            " (" + buyer.slice(0, 6) + "..." + buyer.slice(-4) + ")";

        historyElement.prepend(li);
    });
}