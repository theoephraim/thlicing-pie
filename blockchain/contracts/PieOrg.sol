pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

/**
 * The PieOrg contract does it all
 */
contract PieOrg is ERC20, ERC20Detailed {
    uint yesThreshold = 70;
    uint noThreshold = 100 - yesThreshold;

    string public orgName;

    mapping (address => bool) private _accountIsTracked;
    mapping (address => uint) private _trackedAccountIndex;

    struct TrackedAccount {
        address accountAddress;
        uint accountBalance;
    }

    struct Proposal {
        address toAddress;
        uint amount;
        string metadata;
        uint proposalType;
        bool complete;
        bool success;
        uint lastCalculatedResult;
        mapping (address => bool) accountHasVoted;
        mapping (address => bool) accountVote;
    }

    TrackedAccount[] public trackedAccounts;
    Proposal[] public proposals;

    constructor(string memory _orgName) public ERC20Detailed(_orgName, "SLICE", 18) {
        require(bytes(_orgName).length > 0, "Org name must be nonempty");
        orgName = _orgName;
        _mint(msg.sender, 1);
    }

    modifier onlyMember() {
        require(balanceOf(msg.sender) > 0, "Msg sender must own a slice");
        _;
    }

    function makeProposal(address toAddress, uint256 amount, string memory metadata, uint proposalType) public onlyMember {
        proposals.push(Proposal(toAddress, amount, metadata, proposalType, false, false, 0));
    }

    function voteProposal(uint256 proposalID, bool vote) public onlyMember {
        Proposal storage proposal = proposals[proposalID];
        require(proposal.accountHasVoted[msg.sender] == false, "Error already voted");
        proposal.accountHasVoted[msg.sender] = true;
        proposal.accountVote[msg.sender] = vote;
        countProposal(proposalID);
    }

    function countProposal(uint256 proposalID) public onlyMember {
        Proposal storage proposal = proposals[proposalID];
        require(proposal.complete == false, "Proposal already complete");
        uint yesVotes = 0;
        uint noVotes = 0;
        for (uint i = 0; i < trackedAccounts.length; i++) {
            TrackedAccount storage trackedAccount = trackedAccounts[i];
            address accountAddress = trackedAccount.accountAddress;
            if (proposal.accountHasVoted[accountAddress]) {
                bool vote = proposal.accountVote[accountAddress];
                uint voteShares = trackedAccount.accountBalance;
                if(vote) {
                    yesVotes = SafeMath.add(yesVotes, voteShares);
                }
                else {
                    noVotes = SafeMath.add(noVotes, voteShares);
                }
            }
        }
        uint totalVotes = totalSupply();
        uint yesPercent = SafeMath.div(yesVotes, totalVotes);
        uint noPercent = SafeMath.div(noVotes, totalVotes);
        if (yesPercent >= yesThreshold) {
            _succeedProposal(proposalID);
        }
        if (noPercent >= noThreshold) {
            _failProposal(proposalID);
        }
    }

    function _succeedProposal(uint256 proposalID) private {
        Proposal storage proposal = proposals[proposalID];
        proposal.complete = true;
        proposal.success = true;
        if(proposal.proposalType == 0) {
            _processProposalMint(proposalID);
        }
        if(proposal.proposalType == 1) {
            _processProposalDividend(proposalID);
        }
        if(proposal.proposalType == 2) {
            _processProposalSpend(proposalID);
        }
    }

    function _processProposalMint(uint256 proposalID) private {
        Proposal storage proposal = proposals[proposalID];
        _mint(proposal.toAddress, proposal.amount);
    }

    function _processProposalDividend(uint256 proposalID) private {
        Proposal storage proposal = proposals[proposalID];
        require(false, "Not yet implemented dividends");
        //TODO...
    }

    //re-entrancy protection needed here?
    function _processProposalSpend(uint256 proposalID) private {
        Proposal storage proposal = proposals[proposalID];
        address payable payableAddress = address(uint160(proposal.toAddress));
        payableAddress.transfer(proposal.amount);
    }

    function _failProposal(uint256 proposalID) private {
        Proposal storage proposal = proposals[proposalID];
        proposal.complete = true;
        proposal.success = false;
    }

    function burnTokens(uint256 tokenAmount) public onlyMember {
        require(false, "Not yet implemented");
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
