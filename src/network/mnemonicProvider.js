import hdKey from 'ethereumjs-wallet/hdkey'
import bip39 from 'bip39'
import Web3Utils from './Web3Utils'

export const createWallet = (mnemonic) => {
  const hdWallet = hdKey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
  // get the first account using the standard hd path
  const walletHDPath = 'm/44\'/60\'/0\'/0/'
  return hdWallet.derivePath(walletHDPath + '0').getWallet()
}

export const validateMnemonic = (mnemonic) => {
  return bip39.validateMnemonic(mnemonic)
}

export const generateMnemonic = () => {
  return bip39.generateMnemonic()
}

const mnemonicProvider = (mnemonic, providerUrl) => {
  const wallet = createWallet(mnemonic)
  return Web3Utils.createEngine(wallet, providerUrl)
}

export default mnemonicProvider
