// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

contract UpgradeableContractV2 is Initializable {
    IERC20Upgradeable public token;
    uint256 public newVariable;

    function initializeV2(IERC20Upgradeable _token, uint256 _newVariable) public initializer {
        token = _token;
        newVariable = _newVariable;
    }
}
