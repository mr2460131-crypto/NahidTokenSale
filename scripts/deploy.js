async function main(){

    const NahidToken =
    await ethers.getContractFactory("NahidToken");

    const token =
    await NahidToken.deploy();

    await token.waitForDeployment();

    console.log(
        "NahidToken deployed to:",
        await token.getAddress()
    );

    const NahidTokenSale =
    await ethers.getContractFactory("NahidTokenSale");

    const tokenSale =
    await NahidTokenSale.deploy(
        await token.getAddress()
    );

    await tokenSale.waitForDeployment();

    console.log(
        "NahidTokenSale deployed to:",
        await tokenSale.getAddress()
    );
}

main().catch((error) => {

    console.error(error);

    process.exitCode = 1;
});