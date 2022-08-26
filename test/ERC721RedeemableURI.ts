import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

/*
  URI redeemable contract : ERC721 with redeemable
*/
describe("=== ERC721RedeemableURI ===", function () {

  async function deployContractsFixture() {

    // Create signers
    const [issuer, acquirer] = await ethers.getSigners();

    // init data
    const name = "Black Thistle";
    const symbol = "THISTLE";
    const uri = "https://ipfs.io/ipfs/redeemableURI/metadata.json";
    const uriRedeemed = "https://ipfs.io/ipfs/redeemedURI/metadata.json";
    const mintNumber = 1;

    // Create instance of ERC721RedeemableURI.sol
    const RedeemableURI = await ethers.getContractFactory("ERC721RedeemableURI");
    const redeemableURI = await RedeemableURI.deploy(name, symbol, mintNumber, uri, uriRedeemed);
    await redeemableURI.deployed();

    return { issuer, acquirer, redeemableURI, name, symbol, uri, uriRedeemed, mintNumber };
  }

  describe("Deployment", function () {
    it("Should deploy redeemableURI.sol", async function () {
      const { redeemableURI, issuer } = await loadFixture(deployContractsFixture);
      expect(await redeemableURI.owner()).to.equal(issuer.address);
    });
    it("Check mintNumber", async function () {
      const { redeemableURI, mintNumber } = await loadFixture(deployContractsFixture);
      expect(await redeemableURI.totalSupply()).to.equal(mintNumber);
    });
  });

  describe("Redeemable", function () {
    it("Check Redeemable", async function () {
      const { redeemableURI } = await loadFixture(deployContractsFixture);
      expect(await redeemableURI.supportsInterface("0x2f8ca953")).to.be.true;
      expect(await redeemableURI.isRedeemable(1)).to.be.true;
    });
    it("Check uri(s)", async function () {
      const { redeemableURI, uri, uriRedeemed } = await loadFixture(deployContractsFixture);
      expect(await redeemableURI.isRedeemable(1)).to.be.true;
      expect(await redeemableURI.tokenURI(1)).to.equal(uri);
      // redeem
      await redeemableURI.redeem(1);
      expect(await redeemableURI.isRedeemable(1)).to.be.false;
      expect(await redeemableURI.tokenURI(1)).to.equal(uriRedeemed);
    });
  });
});
