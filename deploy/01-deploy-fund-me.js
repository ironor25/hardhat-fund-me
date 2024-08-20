//traditionally 
//import 
//main function
//calling of main function

const { getNamedAccounts, deployments, network } = require("hardhat")
const {networkConfig, developmentChains} = require("../helper-hardhat-config")
const{ verify} = require("../utils/verify")
require("dotenv").config()
//method 1":
// function deployFunction(hre){
//     console.log("hi")
    //hre.getNamedAccounts()
    //hre.deployments()

//     }
// module.exports.default =deployFunction

//method 2 : creating a nameless function using async
// module.exports = async (hre) => {//hre is hardhat run time environment
//         const{ getNamedAccounts ,deployment }= hre //here we are pulling out htose things out of hre.
          
// }  

//method :3
//javascript has syntatic sugar notation means
module.exports = async({getNamedAccounts,deployments})=>{
    const {deploy ,log} = deployments
    const { deployer} = await getNamedAccounts() //get named accoutns is to get all the accounts whihc are in config.js
    //do for in hardhat config line 31 there can be several accounts which are just private keys which you won't be able to identify.
    //for taht we create a nameaccount section in hardhat config
    const chainId = network.config.chainId
    // what we wanna do it here is 
    //if this chainid use this address
    //if this is chainid use this address
    // to ddo this we creaqted  helper-hardhat-config.js refer to that
    //const ethUsdAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress 
    if (developmentChains.includes(network.name)){//this for development chain
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address

    }
    else{//this is for not in development chain
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    
    //earlier what we need to do is to get the datafeed we need to get the hardcoded contract address
    //hardcode matlab ki valriable = value

    //here mocking comes in which simulating a duplicate object of real object.
    //mockingis for those when a contract address doesn't really have that price feed.
    //if contract doesn't exist ,we deploy a minimal version of our local testing.
    //when going to localhist or hardhat network we want to use a mock.
    
    //now what we are going to do is make an aother section of this data feed to get data and use it as a parameter.
    //for that we need to do refactoring that is changing the previous code of contract the way it works.
   //now what we are doing is making this program to be executeble for all chain contract addresses.

    //previuosly we were using contractfactory to deploy
    const args = [ethUsdPriceFeedAddress]
    const fundMe =  await deploy("FundMe"/*contract name8*/ ,{
        /*list of overrides or functionalities that we  want*/
        from : deployer, //who is deploying this address
        args : args, // all the arguements that are going to give to the contract.
        log:true, // all the custom console log stuff.
        waitConfirmations: network.config.blockConfirmations,
        })
           
        if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){//if the name of network is not development  chain.wee will verify
            //we are not gonna put verify code over here to make it happen 
            //we created utils forlder.
            await verify(fundMe.address,args)
        }
}  
module.exports.tags  = ["all","fundme"]