// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import { LSP7DigitalAsset as LSP7 } from "@lukso/lsp7-contracts/contracts/LSP7DigitalAsset.sol";

import { _LSP4_TOKEN_TYPE_TOKEN } from "@lukso/lsp4-contracts/contracts/LSP4Constants.sol";

contract MockLSP7 is LSP7 {
    constructor(
        string memory _name,
        string memory _symbol,
        address _owner
    ) LSP7(_name, _symbol, _owner, _LSP4_TOKEN_TYPE_TOKEN, true) {}

    function mint(address _to, uint256 _amount) external {
        _mint(_to, _amount, false, "");
    }
}
