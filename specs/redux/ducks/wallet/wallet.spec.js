import * as actions from '../../../../src/redux/ducks/wallet/wallet';
import UserDAO from '../../../../src/dao/UserDAO';
import {store} from '../../../init';

const account = UserDAO.web3.eth.accounts[0];

describe('Wallet actions', () => {

    it('should show zero time deposit', () => {
        return store.dispatch(actions.updateTimeDeposit(account)).then(() => {
            expect(store.getActions()).toEqual([{"payload": 0, "type": "wallet/SET_TIME_DEPOSIT_SUCCESS"}]);
        })
    });

    it('should show zero time balance', () => {
        return store.dispatch(actions.updateTimeBalance(account)).then(() => {
            expect(store.getActions()[1]).toEqual({"payload": 0, "type": "wallet/SET_TIME_BALANCE_SUCCESS"});
        })
    });

    it('should request time', () => {
        return store.dispatch(actions.requireTime(account)).then(() => {
            expect(store.getActions()[0]).toEqual(
                {payload: {modalProps: {message: "Time request sent successfully.", title: "Require Time"},
                    modalType: "modals/ALERT_TYPE"}, type: "modal/SHOW"});
        })
    });

    it('should show 1000 time balance', () => {
        return store.dispatch(actions.updateTimeBalance(account)).then(() => {
            expect(store.getActions()[1]).toEqual({"payload": 1000, "type": "wallet/SET_TIME_BALANCE_SUCCESS"});
        })
    });

    it('should show error on second request time', () => {
        return store.dispatch(actions.requireTime(account)).then(() => {
            expect(store.getActions()[0]).toEqual(
                {payload: {modalProps: {message: "Time request not completed.", title: "Error"},
                    modalType: "modals/ALERT_TYPE"}, type: "modal/SHOW"});
        })
    });

    it('should deposit 100 time', () => {
        return store.dispatch(actions.depositTime(100, account)).then(() => {
            expect(store.getActions()).toEqual([{"type": "wallet/SET_TIME_BALANCE_START"}]);
        })
    });

    it('should show 100 time deposit', () => {
        return store.dispatch(actions.updateTimeDeposit(account)).then(() => {
            expect(store.getActions()).toEqual([{"payload": 100, "type": "wallet/SET_TIME_DEPOSIT_SUCCESS"}]);
        })
    });

    it('should show 900 time balance', () => {
        return store.dispatch(actions.updateTimeBalance(account)).then(() => {
            expect(store.getActions()[1]).toEqual({"payload": 900, "type": "wallet/SET_TIME_BALANCE_SUCCESS"});
        })
    });

    it('should withdraw 100 time', () => {
        return store.dispatch(actions.withdrawTime(100, account)).then(() => {
            expect(store.getActions()).toEqual([{"type": "wallet/SET_TIME_BALANCE_START"}]);
        })
    });

    it('should show 0 time deposit', () => {
        return store.dispatch(actions.updateTimeDeposit(account)).then(() => {
            expect(store.getActions()).toEqual([{"payload": 0, "type": "wallet/SET_TIME_DEPOSIT_SUCCESS"}]);
        })
    });

    it('should show 1000 time balance', () => {
        return store.dispatch(actions.updateTimeBalance(account)).then(() => {
            expect(store.getActions()[1]).toEqual({"payload": 1000, "type": "wallet/SET_TIME_BALANCE_SUCCESS"});
        })
    });

});