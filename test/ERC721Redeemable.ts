import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("=== ERC721Redeemable ===", function () {
	async function deployRedeemableERC721() {

		// Contracts are deployed using the first signer/account by default
		const [owner, otherAccount] = await ethers.getSigners();

		const Contract = await ethers.getContractFactory("ERC721Redeemable");
		const contract = await Contract.deploy("ERC721Redeem", "ERC721R");

		return { contract, owner, otherAccount };
	}

	describe("Deployment", function () {
		it("Should set the right owner", async function () {
			const { contract, owner } = await loadFixture(deployRedeemableERC721);
			expect(await contract.owner()).to.equal(owner.address);
		});
		it("Should set the right interfaceId", async function () {
			const { contract } = await loadFixture(deployRedeemableERC721);
			expect(await contract.supportsInterface("0x2f8ca953")).to.be.true;
		});
	});

	describe("isRedeemable", function () {
		it("Checks isRedeemable", async function () {
			const { contract } = await loadFixture(deployRedeemableERC721);
			expect(await contract.isRedeemable(1)).to.be.true;
		});
		it("Reverts isRedeemable for nonexistent token", async function () {
			const { contract } = await loadFixture(deployRedeemableERC721);
			expect(contract.isRedeemable(2)).to.be.reverted;
		});
	});

	describe("Redeem", function () {
		it("Reverts Redeem for nonexistent token", async function () {
			const { contract } = await loadFixture(deployRedeemableERC721);
			expect(contract.redeem(2)).to.be.reverted;
		});
		it("Reverts Redeem for invalid owner", async function () {
			const { contract, owner, otherAccount } = await loadFixture(deployRedeemableERC721);
			expect(contract.connect(otherAccount).redeem(1)).to.be.reverted;
		});
		it("Checks Redeem", async function () {
			const { contract } = await loadFixture(deployRedeemableERC721);
			expect(await contract.isRedeemable(1)).to.be.true;
			await contract.redeem(1);
			expect(await contract.isRedeemable(1)).to.be.false;
		});
		it("Checks Redeem event", async function () {
			const { contract, owner } = await loadFixture(deployRedeemableERC721);
			expect(await contract.redeem(1)).to.emit(contract, "redeem").withArgs(owner.address, 1);
			expect(await contract.isRedeemable(1)).to.be.false;
		});
	});

	describe("Transfer", function () {
		it("Checks Redeem after transfer", async function () {
			const { contract, owner, otherAccount } = await loadFixture(deployRedeemableERC721);
			expect(await contract.isRedeemable(1)).to.be.true;
			await contract.transferFrom(owner.address, otherAccount.address, 1);
			expect(contract.redeem(1)).to.be.reverted;
			expect(await contract.connect(otherAccount).redeem(1)).to.emit(contract, "redeem").withArgs(otherAccount.address, 1);
			expect(await contract.isRedeemable(1)).to.be.false;
		});
	});
});
