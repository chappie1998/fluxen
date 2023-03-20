library data_structure;

pub struct ListNft {
    owner: Identity,
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

pub struct borrowNft {
    /// The time at which the auction's bidding period should end.
    start_time: u64,
    /// The time at which the auction's bidding period should end.
    end_time: u64,
    /// The current highest bidder of the auction.
    /// The starting price for the auction.
    price: u64,
    /// The seller of the auction.
    buyer: Identity,
}

impl borrowNft {
    pub fn new(
        start_time: u64,
        end_time: u64,
        price: u64,
        buyer: Identity,
    ) -> Self {
        borrowNft {
            start_time,
            end_time,
            price,
            buyer,
        }
    }
}
