contract;

dep data_structure;
dep errors;
dep events;
dep interface;
dep external_interface;

use data_structure::{Auction, ListNft, OfferNft, Royalty, State, WalletNft};
use errors::{AccessError, InitError, InputError, UserError};
use events::{
    AdminChangedEvent,
    BidEvent,
    CancelAuctionEvent,
    CreateAuctionEvent,
    ManagerChangeEvent,
    NFTBoughtEvent,
    NFTChangeOfferEvent,
    NFTDeListedEvent,
    NFTListedEvent,
    NFTOfferAcceptEvent,
    NFTOfferEvent,
    NFTPriceChangeEvent,
    WithdrawAuctionEvent,
};
use interface::NftMarketplace;
use external_interface::externalAbi;

use std::{
    auth::msg_sender,
    block::height,
    call_frames::contract_id,
    constants::{
        BASE_ASSET_ID,
        ZERO_B256,
    },
    context::{
        balance_of,
        msg_amount,
    },
    logging::log,
    storage::StorageMap,
    storage::StorageVec,
    token::transfer,
};

storage {
    // Stores the user that is permitted to be handle the admin Operations of the contract.
    // Only the `admin` is allowed to change the `admin` of the contract.
    // admin: Option<Identity> = Option::Some(Identity::Address(Address::from(0xfec21894a55b54b3dd89ab836856403d20f20d2af3694e13e64a32b3e1d41f0a))),
    /// Determines if only the contract's `admin` is allowed to call the mint function.
    /// This is only set on the initalization of the contract.
    access_control: bool = false,
    // /// Stores the user that is permitted to mint if `access_control` is set to true.
    // /// Will store `None` if this contract does not have `access_control` set.
    // /// Only the `admin` is allowed to change the `admin` of the contract.
    admin: Option<Identity> = Option::None,
    manager: Option<Identity> = Option::None,
    // // Total Number of NFTS Listed on Platform
    // no_of_nft_listed: u64 = 0,
    // //No of NFts listed on platform by a single user
    // // Map(user(Identity) => no_of_nft_listed)
    // no_of_nft_listed_by_user: StorageMap<Option<Identity>, u64> = StorageMap{},
    // 1000 == 100%
    default_protocol_fee: u64 = 10000,
    protocol_fee: StorageMap<ContractId, Option<u64>> = StorageMap {},
    list_nft: StorageMap<(ContractId, u64), Option<ListNft>> = StorageMap {},
    offer_nft: StorageMap<(ContractId, u64), Option<OfferNft>> = StorageMap {},
    // royalty_artist: StorageMap<ContractId, Option<Identity>> = StorageMap {},
    royalty: StorageMap<ContractId, Option<Royalty>> = StorageMap {},
    // royalty_amount: StorageMap<Identity, u64> = StorageMap {},
    // Stores the auction information based on auction ID.
    /// Map(auction id => auction)
    auctions: StorageMap<(ContractId, u64), Option<Auction>> = StorageMap {},
    // auctions1: StorageMap<(ContractId, u64), StorageVec<Auction>> = StorageMap {StorageVec},
    auctions2: StorageMap<(ContractId, u64), [Auction; 10]> = StorageMap {},
}

impl NftMarketplace for Contract {
    #[storage(read)]
    fn admin() -> Identity {
        storage.admin.unwrap()
    }

    #[storage(write)]
    fn constructor(access_control: bool, admin: Identity) {
        // This function can only be called once so if the token supply is already set it has
        // already been called
        let admin = Option::Some(admin);
        require((access_control && admin.is_some()) || (!access_control && admin.is_none()), InitError::AdminIsNone);

        storage.access_control = access_control;
        storage.admin = admin;
    }

    #[storage(read, write)]
    fn set_admin(admin: Identity) {
        // Ensure that the sender is the admin
        let admin = Option::Some(admin);
        let current_admin = storage.admin;
        require(current_admin.is_some() && msg_sender().unwrap() == current_admin.unwrap(), AccessError::SenderCannotSetAccessControl);
        storage.admin = admin;

        log(AdminChangedEvent {
            mew_admin: admin.unwrap(),
        });
    }

    #[storage(read, write)]
    fn set_manager(manager: Identity) {
        // Ensure that the sender is the admin
        let current_admin = storage.admin;
        require(current_admin.is_some() && msg_sender().unwrap() == current_admin.unwrap(), AccessError::SenderCannotSetAccessControl);
        storage.manager = Option::Some(manager);

        log(ManagerChangeEvent {
            mew_manager: manager,
        });
    }

    #[storage(read, write)]
    fn set_protocol_fee(id: ContractId, amount: u64) {
        let current_admin = storage.admin;
        require(current_admin.is_some() && msg_sender().unwrap() == current_admin.unwrap(), AccessError::SenderCannotSetAccessControl);
        storage.protocol_fee.insert(id, Option::Some(amount));
    }

    #[storage(read, write)]
    fn set_royalty(id: ContractId, royalty: Royalty) {
        // 1000 = 10%
        require(royalty.royalty <= 1000, InputError::IncorrectAmountProvided);
        let current_admin = storage.admin;
        require(current_admin.is_some() && msg_sender().unwrap() == current_admin.unwrap(), AccessError::SenderCannotSetAccessControl);
        storage.royalty.insert(id, Option::Some(royalty));
    }

    #[storage(read, write)]
    fn list_nft(id: ContractId, token_id: u64, price: u64) {
        require(price != 0, InputError::PriceCantBeZero);
        require(!storage.list_nft.get((id, token_id)).is_some(), AccessError::NFTAlreadyListed);

        let sender = msg_sender().unwrap();
        let nft = ListNft {
            owner: sender,
            price: price,
        };
        storage.list_nft.insert((id, token_id), Option::Some(nft));

        let x = abi(externalAbi, id.value);
        x.transfer_from(sender, Identity::ContractId(contract_id()), token_id);

        log(NFTListedEvent {
            owner: sender,
            nft_contract: id,
            token_id: token_id,
            price: price,
        });
    }

    #[storage(read, write)]
    fn buy_nft(id: ContractId, token_id: u64) {
        let nft_data = storage.list_nft.get((id, token_id));
        require(nft_data.is_some(), AccessError::NFTNotListed);
        let nft = nft_data.unwrap();
        require(nft.price == msg_amount(), InputError::IncorrectAmountProvided);

        let mut royalty_amount = 0;
        let royalty_data = storage.royalty.get(id);
        if royalty_data.is_some() {
            let mut royalty = royalty_data.unwrap();
            royalty_amount = (nft.price * royalty.royalty) / 10000;
            royalty.total_royalty += royalty_amount;
            storage.royalty.insert(id, Option::Some(royalty));
        }

        let mut fee = storage.default_protocol_fee;
        if storage.protocol_fee.get(id).is_some() {
            fee = storage.protocol_fee.get(id).unwrap();
        }
        let protocol_amount = (nft.price * fee) / 10000;
        let user_amount = nft.price - protocol_amount - royalty_amount;

        // transfer offerer amount back to offerer's account
        let offer_data = storage.offer_nft.get((id, token_id));
        if offer_data.is_some() {
            let data = offer_data.unwrap();
            transfer(data.price, BASE_ASSET_ID, data.offerer);
            storage.offer_nft.insert((id, token_id), Option::None());
        }

        // update list nft data
        storage.list_nft.insert((id, token_id), Option::None());
        let sender = msg_sender().unwrap();
        let x = abi(externalAbi, id.value);
        x.transfer_from(Identity::ContractId(contract_id()), sender, token_id);

        log(NFTBoughtEvent {
            buyer: sender,
            seller: nft.owner,
            nft_contract: id,
            token_id: token_id,
            price: nft.price,
        });
    }

    #[storage(read, write)]
    fn delist_nft(id: ContractId, token_id: u64) {
        let nft_data = storage.list_nft.get((id, token_id));
        require(nft_data.is_some(), AccessError::NFTNotListed);
        let sender = msg_sender().unwrap();
        let nft = nft_data.unwrap();
        require(nft.owner == sender, AccessError::SenderNotOwner);

        storage.list_nft.insert((id, token_id), Option::None());
        // transfer offerer amount back to offerer's account
        let offer_data = storage.offer_nft.get((id, token_id));
        if offer_data.is_some() {
            let data = offer_data.unwrap();
            transfer(data.price, BASE_ASSET_ID, data.offerer);
            storage.offer_nft.insert((id, token_id), Option::None());
        }

        let x = abi(externalAbi, id.value);
        x.transfer_from(Identity::ContractId(contract_id()), sender, token_id);

        log(NFTDeListedEvent {
            owner: sender,
            nft_contract: id,
            token_id: token_id,
        });
    }

    #[storage(read, write)]
    fn change_nft_price(id: ContractId, token_id: u64, price: u64) {
        let nft_data = storage.list_nft.get((id, token_id));
        require(nft_data.is_some(), AccessError::NFTNotListed);
        let sender = msg_sender().unwrap();
        let mut nft = nft_data.unwrap();
        require(nft.owner == sender, AccessError::SenderNotOwner);

        let old_price = nft.price;
        nft.price = price;
        storage.list_nft.insert((id, token_id), Option::Some(nft));

        log(NFTPriceChangeEvent {
            owner: nft.owner,
            nft_contract: id,
            token_id: token_id,
            new_price: price,
            old_price,
        });
    }

    #[storage(read)]
    fn get_nft_data(id: ContractId, token_id: u64) -> Option<ListNft> {
        storage.list_nft.get((id, token_id))
    }

    #[storage(read)]
    fn get_protocol_fee(id: ContractId) -> u64 {
        let fee = storage.protocol_fee.get(id);
        if fee.is_some() {
            return fee.unwrap();
        }
        storage.default_protocol_fee
    }

    #[storage(read)]
    fn get_default_protocol_feee() -> u64 {
        storage.default_protocol_fee
    }

    #[storage(read)]
    fn get_royalty(id: ContractId) -> Option<Royalty> {
        storage.royalty.get(id)
    }

    #[storage(read, write)]
    fn withdraw_royalty(id: ContractId, amount: u64) {
        let mut royalty_data = storage.royalty.get(id);
        require(royalty_data.is_some(), AccessError::NoRoyaltyFound);
        let mut royalty = royalty_data.unwrap();
        require(royalty.total_royalty >= amount, InputError::IncorrectAmountProvided);
        require(royalty.artist == msg_sender().unwrap(), AccessError::SenderNotArtist);
        transfer(amount, BASE_ASSET_ID, royalty.artist);
        royalty.total_royalty -= amount;
        storage.royalty.insert(id, Option::Some(royalty));
    }

    #[storage(read, write)]
    fn make_offer(id: ContractId, token_id: u64) {
        let mut amount = msg_amount();
        require(amount != 0, InputError::PriceCantBeZero);

        let data_offer = storage.offer_nft.get((id, token_id));
        let sender = msg_sender().unwrap();
        // transfer previous user amount back to user's account
        if data_offer.is_some() {
            let data = data_offer.unwrap();
            if data.offerer == sender {
                amount += data.price;
            } else {
                transfer(data.price, BASE_ASSET_ID, data.offerer);
            }
            require(amount >= data.price, InputError::AmountCantBeLessThanLastOfferer);
        }

        let nft = OfferNft {
            offerer: sender,
            price: amount,
        };
        storage.offer_nft.insert((id, token_id), Option::Some(nft));

        log(NFTOfferEvent {
            offerer: sender,
            nft_contract: id,
            token_id: token_id,
            price: amount,
        });
    }

    // #[storage(read, write)]
    // fn make_offer(id: ContractId, token_id: u64, price: u64) {
    //     require(price != 0, InputError::PriceCantBeZero);
    //     require(storage.nft_listed.get((Option::Some(id), token_id)), AccessError::NFTNotListed);
    //     require(price == msg_amount(), InputError::IncorrectAmountProvided);
    //     let nft_contract: b256 = id.into();
    //     // transfer previous user amount back to user's account
    //     let data = storage.offer_nft.get((Option::Some(id), token_id));
    //     if data.offerer.is_some() {
    //         transfer(data.price, BASE_ASSET_ID, data.offerer.unwrap());
    //     }
    //     let nft = OfferNft {
    //         offerer: Option::Some(msg_sender().unwrap()),
    //         price: price,
    //     };
    //     storage.offer_nft.insert((Option::Some(id), token_id), nft);
    //     log(NFTOfferEvent {
    //         offerer: msg_sender().unwrap(),
    //         nft_contract: id,
    //         token_id: token_id,
    //         price: price,
    //     });
    // }
    #[storage(read)]
    fn get_offer(id: ContractId, token_id: u64) -> Option<OfferNft> {
        storage.offer_nft.get((id, token_id))
    }

    #[storage(read, write)]
    fn accept_offer(id: ContractId, token_id: u64) {
        let data_offer = storage.offer_nft.get((id, token_id));
        require(data_offer.is_some(), InputError::OffererNotExists);
        let data = data_offer.unwrap();
        let sender = msg_sender().unwrap();

        let mut royalty = 0;
        let royalty_data = storage.royalty.get(id);
        if royalty_data.is_some() {
            let mut royalty_data = royalty_data.unwrap();
            royalty = (data.price * royalty_data.royalty) / 10000;
            royalty_data.total_royalty += royalty;
            storage.royalty.insert(id, Option::Some(royalty_data));
        }

        let mut fee = storage.default_protocol_fee;
        if storage.protocol_fee.get(id).is_some() {
            fee = storage.protocol_fee.get(id).unwrap();
        }
        let protocol_amount = (data.price * fee) / 10000;
        let user_amount = data.price - protocol_amount - royalty;

        // user amount
        transfer(user_amount, BASE_ASSET_ID, sender);
        // close the offer
        storage.offer_nft.insert((id, token_id), Option::None());

        let x = abi(externalAbi, id.value);
        let list_nft = storage.list_nft.get((id, token_id));
        let mut owner = Identity::ContractId(BASE_ASSET_ID);
        if list_nft.is_some() {
            owner = list_nft.unwrap().owner;
            require(owner == sender, AccessError::SenderNotOwner);
            storage.list_nft.insert((id, token_id), Option::None());
            x.transfer_from(Identity::ContractId(contract_id()), data.offerer, token_id);
        } else {
            owner = x.owner_of(token_id);
            require(owner == sender, AccessError::SenderNotOwner);
            x.transfer_from(owner, data.offerer, token_id);
        }

        log(NFTOfferAcceptEvent {
            owner: owner,
            offerer: data.offerer,
            nft_contract: id,
            token_id: token_id,
            price: data.price,
        });
    }

    #[storage(read, write)]
    fn change_offer(id: ContractId, token_id: u64, price: u64) {
        require(price != 0, InputError::PriceCantBeZero);
        require(price == msg_amount(), InputError::IncorrectAmountProvided);

        let data_offer = storage.offer_nft.get((id, token_id));
        require(data_offer.is_some(), InputError::OffererNotExists);
        let mut data = data_offer.unwrap();
        let sender = msg_sender().unwrap();
        require(data.offerer == sender, AccessError::SenderDidNotMakeOffer);
        require(data.price <= price, InputError::AmountCantBeLessThanLastOfferer);

        // Change the offer
        let old_price = data.price;
        data.price = price;

        storage.offer_nft.insert((id, token_id), Option::Some(data));

        log(NFTChangeOfferEvent {
            offerer: sender,
            nft_contract: id,
            token_id: token_id,
            new_price: price,
            old_price,
        });
    }

    fn get_balance() -> u64 {
        balance_of(BASE_ASSET_ID, contract_id())
    }

    #[storage(read)]
    fn withdraw_balance(amount: u64) {
        let current_admin = storage.admin;
        require(amount < balance_of(BASE_ASSET_ID, contract_id()), InputError::IncorrectAmountProvided);
        require(current_admin.is_some() && msg_sender().unwrap() == current_admin.unwrap(), AccessError::SenderCannotSetAccessControl);
        transfer(amount, BASE_ASSET_ID, current_admin.unwrap());
    }

    #[storage(read, write)]
    fn create_auction(
        id: ContractId,
        token_id: u64,
        seller: Identity,
        duration: u64,
        initial_price: u64,
        reserve_price: Option<u64>,
    ) {
        let current_admin = storage.admin;
        let current_manager = storage.manager;
        require((current_admin.is_some() && msg_sender().unwrap() == current_admin.unwrap()) || (current_manager.is_some() && msg_sender().unwrap() == current_manager.unwrap()), AccessError::SenderCannotSetAccessControl);

                // Either there is no reserve price or the reserve must be greater than the initial price
        require(reserve_price.is_none() || (reserve_price.is_some() && reserve_price.unwrap() >= initial_price), InitError::ReserveLessThanInitialPrice);
        require(duration != 0, InitError::AuctionDurationNotProvided);

        // Selling NFTs
        require(initial_price != 0, InitError::CannotAcceptMoreThanOneNFT);

        // Setup auction
        let auction = Auction::new(height() + duration, initial_price, reserve_price, seller);

        // Store the auction information
        storage.auctions.insert((id, token_id), Option::Some(auction));

        let x = abi(externalAbi, id.value);
        x.transfer_from(seller, Identity::ContractId(contract_id()), token_id);

        log(CreateAuctionEvent {
            contract_id: id,
            token_id,
            seller,
            end_block: height() + duration,
            initial_price,
            reserve_price,
        });
    }

    #[payable, storage(read, write)]
    fn bid(id: ContractId, token_id: u64) {
        let auction = storage.auctions.get((id, token_id));
        require(auction.is_some(), InputError::AuctionDoesNotExist);

        let mut auction = auction.unwrap();
        let sender = msg_sender().unwrap();
        require(sender != auction.seller, UserError::BidderIsSeller);
        require(auction.state == State::Open && height() <= auction.end_block, AccessError::AuctionIsNotOpen);
        // Combine the user's previous deposits and the current bid for the
        // total deposits to the auction the user has made
        let mut total_bid = msg_amount();
        // transfer previous user amount back to user's account
        if auction.highest_bidder.is_some() {
            if auction.highest_bidder.unwrap() == sender {
                total_bid = auction.bidder_amount.unwrap() + total_bid;
            } else {
                transfer(auction.bidder_amount.unwrap(), BASE_ASSET_ID, auction.highest_bidder.unwrap());
            }
        }

        require(total_bid >= auction.initial_price, InputError::InitialPriceNotMet);

        // Check if reserve has been met if there is one set
        if auction.reserve_price.is_some()
            && total_bid >= auction.reserve_price.unwrap()
        {
            let x = abi(externalAbi, id.value);
            x.transfer_from(Identity::ContractId(contract_id()), sender, token_id);
            auction.state = State::Closed;
        }

        // Update the auction's information and store the new state
        auction.highest_bidder = Option::Some(sender);
        auction.bidder_amount = Option::Some(total_bid);
        storage.auctions.insert((id, token_id), Option::Some(auction));

        log(BidEvent {
            amount: total_bid,
            user: sender,
            contract_id: id,
            token_id: token_id,
        });
    }

    #[storage(read, write)]
    fn cancel_auction(id: ContractId, token_id: u64) {
        // Make sure this auction exists
        let auction = storage.auctions.get((id, token_id));
        require(auction.is_some(), InputError::AuctionDoesNotExist);

        let mut auction = auction.unwrap();
        require(auction.state == State::Open && height() <= auction.end_block, AccessError::AuctionIsNotOpen);
        require(msg_sender().unwrap() == auction.seller, AccessError::SenderIsNotSeller);

        if auction.highest_bidder.is_some() {
            transfer(auction.bidder_amount.unwrap(), BASE_ASSET_ID, auction.highest_bidder.unwrap());
        }
        // Update and store the auction's information
        auction.highest_bidder = Option::None();
        auction.state = State::Closed;
        storage.auctions.insert((id, token_id), Option::Some(auction));
        let x = abi(externalAbi, id.value);
        x.transfer_from(Identity::ContractId(contract_id()), msg_sender().unwrap(), token_id);

        log(CancelAuctionEvent {
            contract_id: id,
            token_id,
        });
    }

    #[storage(read)]
    fn auction_info(id: ContractId, token_id: u64) -> Option<Auction> {
        storage.auctions.get((id, token_id))
    }
    #[storage(read, write)]
    fn auction_withdraw(id: ContractId, token_id: u64) {
        // Make sure this auction exists
        let auction = storage.auctions.get((id, token_id));
        require(auction.is_some(), InputError::AuctionDoesNotExist);

        // Cannot withdraw if the auction is still on going
        let mut auction = auction.unwrap();
        require(auction.state == State::Closed || height() >= auction.end_block, AccessError::AuctionIsNotClosed);
        if (height() >= auction.end_block
            && auction.state == State::Open)
        {
            auction.state = State::Closed;
            storage.auctions.insert((id, token_id), Option::Some(auction));
        }

        let sender = msg_sender().unwrap();
        let bidder = auction.highest_bidder;

        let x = abi(externalAbi, id.value); 
        // Withdraw owed assets
        if ((bidder.is_some()
            && sender == bidder.unwrap())
            || (bidder.is_none()
            && sender == auction.seller))
        {
            x.transfer_from(Identity::ContractId(contract_id()), sender, token_id);
        } else if (sender == auction.seller) {
            x.transfer_from(Identity::ContractId(contract_id()), sender, token_id);
        }
        log(WithdrawAuctionEvent {
            contract_id: id,
            token_id: token_id,
            highest_bidder: bidder,
            bidder_amount: auction.bidder_amount,
        });
    }
}
