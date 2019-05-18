var PieOrg = artifacts.require('./PieOrg.sol')
let _ = '        '

module.exports = (deployer, helper, accounts) => {

  deployer.then(async () => {
    try {
      // Deploy PieOrg.sol
      console.log("Nothing deployed")
    } catch (error) {
      console.log(error)
    }
  })
}
