import ContractsManagerDAO from '../../dao/ContractsManagerDAO'
import LS from '../../utils/LocalStorage'
import RewardsModel from '../../models/RewardsModel'

export const REWARDS_FETCH_START = 'rewards/FETCH_START'
export const REWARDS_DATA = 'rewards/DATA'

const initialState = {
  data: new RewardsModel(),
  isFetching: false,
  isFetched: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case REWARDS_DATA:
      return {
        ...state,
        data: action.data,
        isFetching: false,
        isFetched: true
      }
    case REWARDS_FETCH_START:
      return {
        ...state,
        isFetching: true
      }
    default:
      return state
  }
}

export const getRewardsData = (silent = false) => async (dispatch) => {
  if (!silent) {
    dispatch({type: REWARDS_FETCH_START})
  }
  const dao = await ContractsManagerDAO.getRewardsDAO()
  const data = await dao.getRewardsData(LS.getAccount())
  dispatch({type: REWARDS_DATA, data})
}

export const withdrawRevenue = () => async (dispatch) => {
  dispatch({type: REWARDS_FETCH_START})
  const dao = await ContractsManagerDAO.getRewardsDAO()
  await dao.withdrawRewardsFor(LS.getAccount())
  return dispatch(getRewardsData())
}

export const closePeriod = () => async (dispatch) => {
  dispatch({type: REWARDS_FETCH_START})
  const dao = await ContractsManagerDAO.getRewardsDAO()
  return dao.closePeriod()
}

export const watchInitRewards = () => async (dispatch) => {
  const callback = () => dispatch(getRewardsData(true))

  const dao = await ContractsManagerDAO.getRewardsDAO()
  dao.watchPeriodClosed(callback)

  const erc20dao = await dao.getAssetDAO()
  erc20dao.watchTransferPlain(callback)
}
