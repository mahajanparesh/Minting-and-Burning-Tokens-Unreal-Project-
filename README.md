# Minting-and-Burning-Unreal-Project-
## Task: nUSD Stablecoin
The task is to create a new stablecoin called nUSD backed by ETH. The primary goals are to allow users to deposit ETH and receive 50% of its value in nUSD, and to provide a redeem function to convert nUSD back into ETH.

Key Functions:
Enable users to deposit ETH and receive 50% of its value in nUSD.
Design a redeem function to convert nUSD back into ETH at double the value.
Track and update the total supply of nUSD based on user actions.

## Steps to run this project:
1. Start by creating a blank workspace in the Remix IDE.
2. Upload the nUSDStableCoin.sol file to the newly created workspace.
3. Compile the smart contract.
4. In Remix, select "Injected Provider - MetaMask" as the environment and specify the Price Feed Address.<br/>
   Price feed Addresses: i. Goerli Testnet: 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e <br/>
                         ii. Sepolia Testnet: 0x694AA1769357215DE4FAC081bf1f309aDC325306<br/>
   Note**: Refer this link for Price feed Addresses: https://docs.chain.link/data-feeds/price-feeds/addresses             
6. Confirm the transaction in MetaMask, and your contract will be successfully created.
7. Copy the contract address and paste it in the "Import New Token" section of MetaMask to create your new token.
8. Deposit: Enter the desired amount you want to deposit in WEI format. The amount will be deposited into your nUSD token.
9. Redeem: Specify the amount you want to redeem in the 18 decimal format. You will receive the equivalent ETH amount back into your account.

## Note**: Refer to the attached video for a better understanding.
https://github.com/mahajanparesh/Minting-and-Burning-Tokens-Unreal-Project-/assets/86055559/e9d4b870-0bc4-4168-ad66-8e749f5a908b
