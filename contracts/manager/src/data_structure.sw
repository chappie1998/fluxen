library data_structure;

// pub struct AuctionAssest {
//     contract_id: ContractId,        
//     token_id: u64,
// }
// impl AuctionAssest {
//     pub fn new(
//         contract_id: ContractId,        
//         token_id: u64,
//     ) -> Self {
//         AuctionAssest {
//             contract_id,
//             token_id,
//         }
//     }
// }
pub struct Royalty {
    artist: Identity,
    royalty: u64,
    total_royalty: u64,
}

pub struct ListNft {
    owner: Identity,
    price: u64,
}

pub struct OfferNft {
    offerer: Identity,
    price: u64,
}

pub struct UserStruct {
    user: Identity,
    no_of_nft_listed: u64,
}

pub struct NFTListed {
    owner: Identity,
    nft_contract: ContractId,
    token_id: u64,
    price: u64,
}

pub struct NFTDeListed {
    owner: Identity,
    nft_contract: ContractId,
    token_id: u64,
}

pub struct ChangeListPrice {
    owner: Identity,
    nft_contract: ContractId,
    token_id: u64,
    old_price: u64,
    new_price: u64,
}

pub struct NFTBought {
    buyer: Identity,
    seller: Identity,
    nft_contract: ContractId,
    token_id: u64,
    price: u64,
}

pub struct WalletNft {
    contract_id: ContractId,
    token: u64,
}

pub struct Auction {
    /// The block at which the auction's bidding period should end.
    end_block: u64,
    /// The current highest bidder of the auction.
    /// The starting price for the auction.
    initial_price: u64,
    /// The price at which the selling asset may be bought outright.
    reserve_price: Option<u64>,
    /// The seller of the auction.
    seller: Identity,
    /// the bidding amount of the auction.
    highest_bidder: Option<Identity>,
    bidder_amount: Option<u64>,
    /// The state of the auction describing if it is open or closed.
    state: State,
}

impl Auction {
    pub fn new(
        end_block: u64,
        initial_price: u64,
        reserve_price: Option<u64>,
        seller: Identity,
    ) -> Self {
        Auction {
            end_block,
            initial_price,
            reserve_price,
            seller,
            highest_bidder: Option::None(),
            bidder_amount: Option::None(),
            state: State::Open,
        }
    }
}

pub enum State {
    /// The state at which the auction is no longer accepting bids.
    Closed: (),
    /// The state where bids may be placed on an auction.
    Open: (),
}

impl core::ops::Eq for State {
    fn eq(self, other: Self) -> bool {
        match (self, other) {
            (State::Open, State::Open) => true,
            (State::Closed, State::Closed) => true,
            _ => false,
        }
    }
}
