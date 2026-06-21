async function main(){

    const [owner] = await ethers.getSigners();

    console.log("Using account:", owner.address);

    const NahidToken = await ethers.getContractFactory("NahidToken");
    const token = await NahidToken.attach("0x6c811F30c2Ac4972Aa4173A3b7D648e0eA3E082f");

    const NahidTokenSale = await ethers.getContractFactory("NahidTokenSale");
    const tokenSale = await NahidTokenSale.attach("0x1C824a5551197cefd866538678313a7e86305F4C");

    // Step 1: Allowance check
    const allowance = await token.allowance(owner.address, await tokenSale.getAddress());
    console.log("Allowance:", allowance.toString());

    // Step 2: buyToken() call করা (0.01 ETH দিয়ে, মানে 1 token কেনার চেষ্টা)
    const tx = await tokenSale.buyToken({ value: ethers.parseEther("0.01") });
    await tx.wait();

    console.log("Buy transaction successful!");

    // Step 3: Token balance check
    const balance = await token.balanceOf(owner.address);
    console.log("Token balance after purchase:", balance.toString());

    // Step 4: TokenSale contract-এর stats check
    const totalEthRaised = await tokenSale.totalEthRaised();
    const totalTransactions = await tokenSale.totalTransactions();
    console.log("Total ETH raised:", ethers.formatEther(totalEthRaised));
    console.log("Total transactions:", totalTransactions.toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});