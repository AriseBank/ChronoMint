import AbstractContractDAO from './AbstractContractDAO'
import ContractsManagerDAO from './ContractsManagerDAO'
import errorCodes from './errorCodes'

export const TX_DEPOSIT = 'deposit'
export const TX_WITHDRAW_SHARES = 'withdrawShares'

export default class TIMEHolderDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/TimeHolder.json'), at)
    // TODO @dkchv: remove all except OK after SC update and backend research, see MINT-279
    // cause TIMEHOLDER_DEPOSIT_FAILED and TIMEHOLDER_WITHDRAWN_FAILED
    // - is like warning, not error, backend says
    this._txOkCodes = [
      ...this._txOkCodes,
      errorCodes.TIMEHOLDER_DEPOSIT_FAILED,
      errorCodes.TIMEHOLDER_WITHDRAWN_FAILED
    ]
  }

  /** @returns {Promise<ERC20DAO>} */
  getAssetDAO () {
    return this._call('sharesContract').then(address => {
      return ContractsManagerDAO.getERC20DAO(address)
    })
  }

  async deposit (amount: number) {
    const assetDAO = await this.getAssetDAO()
    const account = await this.getAddress()

    // estimates
    const [gas1, gas2] = await Promise.all([
      await assetDAO.estimateApprove(account, amount),
      await this.estimateDeposit(assetDAO.addDecimals(amount))
    ])

    // confirm and run tx
    await assetDAO.pluralApprove(account, amount, {step: 1, of: 2, gasLeft: gas1.gasTotal + gas2.gasTotal})
    return this.pluralDeposit(assetDAO, amount, {step: 2, of: 2, gasLeft: gas2.gasTotal})
  }

  pluralDeposit (assetDAO, amount: number, plural: Object) {
    return this._tx(TX_DEPOSIT, [assetDAO.addDecimals(amount)], {amount}, null, null, null, plural)
  }

  estimateDeposit (amountWithDecimals) {
    return this._estimateGas(TX_DEPOSIT, [amountWithDecimals])
  }

  async withdraw (amount: number) {
    const assetDAO = await this.getAssetDAO()
    return this._tx(TX_WITHDRAW_SHARES, [assetDAO.addDecimals(amount)], {amount})
  }

  async getAccountDepositBalance (account: string) {
    const assetDAO = await this.getAssetDAO()
    return this._callNum('depositBalance', [account]).then(r => assetDAO.removeDecimals(r))
  }
}
