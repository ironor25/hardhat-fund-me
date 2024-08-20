const { assert, expect } = require("chai")
const{deployments,ethers,getNamedAccounts} = require("hardhat")


describe("FundMe",async function(){//this is for entire contract
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1") //converts 1 eth to 10^18 wei
    beforeEach(async function () {
        //deploy our fundMe contract
        //using Hardhat-deploy
        // const accounts = await ethers.getSigners()
        // const account0 = accounts[0]
        
        
        await deployments.fixture(["all"]) //it deploy all the deploy forlder with as many tags as we want.
        //this "all" tag in evry deploy file was to to deploy everything in the file.
        fundMe = await ethers.getContract("FundMe") ///this will give most recent deployed fundme contract.
        deployer = (await getNamedAccounts() ).deployer
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator",deployer)
    })

    describe("constructor",async function () {
        it ("sets the aggregator addresses correctly",async function () {
            const response = await fundMe.getPriceFeed()
            assert.equal(response,mockV3Aggregator.address)
            
        })

//for each function defined in smarrt contract you need to define describe for each of them.
    })//this for only constructor
    describe("fund",async function () {
        it("Fails if you don't send enough ETH",async function () {
           // await expect(fundMe.fund())//this will give give error that we want but we don't want it to be shown
                await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!")     
        })
        it("updated the amount funded data structure",async function () {
            await fundMe.fund({value:sendValue})
            const response = await fundMe.getAddressToAmountFunded(deployer)//here getAddressToAmountFunded is a mapping in contract so if inout is address then it return value.
            assert.equal(response.toString(),sendValue.toString())   
        })
        it("Adds funder to array of funders",async function () {
            await fundMe.fund({value:sendValue})
            const response = await fundMe.getFunder(0)
            assert.equal(response,deployer)
        })
    })
    describe("withdraw",async function () {
        //we are making before each to give some balance t then only we will be able too withdraw fund and test it
        beforeEach(async function () {
            await fundMe.fund({value: sendValue})
        })
        it ("withdraw ETH from a single founder",async function () {
            //arrange the test : we wanna check we corectly withdrawing funds from contract
            const  startfundmeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            //act
            const trxresponse = await fundMe.withdraw()
            const trxreceipt = await trxresponse.wait(1)
            const {gasUsed ,effectiveGasPrice} = trxreceipt
            const gasCost = gasUsed.mul(effectiveGasPrice) 
            const endingFundingBalance  = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            //assert
            assert.equal(endingFundingBalance,0)//bca aal funds have been withdrawn
            assert.equal(
                startfundmeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString())
        })
        it("allow us to withdraw with multiple funders",async function () {
            //Arrange
            const accounts = await ethers.getSigners()
            for (let i= 1;i<6;i++){
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                )
                await fundMeConnectedContract.fund({value: sendValue})

            }
            const  startfundmeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            //act
            const trxresponse = await fundMe.withdraw()
            const trxreceipt = await trxresponse.wait(1)
            const {gasUsed ,effectiveGasPrice} = trxreceipt
            const gasCost = gasUsed.mul(effectiveGasPrice) 
            const endingFundingBalance  = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            //Assert 
            assert.equal(endingFundingBalance,0)//bca aal funds have been withdrawn
            assert.equal(
                startfundmeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString())
           
            //Make sure that the funders array are reset properly 
            await expect(fundMe.getFunder(0)).to.be.reverted

            for (i=0;i<6;i++){

                assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address),0)
            }
            
        })
        it ("Only allows the owner to withdraw",async function () {
            //this section for only owner withdrawal teest if some other person wants to withdraw he will be reverted.
            const accounts = ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnectedContract = await fundMe.connect(attacker)
            await expect(attackerConnectedContract.withdraw()).to.be.revertedWith("FundMe__NotOwner")
        })
    })
})