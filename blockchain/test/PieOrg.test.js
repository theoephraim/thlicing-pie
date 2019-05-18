var PieOrg = artifacts.require('./PieOrg.sol')
var BigNumber = require('bignumber.js')
let gasPrice = 1000000000 // 1GWEI

let _ = '        '

contract('PieOrg', async function(accounts) {
  let pieOrg

  before(done => {
    ;(async () => {
      try {
        var totalGas = new BigNumber(0)

        // Deploy PieOrg.sol
        pieOrg = await PieOrg.new("TestOrg")
        var tx = await web3.eth.getTransactionReceipt(pieOrg.transactionHash)
        totalGas = totalGas.plus(tx.gasUsed)
        console.log(_ + tx.gasUsed + ' - Deploy pieOrg')

        console.log(_ + '-----------------------')
        console.log(_ + totalGas.toFormat(0) + ' - Total Gas')
        done()
      } catch (error) {
        console.error(error)
        done(false)
      }
    })()
  })

  describe('PieOrg.sol', function() {

    it('should deploy ok', async function() {
      assert(
        true === true,
        'this is true'
      )
    })
    it('should be named as expected', async function() {
      var name = await pieOrg.orgName.call();
      assert(
        name === "TestOrg",
        `Name was ${name}, not TestOrg`
      )
    })

  })
})

function getBlockNumber() {
  return new Promise((resolve, reject) => {
    web3.eth.getBlockNumber((error, result) => {
      if (error) reject(error)
      resolve(result)
    })
  })
}

function increaseBlocks(blocks) {
  return new Promise((resolve, reject) => {
    increaseBlock().then(() => {
      blocks -= 1
      if (blocks == 0) {
        resolve()
      } else {
        increaseBlocks(blocks).then(resolve)
      }
    })
  })
}

function increaseBlock() {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync(
      {
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: 12345
      },
      (err, result) => {
        if (err) reject(err)
        resolve(result)
      }
    )
  })
}

function decodeEventString(hexVal) {
  return hexVal
    .match(/.{1,2}/g)
    .map(a =>
      a
        .toLowerCase()
        .split('')
        .reduce(
          (result, ch) => result * 16 + '0123456789abcdefgh'.indexOf(ch),
          0
        )
    )
    .map(a => String.fromCharCode(a))
    .join('')
}
