import reducer, * as actions from '../../../src/redux/network/networkReducer'
import web3Provider from '../../../src/network/Web3Provider'
import { providerMap, infuraNetworkMap, infuraLocalNetwork } from '../../../src/network/networkSettings'

let accounts, selectedAccount

describe('network reducer', () => {
  beforeAll(done => {
    web3Provider.getWeb3().then(web3 => {
      accounts = web3.eth.accounts
      selectedAccount = accounts[2]
      done()
    })
  })

  it('should return initial state', () => {
    expect(reducer(undefined, {}))
      .toEqual({
        isLocal: false,
        accounts: [],
        selectedAccount: null,
        errors: [],
        providers: [providerMap.infura, providerMap.metamask, providerMap.local],
        selectedProviderId: null,
        networks: [],
        selectedNetworkId: null
      })
  })

  it('should handle NETWORK_SET_TEST_RPC', () => {
    const initialState = {
      isLocal: false,
      providers: [providerMap.local]
    }
    expect(reducer(initialState, {type: actions.NETWORK_SET_TEST_RPC}))
      .toEqual({
        isLocal: true,
        providers: [providerMap.local]
      })
    expect(providerMap.local.disabled).toBeFalsy()
  })

  it('should handle NETWORK_SET_TEST_METAMASK', () => {
    const initialState = {
      providers: [providerMap.metamask]
    }
    expect(reducer(initialState, {type: actions.NETWORK_SET_TEST_METAMASK}))
      .toEqual({
        providers: [providerMap.metamask]
      })
    expect(providerMap.metamask.disabled).toBeFalsy()
  })

  it('should handle NETWORK_SET_NETWORK', () => {
    expect(reducer({}, {type: actions.NETWORK_SET_NETWORK, selectedNetworkId: 2}))
      .toEqual({
        selectedNetworkId: 2
      })
  })

  it('should handle NETWORK_SET_PROVIDER without local', () => {
    const initialState = {
      isLocal: false,
      selectedProviderId: null,
      providers: [providerMap.metamask],
      networks: []
    }
    expect(reducer(initialState, {
      type: actions.NETWORK_SET_PROVIDER,
      selectedProviderId: providerMap.infura.id
    })).toEqual({
      isLocal: false,
      selectedProviderId: providerMap.infura.id,
      providers: [providerMap.metamask],
      networks: infuraNetworkMap
    })
  })

  it('should handle NETWORK_SET_PROVIDER with local', () => {
    const initialState = {
      isLocal: true,
      providers: [providerMap.metamask],
      networks: [],
      selectedProviderId: null
    }
    const state = reducer(initialState, {type: actions.NETWORK_SET_TEST_RPC})
    const expectedNetworks = infuraNetworkMap.concat(infuraLocalNetwork)
    expect(reducer(state, {
      type: actions.NETWORK_SET_PROVIDER,
      selectedProviderId: providerMap.infura.id
    })).toEqual({
      isLocal: true,
      networks: expectedNetworks,
      selectedProviderId: providerMap.infura.id,
      providers: [providerMap.metamask]
    })
  })

  it('should handle NETWORK_SET_ACCOUNTS', () => {
    expect(reducer({}, {type: actions.NETWORK_SET_ACCOUNTS, accounts}))
      .toEqual({
        accounts
      })
  })

  it('should handle NETWORK_SELECT_ACCOUNT', () => {
    expect(reducer({}, {type: actions.NETWORK_SELECT_ACCOUNT, selectedAccount}))
      .toEqual({
        selectedAccount
      })
  })

  it('should handle NETWORK_ADD_ERROR', () => {
    const initialState = {errors: ['bug', 'warning']}
    expect(reducer(initialState, {type: actions.NETWORK_ADD_ERROR, error: 'feature'}))
      .toEqual({
        errors: ['bug', 'warning', 'feature']
      })
  })

  it('should handle NETWORK_CLEAR_ERRORS', () => {
    const initialState = {errors: ['bug', 'warning']}
    expect(reducer(initialState, {type: actions.NETWORK_CLEAR_ERRORS}))
      .toEqual({
        errors: []
      })
  })
})