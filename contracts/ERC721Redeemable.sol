// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./Redeemable.sol";

/// @title Example ERC721 contract with Redeemable
/// @author Olivier Fernandez / Frédéric Le Coidic for Āto
/// @dev This is a contract used to add redeemable support to ERC721

/**
 * @dev ERC721 token with redeemable.
 *
 * Useful for scenarios such as redeemable physical object
 */
contract ERC721Redeemable is ERC721, Redeemable, Ownable {
	/**
	 * @dev See {Redeemable-redeem}.
	 *
	 * Requirements:
	 *
	 * - the NFT owner must be the msg sender.
	 */
   	constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
		_safeMint(msg.sender, 1);
	}

	function isRedeemable(uint256 tokenId) public view virtual override returns (bool) {
		require(_exists(tokenId), "ERC721Redeemable: Redeem query for nonexistent token");
		return super.isRedeemable(tokenId);
	}

	function redeem(uint256 tokenId) public virtual override {
		require(_exists(tokenId), "ERC721Redeemable: Redeem query for nonexistent token");
		require(ownerOf(tokenId) == msg.sender, "ERC721Redeemable: You are not the owner of this token");
		super.redeem(tokenId);
	}

	function supportsInterface(bytes4 interfaceId) public view override(ERC721, Redeemable) returns (bool) {
		return super.supportsInterface(interfaceId);
	}
}