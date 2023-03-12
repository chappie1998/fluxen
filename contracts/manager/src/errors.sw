library errors;

pub enum InputError {
    AdminDoesNotExist: (),
    PriceCantBeZero: (),
    OffererNotExists: (),
    IncorrectAmountProvided: (),
    OfferNotExists: (),
    AmountCantBeLessThanLastOfferer: (),
    InitialPriceNotMet: (),
    AuctionDoesNotExist: (),
}

pub enum InitError {
    AuctionDurationNotProvided: (),
    AdminIsNone: (),
    CannotReinitialize: (),
    ReserveLessThanInitialPrice: (),
    CannotAcceptMoreThanOneNFT: (),
}

pub enum AccessError {
    NFTAlreadyListed: (),
    NFTNotListed: (),
    ProtocolFeeDoesNotExist: (),
    SenderCannotSetAccessControl: (),
    SenderIsOwner: (),
    SenderNotAdmin: (),
    SenderNotArtist: (),
    SenderNotOwner: (),
    SenderNotOwnerOrApproved: (),
    SenderDidNotMakeOffer: (),
    AuctionIsNotOpen: (),
    AuctionDoesNotExist: (),
    SenderIsNotSeller: (),
    AuctionIsNotClosed: (),
    NoRoyaltyFound: (),
}

pub enum UserError {
    BidderIsSeller: (),
    UserHasAlreadyWithdrawn: (),
}
