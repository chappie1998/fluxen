/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.35.0
  Forc version: 0.35.3
  Fuel-Core version: 0.17.3
*/

import type {
  BigNumberish,
  BN,
  BytesLike,
  Contract,
  DecodedValue,
  FunctionFragment,
  Interface,
  InvokeFunction,
} from 'fuels';

import type { Option, Enum } from "./common";

export type AccessErrorInput = Enum<{ SenderCannotSetAccessControl: [], SenderNotAdmin: [], SenderNotOwner: [], SenderNotOwnerOrApproved: [] }>;
export type AccessErrorOutput = AccessErrorInput;
export type IdentityInput = Enum<{ Address: AddressInput, ContractId: ContractIdInput }>;
export type IdentityOutput = Enum<{ Address: AddressOutput, ContractId: ContractIdOutput }>;
export type InitErrorInput = Enum<{ AdminIsNone: [], CannotReinitialize: [] }>;
export type InitErrorOutput = InitErrorInput;
export type InputErrorInput = Enum<{ AdminDoesNotExist: [], ApprovedDoesNotExist: [], NotEnoughTokensToMint: [], OwnerDoesNotExist: [], TokenDoesNotExist: [], TokenSupplyCannotBeZero: [] }>;
export type InputErrorOutput = InputErrorInput;

export type AddressInput = { value: string };
export type AddressOutput = AddressInput;
export type AdminEventInput = { admin: Option<IdentityInput> };
export type AdminEventOutput = { admin: Option<IdentityOutput> };
export type ApprovalEventInput = { approved: Option<IdentityInput>, owner: IdentityInput, token_id: BigNumberish };
export type ApprovalEventOutput = { approved: Option<IdentityOutput>, owner: IdentityOutput, token_id: BN };
export type BurnEventInput = { owner: IdentityInput, token_id: BigNumberish };
export type BurnEventOutput = { owner: IdentityOutput, token_id: BN };
export type ContractIdInput = { value: string };
export type ContractIdOutput = ContractIdInput;
export type MintEventInput = { owner: IdentityInput, token_id: BigNumberish };
export type MintEventOutput = { owner: IdentityOutput, token_id: BN };
export type OperatorEventInput = { approve: boolean, operator: IdentityInput, owner: IdentityInput };
export type OperatorEventOutput = { approve: boolean, operator: IdentityOutput, owner: IdentityOutput };
export type TokenMetaDataInput = { token_uri: string, name: string };
export type TokenMetaDataOutput = TokenMetaDataInput;
export type TransferEventInput = { from: IdentityInput, sender: IdentityInput, to: IdentityInput, token_id: BigNumberish };
export type TransferEventOutput = { from: IdentityOutput, sender: IdentityOutput, to: IdentityOutput, token_id: BN };

interface PropertyAbiInterface extends Interface {
  functions: {
    admin: FunctionFragment;
    approve: FunctionFragment;
    approved: FunctionFragment;
    balance_of: FunctionFragment;
    burn: FunctionFragment;
    change_max_supply: FunctionFragment;
    constructor: FunctionFragment;
    is_approved_for_all: FunctionFragment;
    max_supply: FunctionFragment;
    mint: FunctionFragment;
    owner_of: FunctionFragment;
    set_admin: FunctionFragment;
    set_approval_for_all: FunctionFragment;
    share_owner: FunctionFragment;
    token_metadata: FunctionFragment;
    total_supply: FunctionFragment;
    transfer_from: FunctionFragment;
  };

  encodeFunctionData(functionFragment: 'admin', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'approve', values: [IdentityInput, BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'approved', values: [BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'balance_of', values: [IdentityInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'burn', values: [BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'change_max_supply', values: [BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'constructor', values: [IdentityInput, BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'is_approved_for_all', values: [IdentityInput, IdentityInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'max_supply', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'mint', values: [IdentityInput, TokenMetaDataInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'owner_of', values: [BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'set_admin', values: [IdentityInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'set_approval_for_all', values: [boolean, IdentityInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'share_owner', values: [IdentityInput, IdentityInput, BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'token_metadata', values: [BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'total_supply', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'transfer_from', values: [IdentityInput, IdentityInput, BigNumberish]): Uint8Array;

  decodeFunctionData(functionFragment: 'admin', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'approve', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'approved', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'balance_of', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'burn', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'change_max_supply', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'constructor', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'is_approved_for_all', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'max_supply', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'mint', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'owner_of', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'set_admin', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'set_approval_for_all', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'share_owner', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'token_metadata', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'total_supply', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'transfer_from', data: BytesLike): DecodedValue;
}

export class PropertyAbi extends Contract {
  interface: PropertyAbiInterface;
  functions: {
    admin: InvokeFunction<[], Option<IdentityOutput>>;
    approve: InvokeFunction<[approved: IdentityInput, token_id: BigNumberish], void>;
    approved: InvokeFunction<[token_id: BigNumberish], Option<IdentityOutput>>;
    balance_of: InvokeFunction<[owner: IdentityInput], BN>;
    burn: InvokeFunction<[token_id: BigNumberish], void>;
    change_max_supply: InvokeFunction<[max_supply: BigNumberish], void>;
    constructor: InvokeFunction<[admin: IdentityInput, max_supply: BigNumberish], void>;
    is_approved_for_all: InvokeFunction<[operator: IdentityInput, owner: IdentityInput], boolean>;
    max_supply: InvokeFunction<[], BN>;
    mint: InvokeFunction<[to: IdentityInput, meta_data: TokenMetaDataInput], void>;
    owner_of: InvokeFunction<[token_id: BigNumberish], Option<IdentityOutput>>;
    set_admin: InvokeFunction<[admin: IdentityInput], void>;
    set_approval_for_all: InvokeFunction<[approve: boolean, operator: IdentityInput], void>;
    share_owner: InvokeFunction<[from: IdentityInput, to: IdentityInput, token_id: BigNumberish], void>;
    token_metadata: InvokeFunction<[token_id: BigNumberish], Option<TokenMetaDataOutput>>;
    total_supply: InvokeFunction<[], BN>;
    transfer_from: InvokeFunction<[from: IdentityInput, to: IdentityInput, token_id: BigNumberish], void>;
  };
}
