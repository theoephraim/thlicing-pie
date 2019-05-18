pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol';


/**
 * The PieOrg contract does it all
 */
contract PieOrg is ERC20, ERC20Detailed {

    string public orgName;

    constructor(string memory _orgName) ERC20Detailed(orgName, "SLICE", 18) public {
        require(bytes(_orgName).length > 0);
        orgName = _orgName;
    }

}
