import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

const HARMONY_TESTNET = '1666700000';

export default class MetamaskWallet{
    constructor(){
        this.account = "";
        this.authorised = false;

        this.initialize();
    }

    logOut(){
        this.authorised = false;
        this.account = "";
        console.log('LOGGED OUT!!');
    }

    async initialize(){
        const provider = await detectEthereumProvider();

        console.log('Current network id: ', provider);
        provider.on('accountsChanged', this.handleAccountsChanged);

        provider.on('networkChanged', (networkId) => {
            this.handleNetworkChange(networkId);
        });

        provider.on('connect', () => {
            this.authorised = true;
        });

        provider.on('disconnect', () => {
            this.logOut();
        });
    }

    handleNetworkChange(networkId){
        if(networkId != HARMONY_TESTNET){
            console.error('You are not connected to Harmony Testnet.');
            this.logOut();
        }
        else{
            this.signIn();
        }
    }

    async signTransaction(amount){
        const web3 = new Web3(window.ethereum);
        const receiverAddress = '0x8d4cba0f89353c91367d62d6b868928a1f9d6b20';
        const gas = 6721900;
        const gasPrice = await web3.eth.getGasPrice();

        const result = await web3.eth.sendTransaction({
            from: this.account,
            to: receiverAddress,
            value: amount * 1e18,
            gasPrice,
            gas
        }).on('error', console.error).on('transactionHash', transactionHash => {
            console.log('Transaction is sending:', transactionHash);
        });

        return result;
    }

    async signIn() {
        const provider = await detectEthereumProvider();

        const networkId = await provider.request({
          method: "net_version",
        });

        if(networkId == HARMONY_TESTNET){
            if (provider !== window.ethereum) {
                console.error('Do you have multiple wallets installed?');
            }

            if (!provider) {
                console.error('Metamask not found');
                return;
            }

            const isConnected = provider.isConnected();
            console.log('Is connected: ' + isConnected);
            const signIn = await window.ethereum.request({
                    method: "eth_requestAccounts",  
                    params: 
                    [{
                        eth_accounts: {}
                    }]
                }).then((accounts) => {
                    this.handleAccountsChanged(accounts);
                    this.authorised = true;
                }).catch((err) => {
                    if(err.code === 4001){
                        console.log('Connection refused.');
                    }
                    else{
                        console.error(err);
                    }
                });
        }
        else{
            console.error('Change network to Harmony Testnet');
            const chainId = await provider.request({ method: 'wallet_switchEthereumChain', params:[{chainId: "0x6357d2e0"}]});
        }
    }

    handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            console.error('Not found accounts');
            this.logOut();
        } else {
            this.account = accounts[0];
            this.authorised = true;
            console.log('Your address: ', this.account);
        }
    }
}
