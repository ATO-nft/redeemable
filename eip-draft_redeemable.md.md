---
eip: <to be assigned>
title: Redeemable
description: Redeemable NFT Extension
author: Olivier Fernandez (@fernandezOli), Frédéric Le Coidic (@FredLC29), Julien Béranger (@julienbrg)
discussions-to: <URL>
status: Draft
type: Standards Track
category (*only required for Standards Track): ERC
created: 2022-08-03
requires (*optional): [165](https://eips.ethereum.org/EIPS/eip-165), [721](https://eips.ethereum.org/EIPS/eip-721)
---

## Abstract

The Redeemable NFT Extension adds a `redeem` function to the ERC-721. It can be implemented when an NFT issuer wants his/her NFT to be redeemed for physical objects, tickets, on-chain assets, etc. Only the current NFT holder trigger the `redeem` function.

## Motivation

_The motivation section should describe the "why" of this EIP. What problem does it solve? Why should someone want to implement this standard? What benefit does it provide to the Ethereum ecosystem? What use cases does this EIP address?_

More and more NFT issuers (artists, fine art galeries, auction houses, brands, ...) want to enable people to redeem their NFTs for physical objects, tickets or on-chain assets. To date, there is no way to verify if a given NFT was redeemed or not. The Redeemable NFT Extension allows anyone to verify this by triggering the `isRedeemable` function of a given NFT Solidity contract.

The `isRedeemable` function is accessible to everyone so the proposal increases the overall transparency within the NFT ecosystem. It also improves the NFT user experience because what you have access to becomes more readable and clearer. Holders can keep their NFT after they redeemed it, which is a frequently requested feature.

The delivery of physical objects can be incentivized but not enforced on-chain, but the `redeem` function can trigger the transfer of on-chain assets or a framed 'switch' of the metadata ('dynamic' NFTs).

## Specification

_The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in RFC 2119._

**ERC-721 compliant contracts MAY implement this ERC for reedemable to provide a standard method of receiving reedemable information**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import '@openzeppelin/contracts/utils/introspection/ERC165.sol';

/**
 * @dev Implementation of redeemable for 721s
 *
 */

interface IRedeemable is ERC165 {
	/*
	 * ERC165 bytes to add to interface array - set in parent contract implementing this standard
	 *
	 * bytes4 private constant _INTERFACE_ID_ERC721REDEEM = 0x2f8ca953;
	 * _registerInterface(_INTERFACE_ID_ERC721REDEEM);
	 */
	function isRedeemable(uint256) external view returns (bool);
	function redeem(uint256) external;
}
```

### Examples

**Deploying an ERC-721 with reedemable**
```   
constructor (string memory name, string memory symbol)  public {
	_name = name;
	_symbol = symbol;
	// register the supported interfaces to conform to ERC721 via ERC165
	// Reedemable interface 
	_registerInterface(_INTERFACE_ID_ERC721REDEEM);
}
```
**Checking if the NFT being purchased/sold on your marketplace implemented reedemable**
```  
function checkReedemable(address _token) internal  returns(bool){
	bool success = address(_token).call(abi.encodeWithSignature("supportsInterface()"));  (a modifier)
	return success;
}
```


## Rationale

_The rationale fleshes out the specification by describing what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work, e.g. how the feature is supported in other languages._

### Emitting event for payment
Choosing to emit an event for redeem (ajout explication)

- `redeem`
- `isRedeemable`
- Date d'expiration (option) (a supprimer)
- Once (option) (a supprimer)

## Backwards Compatibility

This standard is compatible with current ERC-721 standard.

## Reference Implementation

_An optional section that contains a reference/example implementation that people can use to assist in understanding or implementing this specification. If the implementation is too large to reasonably be included inline, then consider adding it as one or more files in `../assets/eip-####/`._

À choisir :

- Minifolio
- Āto
- Metadata switch

## Security Considerations

There are no security considerations directly related to the implementation of this standard.

## Copyright

Copyright and related rights waived via [GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/).

---

Example of EIP-2981: https://eips.ethereum.org/EIPS/eip-2981
