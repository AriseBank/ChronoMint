import reducer from './reducer'
import * as actions from './actions'
import { Map } from 'immutable'
import AssetModel from '../../models/AssetModel'
import TransactionModel from '../../models/TransactionModel'

const tx1 = new TransactionModel({
  txHash: '123'
})

const tx2 = new TransactionModel({
  txHash: '456'
})

describe('exchange reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {}))
      .toEqual({
        transactions: {
          isFetching: false,
          isFetched: false,
          transactions: new Map(),
          toBlock: null
        },
        eth: {
          currencyId: 'eth',
          balance: null,
          isFetching: false,
          isFetched: false
        },
        lht: {
          currencyId: 'lht',
          balance: null,
          isFetching: false,
          isFetched: false
        },
        rates: {
          rates: new Map(),
          isFetching: false,
          isFetched: false
        }
      })
  })

  it('should handle EXCHANGE_RATES_FETCH', () => {
    expect(reducer({}, {type: actions.EXCHANGE_RATES_FETCH}))
      .toEqual({
        rates: {
          isFetching: true
        }
      })
  })

  it('should handle EXCHANGE_RATES', () => {
    const rate = new AssetModel({
      symbol: 'LHT',
      buyPrice: 1,
      sellPrice: 2
    })
    const ratesMap = new Map()
    const initialState = {
      rates: {
        rates: ratesMap,
        isFetched: false,
        isFetching: true
      }
    }
    expect(reducer(initialState, {type: actions.EXCHANGE_RATES, rate}))
      .toEqual({
        rates: {
          isFetching: false,
          isFetched: true,
          rates: ratesMap.set(rate.symbol(), rate)
        }
      })
  })

  it('should handle EXCHANGE_TRANSACTIONS_FETCH', () => {
    expect(reducer({}, {type: actions.EXCHANGE_TRANSACTIONS_FETCH}))
      .toEqual({
        transactions: {
          isFetching: true
        }
      })
  })

  it('should handle EXCHANGE_TRANSACTIONS', () => {
    const txMap = new Map()
    const initialState = {
      transactions: {
        transactions: txMap,
        isFetched: false,
        isFetching: true,
        toBlock: 50
      }
    }
    const txs = new Map({
      [tx1.id()]: tx1,
      [tx2.id()]: tx2
    })
    expect(reducer(initialState, {type: actions.EXCHANGE_TRANSACTIONS, transactions: txs, toBlock: 10}))
      .toEqual({
        transactions: {
          transactions: txMap.merge(txs),
          isFetched: true,
          isFetching: false,
          toBlock: 10
        }
      })
  })

  it('should handle EXCHANGE_TRANSACTION', () => {
    const txMap = new Map({
      [tx1.id()]: tx1
    })
    const initialState = {
      transactions: {
        transactions: txMap
      }
    }
    expect(reducer(initialState, {type: actions.EXCHANGE_TRANSACTION, tx: tx2}))
      .toEqual({
        transactions: {
          transactions: txMap.set(tx2.id(), tx2)
        }
      })
  })

  it('should handle EXCHANGE_BALANCE_ETH_FETCH', () => {
    expect(reducer({}, {type: actions.EXCHANGE_BALANCE_ETH_FETCH}))
      .toEqual({
        eth: {
          isFetching: true
        }
      })
  })

  it('should handle EXCHANGE_BALANCE_ETH', () => {
    expect(reducer({}, {type: actions.EXCHANGE_BALANCE_ETH, balance: 5}))
      .toEqual({
        eth: {
          isFetching: false,
          isFetched: true,
          balance: 5
        }
      })
  })

  it('should handle EXCHANGE_BALANCE_LHT_FETCH', () => {
    expect(reducer({}, {type: actions.EXCHANGE_BALANCE_LHT_FETCH}))
      .toEqual({
        lht: {
          isFetching: true
        }
      })
  })

  it('should handle EXCHANGE_BALANCE_LHT', () => {
    expect(reducer({}, {type: actions.EXCHANGE_BALANCE_LHT, balance: 5}))
      .toEqual({
        lht: {
          isFetching: false,
          isFetched: true,
          balance: 5
        }
      })
  })
})
