import Immutable from 'immutable'

import CBEModel from '../../../models/CBEModel'
import CBENoticeModel from '../../../models/notices/CBENoticeModel'
import ProfileModel from '../../../models/ProfileModel'

import { store, accounts } from '../../../specsInit'
import validator from '../../../components/forms/validator'
import contractsManagerDAO from '../../../dao/ContractsManagerDAO'
import * as modal from '../../ui/modal'
import * as notifier from '../../notifier/actions'
import * as a from './cbe'

import { FORM_SETTINGS_CBE } from '../../../components/pages/SettingsPage/UserManagerPage/CBEAddressForm'

const user = new ProfileModel({name: Math.random().toString()})
const cbe = new CBEModel({address: accounts[9], name: user.name(), user})

describe('settings cbe actions', () => {
  it('should list CBE', async () => {
    await store.dispatch(a.listCBE())

    const list = store.getActions()[1].list
    expect(list instanceof Immutable.Map).toBeTruthy()

    const address = list.keySeq().toArray()[0]
    expect(validator.address(address)).toEqual(null)
    expect(list.get(address).address()).toEqual(accounts[0])
  })

  it('should add CBE', async (resolve) => {
    const dao = await contractsManagerDAO.getUserManagerDAO()
    await dao.watchCBE((notice) => {
      expect(notice.isRevoked()).toBeFalsy()
      expect(notice.cbe()).toEqual(cbe)
      resolve()
    })
    await store.dispatch(a.addCBE(cbe))
    expect(store.getActions()).toEqual([
      {type: a.CBE_SET, cbe: cbe.fetching()}
    ])
  })

  it('should show CBE form', () => {
    store.dispatch(a.formCBE(cbe))
    expect(store.getActions()).toEqual([
      {type: a.CBE_FORM, cbe},
      {type: modal.MODAL_SHOW, payload: {modalType: modal.SETTINGS_CBE_TYPE, modalProps: undefined}}
    ])
  })

  it('should show load name to CBE form', () => {
    return store.dispatch(a.formCBELoadName(cbe.address())).then(() => {
      expect(store.getActions()).toEqual([{
        'meta': {
          'field': 'name',
          'form': FORM_SETTINGS_CBE,
          'persistentSubmitErrors': undefined,
          'touch': undefined
        },
        'payload': 'loading...',
        'type': '@@redux-form/CHANGE'
      }, {
        'meta': {
          'field': 'name',
          'form': FORM_SETTINGS_CBE,
          'persistentSubmitErrors': undefined,
          'touch': undefined
        },
        'payload': cbe.name(),
        'type': '@@redux-form/CHANGE'
      }])
    })
  })

  it('should revoke CBE', async (resolve) => {
    const dao = await contractsManagerDAO.getUserManagerDAO()
    await dao.watchCBE((notice) => {
      expect(notice.isRevoked()).toBeTruthy()
      expect(notice.cbe()).toEqual(cbe)
      resolve()
    })
    await store.dispatch(a.revokeCBE(cbe))
    expect(store.getActions()).toEqual([
      {type: a.CBE_REMOVE_TOGGLE, cbe: null},
      {type: a.CBE_SET, cbe: cbe.fetching()}
    ])
  })

  it('should create a notice and dispatch CBE when updated', () => {
    const notice = new CBENoticeModel({cbe, isRevoked: false})
    store.dispatch(a.watchCBE(notice, false))
    expect(store.getActions()).toEqual([
      {type: notifier.NOTIFIER_MESSAGE, notice, isStorable: true},
      {type: a.CBE_SET, cbe}
    ])
  })

  it('should create a notice and dispatch CBE when revoked', () => {
    const notice = new CBENoticeModel({cbe, isRevoked: true})
    store.dispatch(a.watchCBE(notice, false))
    expect(store.getActions()).toEqual([
      {type: notifier.NOTIFIER_MESSAGE, notice, isStorable: true},
      {type: a.CBE_REMOVE, cbe}
    ])
  })

  it('should create an action to update cbe', () => {
    expect(a.setCBE(cbe)).toEqual({type: a.CBE_SET, cbe})
  })

  it('should create an action to remove cbe', () => {
    expect(a.removeCBE(cbe)).toEqual({type: a.CBE_REMOVE, cbe})
  })

  it('should create an action to toggle remove cbe dialog', () => {
    expect(a.removeCBEToggle(cbe)).toEqual({type: a.CBE_REMOVE_TOGGLE, cbe})
  })
})
