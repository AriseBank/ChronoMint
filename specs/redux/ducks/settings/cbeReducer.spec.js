import {Map} from 'immutable';
import reducer, * as actions from '../../../../src/redux/ducks/settings/cbe';
import CBEModel from '../../../../src/models/CBEModel';

let cbe = new CBEModel({address: '0x123', name: 'Test'});

let list = new Map();
list = list.set(cbe.address(), cbe);

describe('settings cbe reducer', () => {
    it('should return the initial state', () => {
        expect(
            reducer(undefined, {})
        ).toEqual({
            list: new Map(),
            ready: false,
            selected: new CBEModel(),
            error: false,
            remove: false,
            isFetching: false
        });
    });

    it('should handle CBE_LIST', () => {
        expect(
            reducer([], {type: actions.CBE_LIST, list})
        ).toEqual({
            list,
            ready: true
        });
    });

    it('should handle CBE_FORM', () => {
        expect(
            reducer([], {type: actions.CBE_FORM, cbe})
        ).toEqual({
            selected: cbe
        });
    });

    it('should handle CBE_REMOVE_TOGGLE', () => {
        expect(actions.removeCBEToggle(cbe)).toEqual({type: actions.CBE_REMOVE_TOGGLE, cbe});

        expect(
            reducer([], actions.removeCBEToggle(cbe))
        ).toEqual({
            selected: cbe,
            remove: true
        });

        expect(
            reducer({selected: cbe}, actions.removeCBEToggle(null))
        ).toEqual({
            selected: new CBEModel(),
            remove: false
        });
    });

    it('should handle CBE_UPDATE', () => {
        expect(
            reducer({list: new Map()}, {type: actions.CBE_UPDATE, cbe})
        ).toEqual({
            list
        });
    });

    it('should handle CBE_REMOVE', () => {
        expect(
            reducer({list}, {type: actions.CBE_REMOVE, cbe})
        ).toEqual({
            list: new Map()
        });
    });

    it('should handle CBE_ERROR', () => {
        expect(
            reducer([], {type: actions.CBE_ERROR})
        ).toEqual({
            error: true
        });
    });

    it('should handle CBE_HIDE_ERROR', () => {
        expect(
            reducer([], {type: actions.CBE_HIDE_ERROR})
        ).toEqual({
            error: false
        });
    });

    it('should handle CBE_FETCH_START', () => {
        expect(
            reducer([], {type: actions.CBE_FETCH_START})
        ).toEqual({
            isFetching: true
        });
    });

    it('should handle CBE_FETCH_END', () => {
        expect(
            reducer([], {type: actions.CBE_FETCH_END})
        ).toEqual({
            isFetching: false
        });
    });
});