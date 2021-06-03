
const truffleAssert = require("truffle-assertions");
const tokenRegistry = artifacts.require("DEXTokenRegistry");

contract("dexTokenRegistry", async (accounts) => {
    let __contract;
    const __owner = accounts[0];
    const __user1 = accounts[1];
    const __tokenAddr1 = '0xce5783B241F27F786579cB4F26cD0a2E4fD15318'
    const __tokenAddr2 = '0x0705cAC4bebeef8593046C29C2f90e1E803f4919'
    const __tokenAddr3 = '0x7885916323748d95Af838F4556F691D20e45FD73'

  before(async () => {
      __contract = await tokenRegistry.deployed();
      __contractAddress = __contract.address;
  });

  it("should set deployer as owner", async function() {
    const _result = await __contract.owner();
    assert.strictEqual(_result, __owner, "Owner is not deployer");
  });
  
  it("should not allow non-admins to add lists", async function() {
    __listName = 'testList';
    await truffleAssert.reverts(
      __contract.addList(__listName, {
        from: __user1
      }),
        "Ownable: caller is not the owner"
    );
  });
  
  it("should allow admins to add lists", async function() {
    __listName = 'testList';
    __listId = 1;

    const listCountBefore = await __contract.listCount();
    let tx = await __contract.addList(__listName, { from: __owner });
    truffleAssert.eventEmitted(tx, 'AddList', (ev) => {
        return ev.listId.toNumber() === __listId && ev.listName === __listName;
    });
    const listCountAfter = await __contract.listCount();
    assert.equal(listCountAfter.toNumber(), listCountBefore.toNumber() +1);


  });

  it("should not allow non-admins to add tokens", async function() {
    __listId = 1;
    await truffleAssert.reverts(
      __contract.addTokens(__listId, [__tokenAddr1], {
        from: __user1
      }),
        "Ownable: caller is not the owner"
    );
  });

  it("should allow admins to add tokens", async function() {
    __tokenAddresses = [__tokenAddr1,__tokenAddr2];
    __listId = 1;

    assert.isFalse(await __contract.isTokenActive.call(__listId,__tokenAddr1));
    const tx = await __contract.addTokens(__listId, __tokenAddresses, { from: __owner });
    assert.isTrue(await __contract.isTokenActive.call(__listId,__tokenAddr1));

    truffleAssert.eventEmitted(tx, 'AddToken', (ev) => {
      return ev.listId.toNumber() === __listId && ev.token === __tokenAddr1;
    });

    truffleAssert.eventEmitted(tx, 'AddToken', (ev) => {
      return ev.listId.toNumber() === __listId && ev.token === __tokenAddr2;
    });

  });

  it("should revert duplicate tokens", async function() {
    __listId = 1;
    const tx = await __contract.addTokens(__listId, [__tokenAddr3], { from: __owner });
    
    await truffleAssert.reverts(
      __contract.addTokens(__listId, [__tokenAddr3], {
        from: __owner
      }),
        "DEXTokenRegistry : DUPLICATE_TOKEN"
    );

  });

  it("should revert invalid listId", async function() {
    __listId = 50;
    
    await truffleAssert.reverts(
      __contract.addTokens(__listId, [__tokenAddr3], {
        from: __owner
      }),
        "DEXTokenRegistry : INVALID_LIST"
    );

  });

  it("should remove tokens", async function() {
    __listId = 1;
    const tcrs_before = await __contract.tcrs.call(__listId);
    tokenCount_before = tcrs_before.activeTokenCount.toNumber();
    const tx = await __contract.removeTokens(__listId, [__tokenAddr2], { from: __owner });
    const tcrs_after = await __contract.tcrs.call(__listId);
    tokenCount_after = tcrs_after.activeTokenCount.toNumber();

    assert.equal(tokenCount_before-1, tokenCount_after);

    truffleAssert.eventEmitted(tx, 'RemoveToken', (ev) => {
        return ev.listId.toNumber() === __listId && ev.token === __tokenAddr2;
    });

    assert.isFalse(await __contract.isTokenActive.call(__listId,__tokenAddr2));

  });

  it("should revert transaction when trying to remove inactive tokens", async function() {
    __listId = 1;

    await truffleAssert.reverts(
      __contract.removeTokens(__listId, [__tokenAddr2], {
        from: __owner
      }),
        "DEXTokenRegistry : INACTIVE_TOKEN"
    );

  });

  it("should transfer ownership", async function() {
    __listId = 1;

    assert.equal(await __contract.owner(), __owner);
    const tx = await __contract.transferOwnership(__user1, { from: __owner });
    assert.equal(await __contract.owner(), __user1);

  });

});



