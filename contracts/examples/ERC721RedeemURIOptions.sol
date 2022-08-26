// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "../extensions/RedeemOptions.sol";
import "../extensions/RedeemableURIStorage.sol";

/// @title Example ERC721 contract with RedeemOptions
/// @author Olivier Fernandez and Julien Béranger for Āto
/// @dev This is a contract used to add redeemable support with options to ERC721

contract ERC721RedeemURIOptions is ERC721, RedeemOptions, RedeemableURIStorage, Ownable {

	/// @notice constructor
	/// @param _name name of ERC-721 token
	/// @param _symbol symbol of ERC-721 token
	/// @param _uri metadata of NFT when redeeemable
	/// @param _uriRedeemed metadata of NFT when not redeeemable
	constructor(
		string memory _name,
		string memory _symbol,
		string memory _uri,
		string memory _uriRedeemed
	) ERC721(_name, _symbol) {
		_safeMint(msg.sender, 1);
		_setTokenURI(1, _uri, _uriRedeemed);
	}

	function isRedeemable(uint256 tokenId) public view override(Redeemable, RedeemOptions) returns (bool) {
		require(_exists(tokenId), "Redeem query for nonexistent token");
		return super.isRedeemable(tokenId);
	}

	function redeem(uint256 tokenId) public override(Redeemable, RedeemOptions) {
		require(_exists(tokenId), "Redeem query for nonexistent token");
		require(ownerOf(tokenId) == msg.sender, "You are not the owner of this token");
		super.redeem(tokenId);
	}

	/// @notice set deadline for a token
	/// @param tokenId id of token
	/// @param deadline last time to redeem
	function setDeadline(uint256 tokenId, uint256 deadline) public override {
		require(_exists(tokenId), "Set deadline for nonexistent token");
		require(ownerOf(tokenId) == msg.sender, "You are not the owner of this token");
		super.setDeadline(tokenId, deadline);
	}

	/// @notice set redeeemable status, true for redeemable only if optionRedeemOnce is false
	/// @param tokenId id of token
	/// @param status new redeeem status
	function setRedeem(uint256 tokenId, bool status) public {
		require(_exists(tokenId), "Set redeeem for nonexistent token");
		require(ownerOf(tokenId) == msg.sender, "You are not the owner of this token");
		super._setRedeem(tokenId, status);
	}

	function tokenURI(uint256 tokenId)
		public
		view
		override(ERC721, RedeemableURIStorage)
		returns (string memory)
	{
		return super.tokenURI(tokenId);
	}

	function _setRedeem(uint256 tokenId, bool status)
		internal
		override(Redeemable, RedeemOptions)
	{
		super._setRedeem(tokenId, status);
	}

	function _burn(uint256 tokenId)
		internal
		override(ERC721, RedeemableURIStorage)
	{
		super._burn(tokenId);
	}

	function supportsInterface(bytes4 interfaceId) public view override(ERC721, Redeemable, RedeemableURIStorage) returns (bool) {
		return super.supportsInterface(interfaceId);
	}
}
