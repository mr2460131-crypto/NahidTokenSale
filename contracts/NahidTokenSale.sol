// SPDX-License-Identifier: MIT
pragma solidity^0.8.20;
import "./NahidToken.sol";

contract NahidTokenSale{
    NahidToken public token;
    uint256 public tokenPrice = 0.01 ether;
    uint256 public totalEthRaised;
    uint256 public totalTransactions;
    address public owner;
    mapping(address => uint256) public balances;

    event TokenPurchased(address buyer,uint256 ethAmount,uint256 tokenAmount);

    constructor(address tokenAddress) {

    owner = msg.sender;

    token = NahidToken(tokenAddress);
}
    
    modifier onlyOwner(){
           require(msg.sender== owner,"Only owner can call this function");
        _;
    }

    function buyToken()public payable{

    require(msg.value >0,"ETH amount must be greater than 0");
    uint256 tokensToBuy = msg.value/tokenPrice;
    require(token.transferFrom(owner,msg.sender,tokensToBuy),"Token transfer failed");
    totalEthRaised += msg.value;
    totalTransactions++;

    emit TokenPurchased(msg.sender,msg.value,tokensToBuy);
}

   function withdraw() public onlyOwner{
    payable(owner).transfer(address(this).balance);   
}
}