import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
//import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC721Redeemable", function () {
	// We define a fixture to reuse the same setup in every test.
	// We use loadFixture to run this setup once, snapshot that state,
	// and reset Hardhat Network to that snapshopt in every test.
	async function deployOneYearLockFixture() {

		// Contracts are deployed using the first signer/account by default
		const [owner, otherAccount] = await ethers.getSigners();

		const Lock = await ethers.getContractFactory("ERC721Redeemable");
		const lock = await Lock.deploy("ERC721Redeem", "ERC721R");

		return { lock, owner, otherAccount };
	}

	describe("Deployment", function () {
		it("Should set the right owner", async function () {
			const { lock, owner } = await loadFixture(deployOneYearLockFixture);
			expect(await lock.owner()).to.equal(owner.address);
		});
		it("Should set the right interfaceId", async function () {
			const { lock } = await loadFixture(deployOneYearLockFixture);
			expect(await lock.supportsInterface("0x2f8ca953")).to.be.true;
		});
	});

	describe("isRedeemable", function () {
		it("Check isRedeemable", async function () {
			const { lock } = await loadFixture(deployOneYearLockFixture);
			expect(await lock.isRedeemable(1)).to.be.true;
		});
		it("Revert isRedeemable for nonexistent token", async function () {
			const { lock } = await loadFixture(deployOneYearLockFixture);
			expect(lock.isRedeemable(2)).to.be.reverted;
		});
	});

	describe("Redeem", function () {
		it("Revert Redeem for nonexistent token", async function () {
			const { lock } = await loadFixture(deployOneYearLockFixture);
			expect(lock.redeem(2)).to.be.reverted;
		});
		it("Revert Redeem for invalid owner", async function () {
			const { lock, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);
			expect(lock.connect(otherAccount).redeem(1)).to.be.reverted;
		});
		it("Check Redeem", async function () {
			const { lock } = await loadFixture(deployOneYearLockFixture);
			expect(await lock.isRedeemable(1)).to.be.true;
			await lock.redeem(1);
			expect(await lock.isRedeemable(1)).to.be.false;
		});
		it("Check Redeem event", async function () {
			const { lock, owner } = await loadFixture(deployOneYearLockFixture);
			expect(await lock.redeem(1)).to.emit(lock, "redeem").withArgs(owner.address, 1);
			expect(await lock.isRedeemable(1)).to.be.false;
		});
	});

	describe("Transfert", function () {
		it("Check Redeem after transfert", async function () {
			const { lock, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);
			expect(await lock.isRedeemable(1)).to.be.true;
			await lock.transferFrom(owner.address, otherAccount.address, 1);
			expect(lock.redeem(1)).to.be.reverted;
			expect(await lock.connect(otherAccount).redeem(1)).to.emit(lock, "redeem").withArgs(otherAccount.address, 1);
			expect(await lock.isRedeemable(1)).to.be.false;
		});
	});
});
