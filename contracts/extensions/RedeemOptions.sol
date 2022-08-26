// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import "./Redeemable.sol";

/// @title contract Redeemable
/// @author Olivier Fernandez / Frédéric Le Coidic for Āto
/// @dev This is a contract used to add options to redeemable

contract RedeemOptions is Redeemable {

	// Useful for scenarios such as redeemable physical object until the end of a period
	bool public optionDeadline = true; // false : disable deadline option
	mapping(uint256 => uint256) private _deadline; // deadline of redeem, 0 = infinity

	// Useful for scenarios such as redeemable physical object only once
	bool public optionRedeemOnce = true; // false : disable redeem once option

	constructor() {
	}

	/// @notice get deadline for a token
	/// @param tokenId id of token
	function getDeadline(uint256 tokenId) public view virtual returns (uint256) {
		return _deadline[tokenId];
	}

	/// @notice set deadline for a token
	/// @param tokenId id of token
	/// @param deadline last time to redeem
	/// @dev dont forget to add a require to lock to tokenId owner
	function setDeadline(uint256 tokenId, uint256 deadline) public virtual {
		require(super.isRedeemable(tokenId), "Token already redeem");
		require(optionDeadline, "Deadline option should be true for setting Deadline");
		require(deadline == 0 || deadline > block.timestamp, "Deadline should be in the future or 0");
		_deadline[tokenId] = deadline;
	}

	/// @notice get the redeemable status of a token
	/// @param tokenId id of token
	function isRedeemable(uint256 tokenId) public view virtual override returns (bool) {
		if (optionDeadline && _deadline[tokenId] != 0 && _deadline[tokenId] < block.timestamp) return false;
		return super.isRedeemable(tokenId);
	}

	/// @notice redeeem a token
	/// @param tokenId id of token to redeeem
	function redeem(uint256 tokenId) public virtual override {
		require(isRedeemable(tokenId), "Token already redeem");
		super.redeem(tokenId);
	}

	/// @notice set redeeemable status, true for redeemable only if optionRedeemOnce is false
	/// @param tokenId id of token
	/// @param status new redeeem status
	function _setRedeem(uint256 tokenId, bool status) internal virtual override {
		require(!(status && optionRedeemOnce), "Token can't be redeem more than once");
		super._setRedeem(tokenId, status);
	}
}
