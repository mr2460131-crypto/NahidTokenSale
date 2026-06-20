// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
contract NahidToken{
    string public name = "Nahid Token";
    string public symbol = "NHT";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18;
    address public owner;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256))public allowance;

    event Transfer(address from,address to,uint256 value);
    
        constructor() {
            owner= msg.sender;
            balanceOf[msg.sender] = totalSupply;
        }
       modifier onlyOwner(){ require(msg.sender==owner,"Only Owner");
          _;
        }
    
    function mint (address to,uint256 amount) public onlyOwner{
        balanceOf[to]+= amount;
        totalSupply+= amount;
    }


  function transfer(address to, uint256 amount) public returns(bool){
           require(balanceOf[msg.sender]>=amount,"Insufficient balance");
           balanceOf[msg.sender]-= amount;
           balanceOf[to]+=amount;
             
           emit Transfer(msg.sender,to,amount);
           return true;
  }
    function approve(address spender,uint256 amount) public returns (bool){
             allowance[msg.sender][spender]= amount;
             return true;
    }
  function transferFrom(address from,address to, uint256 amount) public returns (bool){
          require(balanceOf[from]>=amount,"Insufficient balance");
          require(allowance[from][msg.sender] >= amount,"Allowance exceeded");
          balanceOf[from] -=amount;
          balanceOf[to] -= amount;
          allowance[from][msg.sender] -=amount;

    emit Transfer(from, to, amount);  
          return true;    
  }   
}