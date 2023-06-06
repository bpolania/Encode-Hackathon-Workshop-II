const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AdvancedContract", function () {
  let advancedContract;
  let owner;
  const initialBalance = ethers.utils.parseEther("10");

  before(async function () {
    const AdvancedContract = await ethers.getContractFactory("AdvancedContract");
    advancedContract = await AdvancedContract.deploy();
    await advancedContract.deployed();

    owner = await advancedContract.owner();
  });

  it("Should set the owner correctly", async function () {
    expect(owner).to.equal(owner);
  });

  it("Should deposit Ether correctly", async function () {
    const depositAmount = ethers.utils.parseEther("2");
    const initialOwnerBalance = await ethers.provider.getBalance(owner);
  
    const tx = await advancedContract.deposit({ value: depositAmount });
    const gasCost = (await tx.wait()).gasUsed.mul(tx.gasPrice);
  
    const balance = await advancedContract.balances(owner);
    expect(balance).to.equal(depositAmount);
  
    const finalOwnerBalance = await ethers.provider.getBalance(owner);
    const expectedOwnerBalance = initialOwnerBalance.sub(depositAmount).sub(gasCost);
    expect(finalOwnerBalance).to.equal(expectedOwnerBalance);
  });

  it("Should revert deposit if amount is zero", async function () {
    await expect(
      advancedContract.deposit({ value: ethers.utils.parseEther("0") })
    ).to.be.revertedWith("Amount must be greater than zero");
  });

  it("Should add numbers correctly", async function () {
    const result = await advancedContract.addNumbers(10, 20);
    expect(result).to.equal(30);
  });

  it("Should combine bytes correctly", async function () {
    const a = "0x1234";
    const b = "0x5678";
    const result = await advancedContract.combineBytes(a, b);
    expect(result).to.equal("0x12345678");
  });

  it("should perform a complex calculation using inline assembly", async function () {
    const x = 2;
    const y = 5;
    const expectedResult = 32;

    const result = await advancedContract.useAssembly(x, y);

    expect(result.toNumber()).to.equal(expectedResult);
  });
});
