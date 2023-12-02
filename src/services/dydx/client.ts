import { DydxClient } from '@dydxprotocol/v3-client';
import config = require('config');
import 'dotenv/config';
import { AlertObject } from '../../types';

class DYDXConnector {
	client: DydxClient | undefined;
	positionID = '0';
	static instance: DYDXConnector | null = null;

	APIKEY: string | undefined;
	APIPASSPHRASE: string | undefined;
	APISECRET: string | undefined;
	STARKPUBLICKEY: string | undefined;
	STARKPRIVATEKEY: string | undefined;
	ETHADDRESS: string | undefined;

	public constructor(alertMessage: AlertObject) {

		switch (alertMessage.exchID) {
			case '1': {
				this.APIKEY = process.env.API_KEY1!;
				this.APIPASSPHRASE = process.env.API_PASSPHRASE1!;
				this.APISECRET = process.env.API_SECRET1!;
				this.STARKPUBLICKEY = process.env.STARK_PUBLIC_KEY1!;
				this.STARKPRIVATEKEY = process.env.STARK_PRIVATE_KEY1!;
				this.ETHADDRESS = process.env.ETH_ADDRESS1!;
				console.log('Selected account: 1');
				break;
			}
      			case '2': {
				this.APIKEY = process.env.API_KEY2!;
				this.APIPASSPHRASE = process.env.API_PASSPHRASE2!;
				this.APISECRET = process.env.API_SECRET2!;
				this.STARKPUBLICKEY = process.env.STARK_PUBLIC_KEY2!;
				this.STARKPRIVATEKEY = process.env.STARK_PRIVATE_KEY2!;
				this.ETHADDRESS = process.env.ETH_ADDRESS2!;
				console.log('Selected account: 2');
				break;
			}
			case '3': {
				this.APIKEY = process.env.API_KEY3!;
				this.APIPASSPHRASE = process.env.API_PASSPHRASE3!;
				this.APISECRET = process.env.API_SECRET3!;
				this.STARKPUBLICKEY = process.env.STARK_PUBLIC_KEY3!;
				this.STARKPRIVATEKEY = process.env.STARK_PRIVATE_KEY3!;
				this.ETHADDRESS = process.env.ETH_ADDRESS3!;
				console.log('Selected account: 3');
				break;
			}
      			case '4': {
				this.APIKEY = process.env.API_KEY4!;
				this.APIPASSPHRASE = process.env.API_PASSPHRASE4!;
				this.APISECRET = process.env.API_SECRET4!;
				this.STARKPUBLICKEY = process.env.STARK_PUBLIC_KEY4!;
				this.STARKPRIVATEKEY = process.env.STARK_PRIVATE_KEY4!;
				this.ETHADDRESS = process.env.ETH_ADDRESS4!;
				console.log('Selected account: 4');
				break;
			}
			case '5': {
				this.APIKEY = process.env.API_KEY5!;
				this.APIPASSPHRASE = process.env.API_PASSPHRASE5!;
				this.APISECRET = process.env.API_SECRET5!;
				this.STARKPUBLICKEY = process.env.STARK_PUBLIC_KEY5!;
				this.STARKPRIVATEKEY = process.env.STARK_PRIVATE_KEY5!;
				this.ETHADDRESS = process.env.ETH_ADDRESS5!;
				console.log('Selected account: 5');
				break;
			}
      			case '6': {
				this.APIKEY = process.env.API_KEY6!;
				this.APIPASSPHRASE = process.env.API_PASSPHRASE6!;
				this.APISECRET = process.env.API_SECRET6!;
				this.STARKPUBLICKEY = process.env.STARK_PUBLIC_KEY6!;
				this.STARKPRIVATEKEY = process.env.STARK_PRIVATE_KEY6!;
				this.ETHADDRESS = process.env.ETH_ADDRESS6!;
				console.log('Selected account: 6');
				break;
			}
			default: {
				this.APIKEY = process.env.API_KEY!;
				this.APIPASSPHRASE = process.env.API_PASSPHRASE!;
				this.APISECRET = process.env.API_SECRET!;
				this.STARKPUBLICKEY = process.env.STARK_PUBLIC_KEY!;
				this.STARKPRIVATEKEY = process.env.STARK_PRIVATE_KEY!;
				this.ETHADDRESS = process.env.ETH_ADDRESS!;
				console.log('Selected account: default');
				break;
			}
    		}

		if (
			!this.APIKEY ||
			!this.APIPASSPHRASE ||
			!this.APIPASSPHRASE
		) {
			console.log('API Key for dYdX is not set as environment variable');
			return;
		}
		if (!this.STARKPUBLICKEY || !this.STARKPRIVATEKEY) {
			console.log('STARK Key for dYdX is not set as environment variable');
			return;
		}

		const apiKeys = {
			key: this.APIKEY,
			passphrase: this.APIPASSPHRASE,
			secret: this.APISECRET
		};

		const starkKeyPair = {
			publicKey: this.STARKPUBLICKEY,
			privateKey: this.STARKPRIVATEKEY
		};

		this.client = new DydxClient(config.get('Dydx.Network.host'), {
			apiTimeout: 3000,
			networkId: config.get('Dydx.Network.chainID'),
			apiKeyCredentials: apiKeys,
			starkPrivateKey: starkKeyPair
		});
	}

	static async build(alertMessage: AlertObject) {
		if (!this.instance) {
			const connector = new DYDXConnector(alertMessage);
			if (!connector || !connector.client) return;

			const account = await connector.client.private.getAccount(
				connector.ETHADDRESS
			);

			connector.positionID = account.account.positionId;
			this.instance = connector;
		}

		return this.instance;
	}
}

export default DYDXConnector;
