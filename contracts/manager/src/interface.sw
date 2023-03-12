library interface;

dep data_structure;

use data_structure::{Auction, ListNft, OfferNft, Royalty, WalletNft};

abi NftMarketplace {
    // Returns the current admin for the contract.
    // 
    // # Reverts
    // 
    // * When the contract does not have an admin.
    #[storage(read)]
    fn admin() -> Identity;

    #[storage(write)]
    fn constructor(access_control: bool, admin: Identity);

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
    #[storage(read, write)]
    fn create_auction(id: ContractId, token_id: u64, seller: Identity, duration: u64, initial_price: u64, reserve_price: Option<u64>);

    #[payable, storage(read, write)]
    fn bid(id: ContractId, token_id: u64);

    #[storage(read, write)]
    fn cancel_auction(id: ContractId, token_id: u64);

    #[storage(read, write)]
    fn auction_withdraw(id: ContractId, token_id: u64);

    #[storage(read)]
    fn auction_info(id: ContractId, token_id: u64) -> Option<Auction>;

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
    fn set_royalty(id: ContractId, royalty: Royalty);
    #[storage(read, write)]
    fn list_nft(id: ContractId, token_id: u64, price: u64);

    #[storage(read, write)]
    fn buy_nft(id: ContractId, token_id: u64);

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

    #[storage(read)]
    fn get_royalty(id: ContractId) -> Option<Royalty>;

    #[storage(read, write)]
    fn withdraw_royalty(id: ContractId, amount: u64);

    #[storage(read, write)]
    fn make_offer(id: ContractId, token_id: u64);

    // #[storage(read, write)]
    // fn make_offer(id: ContractId, token_id: u64, price: u64);
    #[storage(read)]
    fn get_offer(id: ContractId, token_id: u64) -> Option<OfferNft>;

    #[storage(read, write)]
    fn accept_offer(id: ContractId, token_id: u64);

    #[storage(read, write)]
    fn change_offer(id: ContractId, token_id: u64, price: u64);

    fn get_balance() -> u64;

    #[storage(read)]
    fn withdraw_balance(amount: u64);
}
