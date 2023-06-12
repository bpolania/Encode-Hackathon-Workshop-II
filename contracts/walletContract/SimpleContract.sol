// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract SimpleContract is AccessControl {
    uint256 public value;
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");
    uint256[] public blockList;

    function initialize(uint256 _value) public {
        value = _value;
        _setupRole(USER_ROLE, msg.sender);
    }

    function update() public {
        require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");
        blockList.push(block.number);
    }

    function getBlockList() public view returns(uint256[] memory) {
        return blockList;
    }
}
