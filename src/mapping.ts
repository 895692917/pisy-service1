import { BigInt,Address } from "@graphprotocol/graph-ts"
import {
  tete,
  Approval,
  ApprovalForAll,
  OwnershipTransferred,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer
} from "../generated/tete/tete"
import { ExampleEntity,User,Token } from "../generated/schema"

export function handleApproval(event: Approval): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.owner = event.params.owner
  entity.approved = event.params.approved

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.DEFAULT_ADMIN_ROLE(...)
  // - contract.MINTER_ROLE(...)
  // - contract.balanceOf(...)
  // - contract.baseURI(...)
  // - contract.getApproved(...)
  // - contract.getRoleAdmin(...)
  // - contract.getRoleMember(...)
  // - contract.getRoleMemberCount(...)
  // - contract.hasRole(...)
  // - contract.isApprovedForAll(...)
  // - contract.name(...)
  // - contract.owner(...)
  // - contract.ownerOf(...)
  // - contract.royaltyInfo(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.tokenByIndex(...)
  // - contract.tokenOfOwnerByIndex(...)
  // - contract.tokenURI(...)
  // - contract.totalSupply(...)
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleTransfer(event: Transfer): void {
  let token = Token.load("0x1643650EBf0BdBebcB04f484730C181Fa244eebA");
  if(token == null){
    token = new Token("0x1643650EBf0BdBebcB04f484730C181Fa244eebA");
    token.decimals = BigInt.fromI32(18);
    token.name = "";
    token.symbol = "";
    token.totalSupply = BigInt.fromI32(0);
    token.txCount = BigInt.fromI32(0);
    token.holders = BigInt.fromI32(1);
  }
  token.txCount = token.txCount.plus(BigInt.fromI32(1));
  if(Address.fromHexString('0x0000000000000000000000000000000000000000') == event.params.from){
    token.totalSupply = token.totalSupply.plus(event.params.tokenId);
  }else{
    let from  = User.load(event.params.from.toHex());
    if(from == null){
      from = new User(event.params.from.toHex());
      from.id = event.params.from.toHex();
      from.balance = BigInt.fromI32(0);
      from.txCount = BigInt.fromI32(0);
    }
    from.txCount = from.txCount.plus( BigInt.fromI32(1));
    from.balance = from.balance.minus(event.params.tokenId);
    from.save();
  }

  if(Address.fromHexString('0x0000000000000000000000000000000000000000') == event.params.to ){
    token.totalSupply = token.totalSupply.minus(event.params.tokenId);
  }else{
    let to  = User.load(event.params.to.toHex());
    if(to == null){
      to = new User(event.params.to.toHex());
      to.id = event.params.to.toHex();
      to.balance = BigInt.fromI32(0);
      to.txCount = BigInt.fromI32(0);
      token.holders = token.holders.plus(BigInt.fromI32(1));
    }
    to.txCount = to.txCount.plus(BigInt.fromI32(1)) ;
    to.balance = to.balance.plus(event.params.tokenId);
    to.save();
  }
  token.save();
}
