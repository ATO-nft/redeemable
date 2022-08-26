import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("=== ERC721RedeemURIOptions ===", function () {
	async function deployRedeemableOptionsERC721() {

		// Contracts are deployed using the first signer/account by default
		const [owner, otherAccount] = await ethers.getSigners();
		const name = "Black Thistle";
		const symbol = "THISTLE";
		const uri = "https://ipfs.io/ipfs/redeemableURI/metadata.json";
		const uriRedeemed = "https://ipfs.io/ipfs/redeemedURI/metadata.json";
	
		const Contract = await ethers.getContractFactory("ERC721RedeemURIOptions");
		const contract = await Contract.deploy(name, symbol, uri, uriRedeemed);

		return { contract, owner, otherAccount, uri, uriRedeemed };
	}

	describe("Deployment", function () {
		it("Should set the right owner", async function () {
			const { contract, owner } = await loadFixture(deployRedeemableOptionsERC721);
			expect(await contract.owner()).to.equal(owner.address);
		});
		it("Should set the right interfaceId", async function () {
			const { contract } = await loadFixture(deployRedeemableOptionsERC721);
			expect(await contract.supportsInterface("0x2f8ca953")).to.be.true;
		});
	});

	describe("isRedeemable", function () {
		it("Checks isRedeemable", async function () {
			const { contract } = await loadFixture(deployRedeemableOptionsERC721);
			expect(await contract.isRedeemable(1)).to.be.true;
		});
		it("Reverts isRedeemable for nonexistent token", async function () {
			const { contract } = await loadFixture(deployRedeemableOptionsERC721);
			expect(contract.isRedeemable(2)).to.be.reverted;
		});
	});

	describe("Redeem", function () {
		it("Reverts Redeem for nonexistent token", async function () {
			const { contract } = await loadFixture(deployRedeemableOptionsERC721);
			expect(contract.redeem(2)).to.be.reverted;
		});
		it("Reverts Redeem for invalid owner", async function () {
			const { contract, otherAccount } = await loadFixture(deployRedeemableOptionsERC721);
			expect(contract.connect(otherAccount).redeem(1)).to.be.reverted;
		});
		it("Checks Redeem", async function () {
			const { contract } = await loadFixture(deployRedeemableOptionsERC721);
			expect(await contract.isRedeemable(1)).to.be.true;
			await contract.redeem(1);
			expect(await contract.isRedeemable(1)).to.be.false;
		});
		it("Checks Redeem event", async function () {
			const { contract, owner } = await loadFixture(deployRedeemableOptionsERC721);
			expect(await contract.redeem(1)).to.emit(contract, "redeem").withArgs(owner.address, 1);
			expect(await contract.isRedeemable(1)).to.be.false;
		});
	});

	describe("URI(s)", function () {
		it("Check uri(s)", async function () {
		  const { contract, uri, uriRedeemed } = await loadFixture(deployRedeemableOptionsERC721);
		  expect(await contract.isRedeemable(1)).to.be.true;
		  expect(await contract.tokenURI(1)).to.equal(uri);
		  // redeem
		  await contract.redeem(1);
		  expect(await contract.isRedeemable(1)).to.be.false;
		  expect(await contract.tokenURI(1)).to.equal(uriRedeemed);
		});
	});

	describe("Transfer", function () {
		it("Checks Redeem after transfer", async function () {
			const { contract, owner, otherAccount } = await loadFixture(deployRedeemableOptionsERC721);
			expect(await contract.isRedeemable(1)).to.be.true;
			await contract.transferFrom(owner.address, otherAccount.address, 1);
			expect(contract.redeem(1)).to.be.reverted;
			expect(await contract.connect(otherAccount).redeem(1)).to.emit(contract, "redeem").withArgs(otherAccount.address, 1);
			expect(await contract.isRedeemable(1)).to.be.false;
		});
	});

	describe("Option Deadline", function () {
		it("Checks option Deadline", async function () {
			const { contract } = await loadFixture(deployRedeemableOptionsERC721);
			expect(await contract.getDeadline(1)).to.equal(0);
		});
		it("Checks option setDeadline", async function () {
			const { contract } = await loadFixture(deployRedeemableOptionsERC721);
			expect(await contract.getDeadline(1)).to.equal(0);
			const ONE_DAY_IN_SECS = 24 * 60 * 60;
			const latestTime = await time.latest();

			// set Deadline in the past
			expect(contract.setDeadline(1, latestTime - ONE_DAY_IN_SECS)).to.be.revertedWith("Deadline should be in the future or 0");

			// set Deadline in the futur
			await contract.setDeadline(1, 0);
			expect(await contract.getDeadline(1)).to.equal(0);
			await contract.setDeadline(1, latestTime + ONE_DAY_IN_SECS);
			expect(await contract.getDeadline(1)).to.equal(latestTime + ONE_DAY_IN_SECS);
			expect(await contract.isRedeemable(1)).to.be.true;

			// We increase the time in Hardhat Network
			await time.increaseTo(latestTime + ONE_DAY_IN_SECS + 1);
			expect(await contract.isRedeemable(1)).to.be.false;
		});
	});

	describe("Option setRedeem", function () {
		it("Checks option setRedeem", async function () {
			const { contract } = await loadFixture(deployRedeemableOptionsERC721);
			expect(contract.setRedeem(1, true)).to.be.revertedWith("Token can't be redeem more than once");
		});
	});
});
