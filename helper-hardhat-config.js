const networkConfig = {
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    },
    137:{
        name:"polygon",
        ethUsdPriceFeed:"0xDf3f72Be10d194b58B1BB56f2c4183e661cB2114"

    }
    //same   for other chain too.
}
//this is happening because we don't want to deploy this contract on a testnet or mainnet.
//this is for local.
const developmentChains =["localhost","hardhat"]
//below both are made for mocks 
const DECIMALS =8
const INITIAL_ANSWER = 20000000000

module.exports ={networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER
}