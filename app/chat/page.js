"use client"

import React, { useState, useEffect } from 'react';
import { Client, Wallet, AccountSetAsfFlags, AccountSetTfFlags } from 'xrpl';

export default function Chat() {
  
  // XRPL Client setup
  const [coldWalletInfo, setColdWalletInfo] = useState(null);
  const [hotWalletInfo, setHotWalletInfo] = useState(null);
  const [issueStatus, setIssueStatus] = useState('');
  const [bobWalletInfo, setBobWalletInfo] = useState(null);
  const [bobPaymentStatus, setBobPaymentStatus] = useState('');




    const connectAndIssueToken = async () => {
      const client = new Client('wss://s.altnet.rippletest.net:51233');
      try {
        await client.connect();

        // Create and fund a cold wallet (issuer)
        const coldWallet = Wallet.generate();
        await client.fundWallet(coldWallet);

        const coldSettingsTx = {
          TransactionType: "AccountSet",
          Account: coldWallet.classicAddress,
          TransferRate: 0,
          TickSize: 5,
          Domain: "6578616D706C652E636F6D", // "example.com"
          SetFlag: AccountSetAsfFlags.asfDefaultRipple,
          Flags: (AccountSetTfFlags.tfDisallowXRP | AccountSetTfFlags.tfRequireDestTag)
        };

        const coldPrepared = await client.autofill(coldSettingsTx);
        const coldSigned = coldWallet.sign(coldPrepared);
        console.log("Sending cold address AccountSet transaction...");
        const coldResult = await client.submitAndWait(coldSigned.tx_blob);
        if (coldResult.result.meta.TransactionResult === "tesSUCCESS") {
          console.log(`AccountSet Transaction succeeded: https://testnet.xrpl.org/transactions/${coldSigned.hash}`);
        } else {
          throw new Error(`Error sending AccountSet transaction: ${coldResult.result.meta.TransactionResult}`);
        }

        const coldWalletInfo = await client.request({
          command: 'account_info',
          account: coldWallet.classicAddress,
          ledger_index: 'validated'
        });
        console.log('Cold wallet account info:', JSON.stringify(coldWalletInfo, null, 2));
        

        // Create and fund a hot wallet (recipient)
        const hotWallet = Wallet.generate();
        await client.fundWallet(hotWallet);

        // Configure hot wallet settings
        const hotSettingsTx = {
          TransactionType: "AccountSet",
          Account: hotWallet.classicAddress,
          TransferRate: 0,
          TickSize: 5,
          Domain: "6578616D706C652E636F6D", // "example.com"
          SetFlag: AccountSetAsfFlags.asfDefaultRipple,
          Flags: (AccountSetTfFlags.tfDisallowXRP | AccountSetTfFlags.tfRequireDestTag)
        };

        const hotPrepared = await client.autofill(hotSettingsTx);
        const hotSigned = hotWallet.sign(hotPrepared);
        console.log("Sending hot address AccountSet transaction...");
        const hotResult = await client.submitAndWait(hotSigned.tx_blob);
        if (hotResult.result.meta.TransactionResult === "tesSUCCESS") {
          console.log(`AccountSet Transaction succeeded: https://testnet.xrpl.org/transactions/${hotSigned.hash}`);
        } else {
          throw new Error(`Error sending  AccountSet transaction: ${hotResult.result.meta.TransactionResult}`);
        }



        // Establish a trust line from hot wallet to cold wallet for BCN
        const trustSet = {
          TransactionType: "TrustSet",
          Account: hotWallet.classicAddress,
          LimitAmount: {
            currency: "BCN",
            issuer: coldWallet.classicAddress,
            value: "1000000000" // High limit to facilitate large transfers
          }
        };

        
        const preparedTrustSet = await client.autofill(trustSet);
        const signedTrustSet = hotWallet.sign(preparedTrustSet);
        const trustSetResult = await client.submitAndWait(signedTrustSet.tx_blob);

        if (trustSetResult.result.meta.TransactionResult === "tesSUCCESS") {
          console.log("Trust line set between hot and cold address successfully");
        } else {
          console.error(`Failed to set trust line between hot and cold address: ${trustSetResult.result.meta.TransactionResult}`);
        }



        // Issue BCN from cold wallet to hot wallet
        const issueAmount = 1000; 
        const payment = {
          TransactionType: "Payment",
          Account: coldWallet.classicAddress,
          Amount: {
            currency: "BCN", 
            value: issueAmount.toString(),
            issuer: coldWallet.classicAddress
          },
          Destination: hotWallet.classicAddress,
          DestinationTag: 12345
        };

        const prepared = await client.autofill(payment);
        const signed = coldWallet.sign(prepared);
        const result = await client.submitAndWait(signed.tx_blob);
        
        if (result.result.meta.TransactionResult === "tesSUCCESS") {
          setIssueStatus(`Successfully issued 1000 BCN to ${hotWallet.classicAddress}`);
          console.log(`Successfully issued 1000 BCN to ${hotWallet.classicAddress}`);
        } else {
          setIssueStatus('Failed to issue BCN. Error: ' + result.result.meta.TransactionResult);
          `Failed to issue BCN BCN to ${hotWallet.classicAddress}`
        }

        const hotWalletBalances = await client.request({
          command: 'account_lines',
          account: hotWallet.classicAddress,
          ledger_index: 'validated'
        });
        console.log('Hot wallet Balance!', JSON.stringify(hotWalletBalances, null, 2));
        

        // Create and fund Bob's wallet
        const bobWallet = Wallet.generate();
        await client.fundWallet(bobWallet);
        setBobWalletInfo(bobWallet);

        // Establish a trust line from Bob's wallet to the hot wallet for BCN
        const trustSetBob = {
          TransactionType: "TrustSet",
          Account: bobWallet.classicAddress,
          LimitAmount: {
            currency: "BCN",
            issuer: hotWallet.classicAddress,
            value: "1000000000"  
          }
        };

        const preparedTrustBob = await client.autofill(trustSetBob);
        const signedTrustBob = bobWallet.sign(preparedTrustBob);     
        const trustSetBobResult = await client.submitAndWait(signedTrustBob.tx_blob);

        if (trustSetBobResult.result.meta.TransactionResult === "tesSUCCESS") {
          console.log(`Trust line setup result: ${trustSetBobResult.result.meta.TransactionResult}`);
        } else {
          console.error(`Failed to set trust line between hot and cold address: ${trustSetBobResult.result.meta.TransactionResult}`);
        }

        // Payment from hot wallet to Bob's wallet
        const bobPayment = {
          TransactionType: "Payment",
          Account: hotWallet.classicAddress,
          Destination: bobWallet.classicAddress,
          Amount: {
            currency: "BCN",
            value: "100", 
            issuer: hotWallet.classicAddress
          },
          DestinationTag: 123456
        };

        const preparedBobPayment = await client.autofill(bobPayment);
        const signedBobPayment = hotWallet.sign(preparedBobPayment);
        const bobPaymentResult = await client.submitAndWait(signedBobPayment.tx_blob);

        if (bobPaymentResult.result.meta.TransactionResult === "tesSUCCESS") {
          setBobPaymentStatus(`Successfully sent 500 BCN to ${bobWallet.classicAddress}`);
          console.log(bobPaymentStatus);
        } else {
          setBobPaymentStatus('Failed to send BCN. Error: ' + bobPaymentResult.result.meta.TransactionResult);
          console.log(bobPaymentStatus);
        }
       await client.disconnect();
      } catch (error) {
        console.error('Error:', error);
        setIssueStatus('Failed to connect or issue token. Technical details: ' + error.message);
      } 

      console.log('Bob payment status', bobPaymentStatus);
       
    };


  useEffect(() => {
    if (bobPaymentStatus) {
      console.log('Bob payment status:', bobPaymentStatus);
    }
  }, [bobPaymentStatus]);


  const messages = [
    { id: 1, sender: "Alice", text: "Really need some advice on how to survive Freshers' Week!" },
    { id: 2, sender: "Bob", text: "Keep it simple. Make sure you go to the introductory sessions, meet new people, and join a few societies that interest you." },
    { id: 3, sender: "Alice", text: "That makes sense. What about managing the workload?" },
    { id: 4, sender: "Bob", text: "Don’t stress too much yet. Focus on getting organised, keep track of your schedule, and don’t be afraid to ask for help if you need it." },
    { id: 5, sender: "Alice", text: "Thanks! Any tips on balancing social life and studies?" },
    { id: 6, sender: "Bob", text: "Yes, prioritise your time. Enjoy the social events but also set aside study time. Find a good balance early on." }
  ];

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg border shadow-md">
      <h1 className="text-lg font-semibold text-gray-900 mb-4">Chat</h1>
      <ul className="space-y-2 mb-4">
        {messages.map(message => (
          <li key={message.id} className="bg-gray-100 p-3 rounded-md">
            <strong>{message.sender}:</strong> {message.text}
          </li>
        ))}
      </ul>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded"
        />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Send
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={connectAndIssueToken}
        >
          End Chat
        </button>
      </div>
    </div>
    
  );
  
}
