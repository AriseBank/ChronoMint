import DAO from './DAO';
import ProxyDAO from './ProxyDAO';
import CBEModel from '../models/CBEModel';
import TokenModel from '../models/TokenModel';

class AppDAO extends DAO {
    constructor() {
        super();

        this.timeEnumIndex = 8;
        this.lhtEnumIndex = 16;
    }

    getLOCCount = (account: string) => {
        return this.chronoMint.then(deployed => deployed.getLOCCount.call({from: account}));
    };

    getLOCbyID = (index: number, account: string) => {
        return this.chronoMint.then(deployed => deployed.getLOCbyID.call({index, from: account}));
    };

    reissueAsset = (asset: string, amount: number, account: string) => {
        return this.chronoMint.then(deployed => deployed.reissueAsset(asset, amount, {from: account}));
    };

    getBalance = (enumIndex: number) => {
        return this.chronoMint.then(deployed => deployed.getBalance.call(enumIndex));
    };

    getLhtBalance = () => {
        return this.getBalance(this.lhtEnumIndex);
    };

    getTimeBalance = () => {
        return this.getBalance(this.timeEnumIndex);
    };

    send = (enumIndex: number, to: string, amount: number, account: string) => {
        return this.chronoMint.then(deployed => {
            // deployed.sendAsset(enumIndex, to, amount, {from: account, gas: 3000000});
        });
    };

    sendLht = (to, amount, account) => {
        return this.send(this.lhtEnumIndex, to, amount, account);
    };

    sendTime = (to, amount, account) => {
        return this.send(this.timeEnumIndex, to, amount, account);
    };

    setExchangePrices = (buyPrice, sellPrice, account) => {
        return this.chronoMint.then(deployed => deployed.setExchangePrices(buyPrice, sellPrice, {
            from: account,
            gas: 3000000
        }));
    };

    getLOCs = (account: string) => {
        return this.chronoMint.then(deployed => deployed.getLOCs.call({from: account}));
    };

    pendingsCount = (account: string) => {
        return this.chronoMint.then(deployed => deployed.pendingsCount.call({from: account}));
    };

    pendingById = (index: number, account: string) => {
        return this.chronoMint.then(deployed => deployed.pendingById.call(index, {from: account}));
    };

    getTxsType = (conf_sign: string, account: string) => {
        return this.chronoMint.then(deployed => deployed.getTxsType.call(conf_sign, {from: account}));
    };

    pendingYetNeeded = (conf_sign: string, account: string) => {
        return this.chronoMint.then(deployed => deployed.pendingYetNeeded.call(conf_sign, {from: account}));
    };

    hasConfirmed = (conf_sign: string, checkingAccount: string, fromAccount: string) => {
        return this.chronoMint.then(deployed => deployed.pendingYetNeeded.call(conf_sign, checkingAccount, {from: fromAccount}));
    };

    required = (account: string) => {
        return this.chronoMint.then(deployed => deployed.required.call({from: account}));
    };

    revoke = (conf_sign: string, account: string) => {
        return this.chronoMint.then(deployed => deployed.revoke(conf_sign, {from: account}));
    };

    confirm = (conf_sign: string, account: string) => {
        return this.chronoMint.then(deployed => deployed.confirm(conf_sign, {from: account}));
    };

    setLOCString = (address: string, index: number, value: string, account: string) => {
        return this.chronoMint.then(deployed => deployed.setLOCString(address, index, value, {from: account}));
    };

    setLOCValue = (address: string, index: number, value: number, account: string) => {
        return this.chronoMint.then(deployed => deployed.setLOCValue(address, index, value, {from: account}));
    };

    proposeLOC = (locName: string, website: string, issueLimit: number, publishedHash: string, expDate: number, account: string) => {
        return this.chronoMint.then(deployed => deployed.proposeLOC(locName, website, issueLimit, publishedHash, expDate, {from: account, gas: 3000000}));
    };

    removeLOC = (address: string, account: string) => {
        return this.chronoMint.then(deployed => deployed.removeLOC(address, {from: account, gas: 3000000}));
    };

    newLOCWatch = (callback) => {
        return this.chronoMint.then(deployed => deployed.newLOC().watch(callback));
    };

    /**
     * @param account from
     * @return Promise bool
     */
    isCBE = (account: string) => {
        return this.chronoMint.then(deployed => deployed.isAuthorized.call(account, {from: account}));
    };

    /**
     * @param callback will receive number of authorized keys and CBEModel one-by-one
     * @param account from
     * @return Promise number of CBEs that should be sent to the callback
     */
    getCBEs = (callback, account: string) => {
        this.chronoMint.then(deployed => {
            deployed.numAuthorizedKeys.call({from: account}).then(num => {
                num = num.toNumber() - 1;
                for (let i = 0; i < num; i++) {
                    deployed.getOwner.call(i, {from: account}).then(address => {
                        deployed.getMemberName.call(address, {from: account}).then(name => {
                            callback(num, new CBEModel({address, name}));
                        });
                    });
                }
            });
        });
    };

    /**
     * @param cbe
     * @param account from
     * @return Promise bool result
     */
    treatCBE = (cbe: CBEModel, account: string) => {
        return this.chronoMint.then(deployed => {
            return deployed.addKey(cbe.address(), {from: account, gas: 3000000}).then(() => {
                return this.isCBE(cbe.address()).then(ok => {
                    return ok ? deployed.setMemberName(cbe.address(), cbe.name(), {from: account, gas: 3000000}) : false;
                });
            });
        });
    };

    /**
     * @param address of CBE
     * @param account from
     * @return Promise bool result
     */
    revokeCBE = (address: string, account: string) => {
        if (address == account) { // prevent self deleting
            return new Promise(resolve => resolve(false));
        }
        return this.chronoMint.then(deployed => {
            return deployed.revokeKey(address, {from: account, gas: 3000000}).then(() => {
                return this.isCBE(address);
            });
        });
    };

    /**
     * @param callbackUpdate will receive CBEModel of updated element
     * @param callbackRevoke will receive address of revoked CBE
     * @param account from
     */
    watchUpdateCBE = (callbackUpdate, callbackRevoke, account: string) => {
        this.chronoMint.then(deployed => {
            deployed.userUpdate().watch((error, result) => {
                if (error) {return; }
                let address = result.args.key;
                this.isCBE(address).then(r => {
                    if (r) { // update
                        deployed.getMemberName.call(address, {from: account}).then(name => {
                            callbackUpdate(new CBEModel({address, name}));
                        });
                    } else { // revoke
                        callbackRevoke(address);
                    }
                });
            });
        });
    };

    /** @param callback will receive TokenModel of updated/created token */
    watchUpdateToken = (callback) => {
        this.chronoMint.then(deployed => {
            deployed.updateToken().watch(address => {
                let proxy = new ProxyDao(address);
                proxy.getName().then(name => {
                    proxy.getSymbol().then(symbol => {
                        callback(new TokenModel({address, name, symbol}));
                    });
                });
            });
        });
    };
}

export default new AppDAO();