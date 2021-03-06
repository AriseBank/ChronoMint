import Immutable from 'immutable'
import CBEModel from 'models/CBEModel'
import CBENoticeModel from 'models/notices/CBENoticeModel'
import * as a from './actions'
import reducer from './reducer'
import { accounts } from 'specsInit'

const cbe = new CBEModel({address: accounts[1]})
const notice = new CBENoticeModel({revoke: false, cbe})

describe('notifier', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      notice: null,
      list: new Immutable.List()
    })
  })

  it('should handle NOTIFIER_MESSAGE', () => {
    expect(
      reducer({list: new Immutable.List()}, {type: a.NOTIFIER_MESSAGE, notice, isStorable: true})
    ).toEqual({
      notice,
      list: new Immutable.List([notice])
    })

    expect(
      reducer({list: new Immutable.List()}, {type: a.NOTIFIER_MESSAGE, notice, isStorable: false})
    ).toEqual({
      notice,
      list: new Immutable.List()
    })
  })

  it('should handle NOTIFIER_CLOSE', () => {
    expect(
      reducer([], {type: a.NOTIFIER_CLOSE})
    ).toEqual({
      notice: null
    })
  })
})
