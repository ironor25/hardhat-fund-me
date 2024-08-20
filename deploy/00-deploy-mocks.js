//this is the file to deploy mocks in the program .
const {network } = require("hardhat")
const{developmentChains,DECIMALS,INITIAL_ANSWER} = require("../helper-hardhat-config")


module.exports = async({getNamedAccounts,deployments})=>{
    const {deploy ,log} = deployments
    const { deployer} = await getNamedAccounts() //get named accoutns is to get all the accounts whihc are in config.js


    if (developmentChains.includes(network.name)){
        log("LOcal network detected! Deploying mocks...")
        await deploy("MockV3Aggregator",{
            contract :"MockV3Aggregator",
            from: deployer,
            log: true, //this means it give whole things like txid ,deployed at ,gas etc.
            args: [DECIMALS,INITIAL_ANSWER]
     })
        log("Mocks deployed!")
        log("--------------------------------------------------------------")
    }
   
}

//this is for to run mock only.
module.exports.tags = ["all","mocks"]