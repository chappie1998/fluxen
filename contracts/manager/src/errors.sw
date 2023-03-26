library errors;

pub enum InputError {
    PriceCantBeZero: (),
    IncorrectAmountProvided: (),
    EndblockIsLessThanStartblock: (),
    WrongStartblockProvided: (),
}

pub enum InitError {
    AdminIsNone: (),
}

pub enum AccessError {
    NFTAlreadyListed: (),
    NFTNotListed: (),
    SenderCannotSetAccessControl: (),
    SenderNotAdmin: (),
    SenderNotOwner: (),
    MaximumblockNftLanded: (),
    CantLandNft: (),
    ContractIsNotWhitelisted: (),
    ContractIsAlreadyWhitelisted: (),
}
