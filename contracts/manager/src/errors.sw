library errors;

pub enum InputError {
    PriceCantBeZero: (),
    IncorrectAmountProvided: (),
    EndtimeIsLessThanStarttime: (),
    WrongStarttimeProvided: (),
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
    MaximumTimeNftLanded: (),
    CantLandNft: (),
    ContractIsNotWhitelisted: (),
    ContractIsAlreadyWhitelisted: (),
}
