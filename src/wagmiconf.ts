import { Chain, configureChains, createClient } from 'wagmi'


//import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
//import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { publicProvider } from 'wagmi/providers/public'

const fantomChain: Chain = {
  id: 250,
  name: 'Fantom',
  network: 'fantom',
  nativeCurrency: {
    decimals: 18,
    name: 'Fantom',
    symbol: 'FTM',
  },
  rpcUrls: {
    default: 'https://rpc.ftm.tools/',
  },
  blockExplorers: {
    default: { name: 'FtmScan', url: 'https://ftmscan.com' },
  },
  testnet: false,
}


const { chains, provider, webSocketProvider } = configureChains(
  [
    fantomChain,
  ],
  [
    publicProvider(),
  ],
)

export const client = createClient({
  autoConnect: true,
  connectors: [
/*
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
*/
    new MetaMaskConnector({ 
      chains 
    }),
/*
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
*/
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})
