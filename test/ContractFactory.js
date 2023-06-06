const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ContractFactory", function() {
  let owner;
  let simpleContract;
  let contractFactory;
  let contractBytecode;
  let initData;

  beforeEach(async function() {
    [owner] = await ethers.getSigners();
    
    const SimpleContract = await ethers.getContractFactory("SimpleContract");
    simpleContract = await SimpleContract.deploy();
    await simpleContract.deployed();

    const ContractFactory = await ethers.getContractFactory("ContractFactory");
    contractFactory = await ContractFactory.deploy();
    await contractFactory.deployed();

    // Get bytecode of SimpleContract
    contractBytecode = SimpleContract.bytecode;

    // Create data for initialization of SimpleContract
    initData = SimpleContract.interface.encodeFunctionData("initialize", [123]);

    await contractFactory.createContract(contractBytecode, initData);
  });

  it("Should deploy SimpleContract correctly", async function() {
    let deployedContractAddress = await contractFactory.contracts(owner.address);
    
    expect(deployedContractAddress).to.not.equal(ethers.constants.AddressZero);

    const deployedContract = simpleContract.attach(deployedContractAddress);
    expect(await deployedContract.value()).to.equal(123);
  });

  it("Should return correct contract address for the owner", async function() {
    let deployedContractAddress = await contractFactory.contracts(owner.address);

    const contractFromGetContract = await contractFactory.getContract(owner.address);

    // Comparing the obtained address with the address stored in the mapping
    expect(contractFromGetContract).to.equal(deployedContractAddress);
  });
});
