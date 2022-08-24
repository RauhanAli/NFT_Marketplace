/* eslint-disable jsx-a11y/alt-text */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Image from 'next/image'


import {
    nftAddress,nftMarketAddress
}from  '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import { Router } from 'next/router'

export default function CreatorDashboard() {
    const [nfts, setNfts] = useState([])
    const [sold, setSold] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
      loadNFTs()
    }, [])
    async function loadNFTs() {
      const web3Modal = new Web3Modal({
        // network: 'mainnet',
        // cacheProvider: true,
      })
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
  
      const marketContract = new ethers.Contract(nftMarketAddress, NFTMarketplace.abi, signer)
      const tokenContract = new ethers.Contract(nftAddress,NFT.abi,provider)
      const data = await marketContract.fetchItemsListed()
  
      const items = await Promise.all(data.map(async i => {
        const tokenUri = await contract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
        }
        return item
        Router.push('/dashboard');
      }))
      const soldItems = items.filter(i => i.sold)
       setSold(soldItems)
      setNfts(items)
      setLoadingState('loaded') 
    }
    if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No NFTs listed</h1>)
    return (
      <div>
        <div className="p-4">
          <h2 className="text-2xl py-2">Items Listed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {
              nfts.map((nft, i) => (
                <div key={i} className="border shadow rounded-xl overflow-hidden">
                  <Image src={nft.image} className="rounded" />
                  <div className="p-4 bg-black">
                    <p className="text-2xl font-bold text-white">Price - {nft.price} CLG</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <div className='px-4'>
            {
                Boolean(sold.length)&& (
                    <div>
                         <h2 className="text-2xl py-2">Items Sold</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {
              sold.map((nft, i) => (
                <div key={i} className="border shadow rounded-xl overflow-hidden">
                  <Image src={nft.image} className="rounded" />
                  <div className="p-4 bg-black">
                    <p className="text-2xl font-bold text-white">Price - {nft.price} CLG</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
          )
        }
        </div>     
      </div>
    )
  }