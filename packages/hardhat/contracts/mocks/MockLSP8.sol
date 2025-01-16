// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { LSP8IdentifiableDigitalAsset as LSP8 } from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import { _LSP4_TOKEN_TYPE_NFT } from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import { _LSP8_TOKENID_FORMAT_NUMBER, _LSP8_TOKEN_METADATA_BASE_URI } from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";

contract MockLSP8 is LSP8 {
    constructor(
        string memory _name,
        string memory _symbol,
        address _owner
    ) LSP8(_name, _symbol, _owner, _LSP4_TOKEN_TYPE_NFT, _LSP8_TOKENID_FORMAT_NUMBER) {}

    function mint(address _to) external {
        uint256 tokenId = ++_existingTokens;
        _mint(_to, bytes32(tokenId), false, "");
    }
}
