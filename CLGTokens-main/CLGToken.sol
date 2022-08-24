// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./BEP20.sol";

contract CLGToken is BEP20 {
    constructor() BEP20("Crypto League Gaming", "CLG") {
         _mint(msg.sender, 100000000  * (10 ** uint256(decimals())));
    }
}