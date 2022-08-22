---
eip: <to be assigned>
title: Redeemable
description: Redeemable NFT Extension
author: Olivier Fernandez (@fernandezOli), Frédéric Le Coidic (@FredLC29), Julien Béranger (@julienbrg)
discussions-to: <URL>
status: Draft
type: Standards Track
category: ERC
created: 2022-08-03
requires: [165](https://eips.ethereum.org/EIPS/eip-165), [721](https://eips.ethereum.org/EIPS/eip-721)
---

## Simple Summary

A standardized way to link a physical object to an NFT.

## Abstract

The Redeemable NFT Extension adds a `redeem` function to the ERC-721. It can be implemented when an NFT issuer wants his/her NFT to be redeemed for a physical object. Only the current NFT holder trigger the `redeem` function.

## Motivation

As of now, one can't link a physical object to an NFT. This standard allows NFTs that support ERC-721 interfaces to have a standardized way of signalling information on reedemability and verify if the NFT was redeemed or not.

More and more NFT issuers such as artists, fine art galeries, auction houses, brands and others want to offer a physical object to the holder of a given NFT.

Enabling everyone to unify on a single redeemable NFT standard will benefit the entire Ethereum ecosystem.

## Specification

The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in RFC 2119.

**ERC-721 compliant contracts MAY implement this ERC to provide a standard method of receiving information on reedemability.**

_The Redeemable NFT Extension allows anyone to verify this by triggering the `isRedeemable` function of a given NFT._

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import '@openzeppelin/contracts/utils/introspection/ERC165.sol';

/**
 * @dev Implementation of Redeemable for ERC-721s
 *
 */

interface IRedeemable is ERC165 {
	/*
	 * ERC165 bytes to add to interface array - set in parent contract implementing this standard
	 *
	 * bytes4 private constant _INTERFACE_ID_ERC721REDEEM = 0x2f8ca953;
	 */

	/// @dev This event emits when a token is redeemed.
	/// So that the third-party platforms such as NFT market could
	/// timely update the redeemable status of the NFT.
	event Redeem(address indexed from, uint256 indexed tokenId);

	/// @notice Returns the redeem status of a token
	/// @param tokenId Identifier of the token.
	function isRedeemable(uint256 _tokenId) external view returns (bool);

	/// @notice Redeeem a token
	/// @param tokenId Identifier of the token to redeeem
	function redeem(uint256 _tokenId) external;
}
```

The Redeem event is emitted when redeem.

## Rationale

_The rationale fleshes out the specification by describing what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work, e.g. how the feature is supported in other languages._

// ...

### Emitting event for payment

Choosing to emit an event for redeem (ajout explication)

- `redeem`
- `isRedeemable`

## Backwards Compatibility

This standard is compatible with current ERC-721 standard.

## Reference Implementation

**Deploying an ERC-721 with reedemable**

Implementers of this standard MUST have all of the following functions:

```
contract ERC721Redeemable is ERC721, Redeemable {
    /**
     * @dev See {Redeemable-redeem}.
     *
     * Requirements:
     *
     * - the NFT owner must be the msg sender.
     */
   	constructor(string memory name, string memory symbol) ERC721(name, symbol) {
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
```

**Checking if the NFT being purchased/sold on your marketplace implemented reedemable**

```
function checkReedemable(address _token) internal  returns(bool){
	bool success = address(_token).call(abi.encodeWithSignature("supportsInterface()"));  (a modifier)
	return success;
}
```

## Security Considerations

There are no security considerations directly related to the implementation of this standard.

## Copyright

Copyright and related rights waived via [GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/).
