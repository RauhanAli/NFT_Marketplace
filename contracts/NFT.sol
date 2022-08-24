
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";  
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

interface IBEP20{
     function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
       function approve(address spender, uint256 amount) external returns (bool);
       function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
        function balanceOf(address account) external view returns (uint256);
        function increaseAllowance(address spender, uint256 addedValue) external returns (bool);
         function decreaseAllowance(address spender, uint256 addedValue) external returns (bool);
}

contract NFT is ERC721URIStorage, Ownable{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    IBEP20 public contractAddress;
    address public marketContract;
    address payable nftowner;
   //  address private vtoken = 0xF80Ca04bE4Af887374e979a5D9242b95021961E1;
   //  address private vud = 0x6c13D85eb24D3697F5965bD723041F24125Dd14e;
    uint256 public mintingRate = 100 * 10 **18;
      event NFTMinted (
        uint256 indexed tokenId,
        string tokenURI
    );
     constructor(address _contractaddress, address marketAddress) ERC721("Crypto League Gaming", "CLGNFT") {
        contractAddress = IBEP20(_contractaddress);
        marketContract = marketAddress;
         nftowner = payable(msg.sender);
     }

     function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newitemId = _tokenIds.current();
         IBEP20(contractAddress).transferFrom(msg.sender,address(this),mintingRate);
        _mint(msg.sender,newitemId);
        _setTokenURI(newitemId, tokenURI);
         emit NFTMinted(newitemId, tokenURI);
        setApprovalForAll(marketContract, true);
        return newitemId;
     }
        function withdraw() public payable onlyOwner() {
        contractAddress.transfer(msg.sender,contractAddress.balanceOf(address(this)));
     }

}  