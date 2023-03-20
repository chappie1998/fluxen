library interface;

dep data_structure;

use data_structure::{borrowNft, ListNft};

abi NftMarketplace {
    /// Returns the current admin for the contract.
    ///
    /// # Reverts
    ///
    /// * When the contract does not have an admin.
    #[storage(read)]
    fn admin() -> Option<Identity>;

    #[storage(read, write)]
    fn constructor(admin: Identity);

    /// Starts an auction with a seller, selling asset, accepted bid asset, initial price, a
    /// possible reserve price, and duration of the auction.
    ///
    /// This function will return the newly created auction's ID number which is used to
    /// interact with the auction.
    ///
    /// # Arguments
    ///
    /// `ContractId` - contractID of the nft.
    /// `token_id` - token_id of the nft.
    /// `duration` - The length of time the auction should be open.
    /// `initial_price` - The starting price at which the auction should start.
    /// `reserve_price` - The price at which a buyer may purchase the `sell_asset` outright.
    /// `seller` - The seller for this auction.
    /// `sell_asset` - The enum that contains information about what is being auctioned off.
    ///
    /// # Reverts
    ///
    /// * When the `reserve_price` is less than `initial_price` and a reserve is set.
    /// * When the `duration` of the auction is set to zero.
    /// * When the `bid_asset` amount is not zero.
    /// * When the `initial_price` for tokens is set to zero.
    /// * When the native asset amount sent and the `sell_asset` enum do not match.
    /// * When the native asset type sent and the `sell_asset` enum do not match.
    /// * When the `initial_price` for NFTs is not one.
    /// * When transfering of the NFT asset to the contract failed.
    #[payable, storage(read, write)]
    fn borrow_nft(id: ContractId, token_id: u64, seller: Identity, start_time: u64, end_time: u64, initial_price: u64);

    #[storage(read)]
    fn borrowed_nft_info(id: ContractId, token_id: u64) -> [Option<borrowNft>; 5];

    #[storage(read, write)]
    fn borrowed_nft_withdraw(id: ContractId, token_id: u64);

    // Changes the contract's admin.
    // 
    // This new admin will have access to minting if `access_control` is set to true and be able
    // to change the contract's admin to a new admin.
    // 
    // # Arguments
    // 
    // * `admin` - The user which is to be set as the new admin.
    // 
    // # Reverts
    // 
    // * When the sender is not the `admin` in storage.
    #[storage(read, write)]
    fn set_admin(admin: Identity);

    #[storage(read, write)]
    fn set_manager(manager: Identity);

    #[storage(read, write)]
    fn set_protocol_fee(id: ContractId, amount: u64);

    #[storage(read, write)]
    fn list_nft(id: ContractId, token_id: u64, price: u64);

    #[storage(read, write)]
    fn delist_nft(id: ContractId, token_id: u64);

    #[storage(read, write)]
    fn change_nft_price(id: ContractId, token_id: u64, new_price: u64);

    #[storage(read)]
    fn get_nft_data(id: ContractId, token_id: u64) -> Option<ListNft>;

    #[storage(read)]
    fn get_protocol_fee(id: ContractId) -> u64;

    #[storage(read)]
    fn get_default_protocol_feee() -> u64;

    fn get_balance() -> u64;

    #[storage(read)]
    fn withdraw_balance(amount: u64);

    #[storage(read, write)]
    fn whiltest_contract(id: ContractId);

    #[storage(read, write)]
    fn unwhiltest_contract(id: ContractId);

    #[storage(read)]
    fn get_whiltested_contract(id: ContractId) -> bool;
}
