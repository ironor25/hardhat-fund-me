const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const{deployer} = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe",deployer)
    console.log("Funding COntract...")
    const trxreponse = await fundMe.fund({
        value: ethers.utils.parseEther("1")

    })
    await trxreponse.wait(1)
    console.log("Funded!!")
}

main()
.then(()=> process.exit(0))
.catch((error)=> {
    console.error(error)
    process.exit(1)
})