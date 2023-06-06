const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("UpgradeableContract Upgrade", function () {
  let UpgradeableContractV1;
  let upgradeableContractV1;
  let UpgradeableContractV2;
  let upgradeableContractV2;
  let mockERC20;

  beforeEach(async function () {
    // Deploy the MockERC20 token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    console.log("Deploying MockERC20...");
    mockERC20 = await upgrades.deployProxy(MockERC20, [], {
    initializer: "initialize"
    });
    await mockERC20.deployed();
    console.log("MockERC20 deployed to:", mockERC20.address);

    // Deploy the UpgradeableContractV1
    UpgradeableContractV1 = await ethers.getContractFactory("UpgradeableContract");
    upgradeableContractV1 = await upgrades.deployProxy(UpgradeableContractV1, [mockERC20.address], { initializer: 'initialize' });

    // Deploy the UpgradeableContractV2
    UpgradeableContractV2 = await ethers.getContractFactory("UpgradeableContractV2");
    upgradeableContractV2 = await upgrades.upgradeProxy(upgradeableContractV1.address, UpgradeableContractV2, { initializer: 'initializeV2' });
  });

  it("Should upgrade the contract and retain the token address", async function () {
    // Check the initial token address
    expect(await upgradeableContractV1.token()).to.equal(mockERC20.address);

    // Upgrade the contract
    const upgradedContract = UpgradeableContractV2.attach(upgradeableContractV2.address);

    // Check the upgraded token address
    expect(await upgradedContract.token()).to.equal(mockERC20.address);
  });
});
