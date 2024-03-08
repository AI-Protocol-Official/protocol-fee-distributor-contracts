
// ERC20 deployment routines to reuse
const {
	ali_erc20_deploy: deploy_ali_erc20,
} = require("../../ali_token/include/deployment_routines");



/**
 * Deploys the ProtocolFeeDistributorV1 via ERC1967 proxy
 *
 * @param a0 deployer address, required
 * @param reward_token rewards ERC20 token address, required
 * @param malicious true to deploy a malicious impl mock consuming all the gas
 * @returns ProtocolFeeDistributorV1 instance
 */
async function deploy_protocol_fee_distributor(a0, reward_token, malicious = false) {
	// deploy implementation
	const FeeDistributor = artifacts.require(malicious ? "MaliciousFeeDistributor" : "ProtocolFeeDistributorV1");
	const impl = await FeeDistributor.new({ from: a0 });

	// prepare the proxy initialization call bytes
	const init_data = impl.contract.methods.postConstruct(reward_token.address || reward_token).encodeABI();

	// deploy the ERC1967 proxy
	const ERC1967Proxy = artifacts.require("ERC1967Proxy");
	const proxy = await ERC1967Proxy.new(impl.address, init_data, { from: a0 });

	// cast proxy to the correct ABI
	return await FeeDistributor.at(proxy.address);
}

// export public deployment API
module.exports = {
	deploy_ali_erc20,
	deploy_protocol_fee_distributor,
};
