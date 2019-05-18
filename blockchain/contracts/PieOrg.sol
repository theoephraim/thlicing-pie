pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

/**
 * The PieOrg contract does it all
 */
contract PieOrg is ERC20, ERC20Detailed {
    string public orgName;

    mapping (address => bool) private _accountIsTracked;
    mapping (address => uint) private _trackedAccountIndex;

    struct TrackedAccount {
        address accountAddress;
        uint accountBalance;
    }

    TrackedAccount[] public trackedAccounts;

    constructor(string memory _orgName) public ERC20Detailed(_orgName, "SLICE", 18) {
        require(bytes(_orgName).length > 0, "Org name must be nonempty");
        orgName = _orgName;
        _mint(msg.sender, 1);
    }

    modifier onlyMember() {
        require(balanceOf(msg.sender) > 0, "Msg sender must own a slice");
        _;
    }

    function makeMintProposal(string memory metadata, address mintToAddress, uint256 mintAmount) public onlyMember {

    }

    //TODO: add re-entrancy protection to this later?
    function makeSpendProposal(string memory metadata, address spendToAddress, uint256 spendAmount) public onlyMember  {

    }

    function makeDividendProposal(string memory metadata, uint256 dividendAmount) public onlyMember {

    }

    function voteProposal(uint256 proposalID, bool vote) public onlyMember {

    }

    function burnTokens(uint256 tokenAmount) public onlyMember {

    }

    function getTrackedAccountsLength() public view returns (uint) {
        return trackedAccounts.length;
    }

    function getTrackedAccounts() public view returns(address[] memory, uint[] memory) {
        uint allAccountsLength = getTrackedAccountsLength();
        address[] memory allAccountAddresses = new address[](allAccountsLength);
        uint[] memory allAccountBalances = new uint[](allAccountsLength);
        for (uint i = 0; i < allAccountsLength; i++) {
            allAccountAddresses[i] = trackedAccounts[i].accountAddress;
            allAccountBalances[i] = trackedAccounts[i].accountBalance;
        }
        return (allAccountAddresses, allAccountBalances);
    }

    function _mint(address account, uint256 value) internal {
        _trackAccount(account, value, true);
        super._mint(account, value);
    }

    function _trackAccount(address account, uint256 value, bool sign) internal {
        if(!_accountIsTracked[account]) {
            _accountIsTracked[account] = true;
            _trackedAccountIndex[account] = trackedAccounts.length;
            trackedAccounts.push(TrackedAccount(account, 0));
        }
        uint index = _trackedAccountIndex[account];
        TrackedAccount storage trackedAccount = trackedAccounts[index];
        if (sign) {
            trackedAccount.accountBalance = SafeMath.add(trackedAccount.accountBalance, value);
        }
        else {
            trackedAccount.accountBalance = SafeMath.sub(trackedAccount.accountBalance, value);

        }
    }

    function _transfer(address from, address to, uint256 value) internal {
        _trackAccount(from, value, false);
        _trackAccount(to, value, true);
        super._transfer(from, to, value);
    }

}
