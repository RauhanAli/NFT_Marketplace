// @ts-nocheck
import React, { useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'
import Image from 'next/image'
import {create} from 'ipfs-http-client'
//import pinataSDK from '@pinata/sdk'
import {
    nftAddress,nftMarketAddress
}from  '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import IERC20 from '../artifacts/contracts/NFT.sol/IBEP20.json'

export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const router = useRouter()
  
    async function onChange(e) {
      const file = e.target.files[0]
      try {
        //const arrayBuffer = await selectedFile.arrayBuffer();

        const projectId = "";
        const projectSecret = "";

        const auth =
          "Basic " +
          Buffer.from(projectId + ":" + projectSecret).toString("base64");

        const options = {
          host: "ipfs",
          port: 5001,
          protocol: "https",
          headers: {
            authorization: auth,
          },
        };

        const client = create(options);

        //const added = await client.add(data)
        const result = await client.add(
          // path: "---",
          // content: file,
      
          file,
          {
            progress: (prog) => console.log(`received: ${prog}`)
          }
        );
        const url = `https://ipfs/${result.path}`
        setFileUrl(url)
      } catch (error) {
        console.log('Error uploading file: ', error)
      }  
    }
    async function nftItem() {
      const { name, description, price } = formInput
      if (!name || !description || !price || !fileUrl) return
      /* first, upload to IPFS */
      const data = JSON.stringify({
        name, description, image: fileUrl
      })
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();

        const projectId = "";
        const projectSecret = "";

        const auth =
          "Basic " +
          Buffer.from(projectId + ":" + projectSecret).toString("base64");

        const options = {
          host: "ipfs",
          port: 5001,
          protocol: "https",
          headers: {
            authorization: auth,
          },
        };

        const client = create(options);

        //const added = await client.add(data)
        const result = await client.add({
          path: "---",
          content: data,
        });
        const url = `https://ipfs/${result.path}`

        /* after file is uploaded to IPFS, return the URL to use it in the transaction */
        createSale(url)
      } catch (error) {
        console.log('Error uploading file: ', error)
      }  
      // const url = 'https://benjaminkor2.infura-ipfs.io/ipfs/QmRmPRoHfDBq1WZgk6Nmy2ofrmC5tXZ1iS3ZYq7BHHp7D3'
      // createSale(url)
    }

    async function createSale(url) {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      let contract  = new ethers.Contract(nftAddress,NFT.abi,signer);
      console.log(contract)
      const rate = 100000000000000000000
      const token = await contract.contractAddress()
      console.log(token)
      //contract.increaseAllowance(nftAddress,String(rate))
      const token1 = new ethers.Contract(token,IERC20,signer) 
      console.log(token1)
      //@ts-ignore
      token1?.increaseAllowance(nftAddress,String(rate))?.send({
          gasLimit: null,
          maxFee: null,
          maxPriority: null,
          to: nftAddress,
          from: token
        })
        .once("error", (err) => {
          console.log(err);
          setFeedback("Sorry, something went wrong please try again later.");
          setApprovingToken(false);
        })
        .then((receipt) => {
          console.log(receipt);
          setApprovedTokens(rate);
          setApprovingToken(false);
        });
     
      let transaction = await contract.createToken(url)
      let tx = await transaction.wait()
      let event = tx.events[0];
      let value = event.args[2];
      let tokenId = value.toNumber()
      /* next, create the item */
      const price = ethers.utils.parseUnits(formInput.price, 'ether')
      contract  = new ethers.Contract(nftMarketAddress,NFTMarketplace.abi,signer);
      let listingPrice = await contract.getListingPrice()
      listingPrice = listingPrice.toString()
      transaction = await contract.createMarketItem(nftAddress,tokenId,price,{value: listingPrice})
      await transaction.wait()
      router.push('/')
    }

    async function buyNFT(){
      const { name, description} = formInput
      if (!name || !description || !fileUrl) return
      /* first, upload to IPFS */
      const data = JSON.stringify({
        name, description, image: fileUrl
      })
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();

        const projectId = "";
        const projectSecret = "";

        const auth =
          "Basic " +
          Buffer.from(projectId + ":" + projectSecret).toString("base64");

        const options = {
          host: "ipfs.infura.io",
          port: 5001,
          protocol: "https",
          headers: {
            authorization: auth,
          },
        };

        const client = create(options);

        //const added = await client.add(data)
        const result = await client.add({
          path: "---",
          content: data,
        });
        //const added = await client.add(data)
        const url = `https://ipfs.infura.io/ipfs/${result.path}`
        /* after file is uploaded to IPFS, return the URL to use it in the transaction */
        mintNFT(url)
      } catch (error) {
        console.log('Error uploading file: ', error)
      }  
    }

    async function mintNFT(){
      const web3Modal = new web3Modal
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection) 
      const signer = provider.getSigner()
      let contract = new ethers.Contract(nftAddress,NFT.abi, signer)
      let cost = await contract.mintingRate()
      const token = contract.contractAddress()
      //const token1 = new Web3EthContract(IBEP20.abi, contract.contractAddress()); 
      const approveToken = Promise.resolve(token)
      approveToken.then((value)=>{
       value.increaseAllowance(nftAddress, String(cost))
      .send({
        gasLimit: null,
        maxFee: null,
        maxPriority: null,
        to: nftAddress,
        from: token
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setApprovingToken(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setApprovedTokens(rate);
        setApprovingToken(false);
      });
          console.log(value)
        });
      let transaction = await contract.mintNFT(url, {value: cost})
      await transaction.wait()
      router.push('/')
    }
  
    return (
      <div className="flex justify-center">
        <div className="w-1/2 flex flex-col pb-12">
          <input 
            placeholder="Asset Name"
            className="mt-8 border rounded p-4"
            onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
          />
          <textarea
            placeholder="Asset Description"
            className="mt-2 border rounded p-4"
            onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
          />
          <input
            placeholder="Asset Price in CLG"
            className="mt-2 border rounded p-4"
            onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
          />
          <input
            type="file"
            name="Asset"
            className="my-4"
            onChange={onChange}
          />
          {
            fileUrl && (
              
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image className="rounded mt-4" width="350" src={fileUrl} />
              
            )
          }
          <button onClick={nftItem} className="font-bold mt-4 bg-sky-500 text-white rounded p-4 shadow-lg">
            Create NFT
          </button>
          <button onClick={buyNFT} className="font-bold mt-4 bg-sky-500 text-white rounded p-4 shadow-lg">
            Buy NFT
          </button>
        </div>
      </div>
    )
  }