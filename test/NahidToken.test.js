const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NahidToken",function(){

    let token;
    let owner;
    let user1;
    let user2;

    beforeEach(async function(){

       [owner,user1,user2] = await ethers.getSigners();

        const NahidToken = await ethers.getContractFactory("NahidToken");

        token = await NahidToken.deploy();

        await token.waitForDeployment();
    });

    it("Should assign total supply to owner",async function(){

        const totalSupply =
        await token.totalSupply();

        const ownerBalance =
        await token.balanceOf(owner.address);

        expect(ownerBalance).to.equal(totalSupply);
    });
    it("Should set owner correctly",async function(){

    expect(await token.owner()).to.equal(owner.address);
});

it("Should set token name correctly",async function(){

    expect(await token.name()).to.equal("Nahid Token");
});

it("Should set token symbol correctly",async function(){

    expect(await token.symbol()).to.equal("NHT");
});

it("Should transfer tokens successfully",async function(){

    await token.transfer(user1.address,100);

    expect(
        await token.balanceOf(user1.address)
    ).to.equal(100);
});

it("Should reduce sender balance after transfer",async function(){

    const ownerBalanceBefore =
    await token.balanceOf(owner.address);

    await token.transfer(user1.address,100);

    const ownerBalanceAfter =
    await token.balanceOf(owner.address);

    expect(ownerBalanceAfter)
    .to.equal(ownerBalanceBefore - 100n);
});

it("Should fail when balance is insufficient",async function(){

    await expect(

        token
        .connect(user1)
        .transfer(owner.address,100)

    ).to.be.revertedWith("Insufficient balance");
});

it("Owner should mint tokens",async function(){

    await token.mint(user1.address,500);

    expect(
        await token.balanceOf(user1.address)
    ).to.equal(500);

    expect(
        await token.totalSupply()
    ).to.equal(1000000n * 10n ** 18n + 500n);
});
it("Should approve allowance",async function(){

    await token.approve(user1.address,500);

    expect(
        await token.allowance(
            owner.address,
            user1.address
        )
    ).to.equal(500);
});

it("Should overwrite previous allowance",async function(){

    await token.approve(user1.address,500);

    await token.approve(user1.address,1000);

    expect(
        await token.allowance(
            owner.address,
            user1.address
        )
    ).to.equal(1000);
});

it("Should approve zero allowance",async function(){

    await token.approve(user1.address,0);

    expect(
        await token.allowance(
            owner.address,
            user1.address
        )
    ).to.equal(0);
});
it("Should transferFrom successfully",async function(){

    await token.approve(user1.address,500);

    await token
        .connect(user1)
        .transferFrom(
            owner.address,
            user2.address,
            300
        );

    expect(
        await token.balanceOf(user2.address)
    ).to.equal(300);
});
it("Should reduce allowance after transferFrom",async function(){

    await token.approve(user1.address,500);

    await token
        .connect(user1)
        .transferFrom(
            owner.address,
            user2.address,
            300
        );

    expect(
        await token.allowance(
            owner.address,
            user1.address
        )
    ).to.equal(200);
});
it("Should fail when allowance exceeded",async function(){

    await token.approve(user1.address,100);

    await expect(

        token
            .connect(user1)
            .transferFrom(
                owner.address,
                user2.address,
                200
            )

    ).to.be.revertedWith(
        "Allowance exceeded"
    );
});
it("Should fail when balance insufficient",async function(){

    await token.mint(
        user1.address,
        100
    );

    await token
        .connect(user1)
        .approve(
            owner.address,
            500
        );

    await expect(

        token.transferFrom(
            user1.address,
            user2.address,
            500
        )

    ).to.be.revertedWith(
        "Insufficient balance"
    );
});
it("Should emit Transfer event",async function(){

    await expect(

        token.transfer(
            user1.address,
            100
        )

    )
    .to.emit(token,"Transfer")
    .withArgs(
        owner.address,
        user1.address,
        100
    );
});
it("Non owner should not mint",async function(){

    await expect(

        token
            .connect(user1)
            .mint(
                user2.address,
                100
            )

    ).to.be.revertedWith(
        "Only Owner"
    );
});

});