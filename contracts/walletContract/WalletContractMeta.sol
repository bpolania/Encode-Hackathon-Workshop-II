// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract WalletContract {
    // Store the contract addresses
    mapping(address => address) public contracts;

    // Create a mapping to hold the nonces for each address
    mapping(address => uint) nonces;

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

    function executeMetaTransaction(bytes32 r, bytes32 s, uint8 v, bytes4 functionSignature, bytes memory data) public {
        // Construct the MetaTransaction hash
        bytes32 metaTxHash = keccak256(abi.encodePacked(nonces[msg.sender], functionSignature, data));
        bytes32 messageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", metaTxHash));

        // Recover the signer's address
        address signer = ecrecover(messageHash, v, r, s);
        require(signer == msg.sender, "Invalid signature");

        // Get the contract associated with the signer
        address userContract = contracts[signer];
        require(userContract != address(0), "No contract found");

        // Construct calldata for the function call
        bytes memory cdata = abi.encodePacked(functionSignature, data);

        // Forward the transaction to the contract
        (bool success,) = userContract.call(cdata);
        require(success, "Transaction execution failed");

        // Increment the nonce for the signer
        nonces[signer]++;
    }

}
