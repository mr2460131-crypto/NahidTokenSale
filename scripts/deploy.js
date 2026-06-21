async function main(){

    const NahidToken =
    await ethers.getContractFactory("NahidToken");

    const token = await NahidToken.deploy();

    await token.waitForDeployment();

    console.log("NahidToken deployed to:",await token.getAddress());

    const NahidTokenSale = await ethers.getContractFactory("NahidTokenSale");

    const tokenSale = await NahidTokenSale.deploy(await token.getAddress());

    await tokenSale.waitForDeployment();

    console.log("NahidTokenSale deployed to:",await tokenSale.getAddress());

    // ===== নতুন অংশ — owner approve() করছে =====
    const approveAmount = ethers.parseEther("500000"); // যত token sell করতে চাও

    const approveTx = await token.approve(
        await tokenSale.getAddress(),
        approveAmount
    );

    await approveTx.wait();

    console.log("Approved 500000 NHT allowance to TokenSale contract");
    // ============================================
}

main().catch((error) => {

    console.error(error);

    process.exitCode = 1;
});