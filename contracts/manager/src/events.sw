library events;

pub struct AdminChangedEvent {
    // The user which is now the admin of this contract.
    // If there is no longer an admin then the `Option` will be `None`.
    mew_admin: Identity,
}

pub struct ManagerChangeEvent {
    // The user which is now the admin of this contract.
    // If there is no longer an admin then the `Option` will be `None`.
    mew_manager: Identity,
}

pub struct WithdrawAuctionEvent {
    contract_id: ContractId,
    token_id: u64,
    /// The current highest bidder of the auction.
    highest_bidder: Option<Identity>,
    /// the bidding amount of the auction.
    bidder_amount: Option<u64>,
}

pub struct BidEvent {
    contract_id: ContractId,
    amount: u64,
    token_id: u64,
    user: Identity,
}

pub struct CreateAuctionEvent {
    contract_id: ContractId,
    token_id: u64,
    seller: Identity,
    end_block: u64,
    initial_price: u64,
    reserve_price: Option<u64>,
}

pub struct CancelAuctionEvent {
    contract_id: ContractId,
    token_id: u64,
}

pub struct NFTListedEvent {
    owner: Identity,
    nft_contract: ContractId,
    token_id: u64,
    price: u64,
}

pub struct NFTBoughtEvent {
    buyer: Identity,
    seller: Identity,
    nft_contract: ContractId,
    token_id: u64,
    price: u64,
}

pub struct NFTDeListedEvent {
    owner: Identity,
    nft_contract: ContractId,
    token_id: u64,
}

pub struct NFTPriceChangeEvent {
    owner: Identity,
    nft_contract: ContractId,
    token_id: u64,
    old_price: u64,
    new_price: u64,
}

pub struct NFTOfferEvent {
    offerer: Identity,
    nft_contract: ContractId,
    token_id: u64,
    price: u64,
}

pub struct NFTOfferAcceptEvent {
    offerer: Identity,
    owner: Identity,
    nft_contract: ContractId,
    token_id: u64,
    price: u64,
}

pub struct NFTChangeOfferEvent {
    offerer: Identity,
    nft_contract: ContractId,
    token_id: u64,
    new_price: u64,
    old_price: u64,
}
