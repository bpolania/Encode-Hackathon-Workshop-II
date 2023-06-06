// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract ContractFactory {
    // Store the contract addresses
    mapping(address => address) public contracts;

    // Deploy a new contract
    function createContract(bytes memory bytecode, bytes memory data) public {
        address clone;

        // This code deploys a new contract using the provided bytecode
        assembly {
            clone := create(0, add(bytecode, 0x20), mload(bytecode))
        }

        // Check that contract deployment was successful
        require(clone != address(0), "Failed to deploy contract");

        // Initialize contract with provided data
        (bool success,) = clone.call(data);

        // Check that contract initialization was successful
        require(success, "Failed to initialize contract");

        contracts[msg.sender] = clone;
    }

    // Get the address of a contract deployed for a user
    function getContract(address user) external view returns (address) {
        return contracts[user];
    }
}
