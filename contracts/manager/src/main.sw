contract;

dep data_structure;
dep errors;
dep events;
dep interface;
dep external_interface;

use data_structure::{borrowNft, ListNft};
use errors::{AccessError, InitError, InputError};
use events::{
    AdminChangedEvent,
    borrowNftEvent,
    ManagerChangeEvent,
    NFTDeListedEvent,
    NFTListedEvent,
    NFTPriceChangeEvent,
    UnwhiteListContract,
    WhiteListContract,
    WithdrawLanedNftEvent,
};
use interface::NftMarketplace;
use external_interface::externalAbi;

use std::{
    auth::msg_sender,
    block::{height, timestamp},
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
    /// Stores the user that is permitted to mint if `access_control` is set to true.
    /// Will store `None` if this contract does not have `access_control` set.
    /// Only the `admin` is allowed to change the `admin` of the contract.
    admin: Option<Identity> = Option::None,
    /// Stores the user that is permitted to mint if `access_control` is set to true.
    /// Will store `None` if this contract does not have `access_control` set.
    /// The `manager` is not allowed to change the `admin` of the contract.
    manager: Option<Identity> = Option::None,
    /// Default protocol fee for the trading
    /// 10000 == 100%
    default_protocol_fee: u64 = 10000,
    /// custom protocol fee for each contract
    /// 10000 == 100%
    protocol_fee: StorageMap<ContractId, u64> = StorageMap {},
    /// Info of the royalty
    /// StorageVec is not allowed to inside storageMap so need to use this method
    whiltest_contract: StorageMap<ContractId, bool> = StorageMap {},
    /// List NFT info
    list_nft: StorageMap<(ContractId, u64), ListNft> = StorageMap {},
    /// Info of the royalty
    /// StorageVec is not allowed to inside storageMap so need to use this method
    borrow_nft: StorageMap<(ContractId, u64), [Option<borrowNft>; 5]> = StorageMap {},
}

impl NftMarketplace for Contract {
    #[storage(read)]
    fn admin() -> Option<Identity> {
        storage.admin
    }
    
    #[storage(read, write)]
    fn constructor(admin: Identity) {
        // This function can only be called once so if the token supply is already set it has
        // already been called
        require(storage.admin.is_none(), InitError::AdminIsNone);
        storage.admin = Option::Some(admin);
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
        storage.protocol_fee.insert(id, amount);
    }

    #[storage(read, write)]
    fn list_nft(id: ContractId, token_id: u64, price: u64) {
        require(storage.whiltest_contract.get(id).unwrap(), AccessError::ContractIsNotWhitelisted);
        require(price != 0, InputError::PriceCantBeZero);
        require(!storage.list_nft.get((id, token_id)).is_some(), AccessError::NFTAlreadyListed);

        let sender = msg_sender().unwrap();
        let nft = ListNft {
            owner: sender,
            price: price,
        };
        storage.list_nft.insert((id, token_id), nft);

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
    fn delist_nft(id: ContractId, token_id: u64) {
        let nft_data = storage.list_nft.get((id, token_id));
        require(nft_data.is_some(), AccessError::NFTNotListed);
        let sender = msg_sender().unwrap();
        let nft = nft_data.unwrap();
        require(nft.owner == sender, AccessError::SenderNotOwner);

        storage.list_nft.remove((id, token_id));

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
        storage.list_nft.insert((id, token_id), nft);

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
    fn whiltest_contract(id: ContractId) {
        require(!storage.whiltest_contract.get(id).unwrap(), AccessError::ContractIsAlreadyWhitelisted);
        let current_admin = storage.admin;
        let current_manager = storage.manager;
        require((current_admin.is_some() && msg_sender().unwrap() == current_admin.unwrap()) || (current_manager.is_some() && msg_sender().unwrap() == current_manager.unwrap()), AccessError::SenderCannotSetAccessControl);
        storage.whiltest_contract.insert(id, true);
        log(WhiteListContract {
            contract_id: id,
        });
    }

    #[storage(read, write)]
    fn unwhiltest_contract(id: ContractId) {
        require(storage.whiltest_contract.get(id).unwrap(), AccessError::ContractIsNotWhitelisted);
        let current_admin = storage.admin;
        let current_manager = storage.manager;
        require((current_admin.is_some() && msg_sender().unwrap() == current_admin.unwrap()) || (current_manager.is_some() && msg_sender().unwrap() == current_manager.unwrap()), AccessError::SenderCannotSetAccessControl);
        storage.whiltest_contract.insert(id, false);
        log(UnwhiteListContract {
            contract_id: id,
        });
    }

    #[storage(read)]
    fn get_whiltested_contract(id: ContractId) -> bool {
        storage.whiltest_contract.get(id).unwrap()
    }

    #[payable, storage(read, write)]
    fn borrow_nft(
        id: ContractId,
        token_id: u64,
        buyer: Identity,
        start_time: u64,
        end_time: u64,
        price: u64,
    ) {
        require(end_time > start_time, InputError::EndtimeIsLessThanStarttime);
        let nft_data = storage.list_nft.get((id, token_id));
        require(nft_data.is_some(), AccessError::NFTNotListed);
        require(price == msg_amount(), InputError::IncorrectAmountProvided);
        require(price == nft_data.unwrap().price, InputError::IncorrectAmountProvided);
        require(start_time > timestamp(), InputError::WrongStarttimeProvided);

        let borrowed_nfts = storage.borrow_nft.get((id, token_id)).unwrap();
        require(borrowed_nfts[4].is_none(), AccessError::MaximumTimeNftLanded);

        let result = get_borrowed_nfts(id, token_id, buyer, start_time, end_time, price, borrowed_nfts);
        storage.borrow_nft.insert((id, token_id), result);

        log(borrowNftEvent {
            contract_id: id,
            token_id,
            buyer,
            start_time,
            end_time,
            price,
        });
    }

    #[storage(read)]
    fn borrowed_nft_info(id: ContractId, token_id: u64) -> [Option<borrowNft>; 5] {
        storage.borrow_nft.get((id, token_id)).unwrap()
    }

    #[storage(read, write)]
    fn borrowed_nft_return(id: ContractId, token_id: u64) {
        // Make sure this borrow_nft exists
        let nft_data = storage.list_nft.get((id, token_id));
        require(nft_data.is_some(), AccessError::NFTNotListed);
        let borrowed_nfts = storage.borrow_nft.get((id, token_id)).unwrap();

        let result = withdraw_borrowed_nft(id, token_id, borrowed_nfts);
        storage.borrow_nft.insert((id, token_id), result);
    }
}

fn get_borrowed_nfts(
    id: ContractId,
    token_id: u64,
    buyer: Identity,
    sb: u64,
    eb: u64,
    price: u64,
    nfts: [Option<borrowNft>; 5],
) -> [Option<borrowNft>; 5] {
    let blank = Option::None;
    let mut result = [blank, blank, blank, blank, blank];
    let borrowing_nft = Option::Some(borrowNft::new(sb, eb, price, buyer));
    if nfts[0].is_none() {
        result = [borrowing_nft, blank, blank, blank, blank];
    } else if nfts[1].is_none() {
        let s1 = nfts[0].unwrap().start_time;
        let e1 = nfts[0].unwrap().end_time;
        if eb < s1 || sb > e1 {
            result = [nfts[0], borrowing_nft, blank, blank, blank];
        }
    } else if nfts[2].is_none() {
        let s1 = nfts[0].unwrap().start_time;
        let e1 = nfts[0].unwrap().end_time;
        let s2 = nfts[1].unwrap().start_time;
        let e2 = nfts[1].unwrap().end_time;
        if (eb < s1 || sb > e1) && (eb < s2 || sb > e2) {
            result = [nfts[0], nfts[1], borrowing_nft, blank, blank];
        }
    } else if nfts[3].is_none() {
        let s1 = nfts[0].unwrap().start_time;
        let e1 = nfts[0].unwrap().end_time;
        let s2 = nfts[1].unwrap().start_time;
        let e2 = nfts[1].unwrap().end_time;
        let s3 = nfts[2].unwrap().start_time;
        let e3 = nfts[2].unwrap().end_time;
        if (eb < s1
            || sb > e1)
            && (eb < s2
            || sb > e2)
            && (eb < s3
            || sb > e3)
        {
            result = [nfts[0], nfts[1], nfts[2], borrowing_nft, blank];
        }
    } else if nfts[4].is_none() {
        let s1 = nfts[0].unwrap().start_time;
        let e1 = nfts[0].unwrap().end_time;
        let s2 = nfts[1].unwrap().start_time;
        let e2 = nfts[1].unwrap().end_time;
        let s3 = nfts[2].unwrap().start_time;
        let e3 = nfts[2].unwrap().end_time;
        let s4 = nfts[3].unwrap().start_time;
        let e4 = nfts[3].unwrap().end_time;
        if (eb < s1
            || sb > e1)
            && (eb < s2
            || sb > e2)
            && (eb < s3
            || sb > e3)
            && (eb < s4
            || sb > e4)
        {
            result = [nfts[0], nfts[1], nfts[2], nfts[4], borrowing_nft];
        }
    }
    require(result[0].is_some(), AccessError::CantLandNft);
    result
}

fn withdraw_borrowed_nft(
    id: ContractId,
    token_id: u64,
    nfts: [Option<borrowNft>; 5],
) -> [Option<borrowNft>; 5] {
    let blank = Option::None;
    let mut result = nfts;
    let x = abi(externalAbi, id.value);
    let this_contract = Identity::ContractId(contract_id());
    if nfts[4].is_some() {
        let nft = nfts[4].unwrap();
        if timestamp() >= nft.end_time {
            result = [nfts[0], nfts[1], nfts[2], nfts[3], blank];
            x.share_owner(nft.buyer, this_contract, token_id);
            log(WithdrawLanedNftEvent {
                contract_id: id,
                token_id: token_id,
                buyer: nft.buyer,
                start_time: nft.start_time,
                end_time: nft.end_time,
            });
        }
    }
    if result[3].is_some() {
        let nft = nfts[3].unwrap();
        if timestamp() >= nft.end_time {
            result = [nfts[0], nfts[1], nfts[2], nfts[4], blank];
            x.share_owner(nft.buyer, this_contract, token_id);
            log(WithdrawLanedNftEvent {
                contract_id: id,
                token_id: token_id,
                buyer: nft.buyer,
                start_time: nft.start_time,
                end_time: nft.end_time,
            });
        }
    }
    if result[2].is_some() {
        let nft = nfts[2].unwrap();
        if timestamp() >= nft.end_time {
            result = [nfts[0], nfts[1], nfts[3], nfts[4], blank];
            x.share_owner(nft.buyer, this_contract, token_id);
            log(WithdrawLanedNftEvent {
                contract_id: id,
                token_id: token_id,
                buyer: nft.buyer,
                start_time: nft.start_time,
                end_time: nft.end_time,
            });
        }
    }
    if result[1].is_some() {
        let nft = nfts[1].unwrap();
        if timestamp() >= nft.end_time {
            result = [nfts[0], nfts[2], nfts[3], nfts[4], blank];
            x.share_owner(nft.buyer, this_contract, token_id);
            log(WithdrawLanedNftEvent {
                contract_id: id,
                token_id: token_id,
                buyer: nft.buyer,
                start_time: nft.start_time,
                end_time: nft.end_time,
            });
        }
    }
    if nfts[0].is_some() {
        let nft = nfts[0].unwrap();
        if timestamp() >= nft.end_time {
            result = [nfts[1], nfts[2], nfts[3], nfts[4], blank];
            x.share_owner(nft.buyer, this_contract, token_id);
            log(WithdrawLanedNftEvent {
                contract_id: id,
                token_id: token_id,
                buyer: nft.buyer,
                start_time: nft.start_time,
                end_time: nft.end_time,
            });
        }
    }
    result
}
