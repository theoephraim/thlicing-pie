## PieOrg Contracts

![](https://github.com/okwme/truffle-shavings/blob/master/box-img-lg.png?raw=true)
### Truffle Boilerplate forked from truffle-shavings, with solium, linguist, zeppelin, migrations, tests &tc

## Install
```
yarn

// run truffle develop to see your mnemonic
yarn dev

// then create a .env file that looks like this:
TRUFFLE_MNEMONIC=yourTruffleMnemonic
GANACHE_MNEMONIC=grid voyage cream cry fence load stove sort grief fuel room save
TESTNET_MNEMONIC=a twelve word mnemonic phrase that works with some test network buddy
INFURA_API_KEY=yOUrInfURaKEy

```

## Run
```
yarn lint:watch
```

## Test
```
truffle develop
yarn test
```

## Deploy
```
truffle develop
yarn deploy --network develop

// this just runs truffle migrate --reset --compile-all
```
