import DYDXConnector from './client';
import 'dotenv/config';
import { AlertObject } from '../../types';

export const dydxGetAccount = async (alertMessage: AlertObject) => {
	try {
		const connector = await DYDXConnector.build(alertMessage);
		if(!connector) return false;
		
		let ETHADDRESS: string | undefined;

		switch (alertMessage.exchID) {
			case '1': {
				ETHADDRESS = process.env.ETH_ADDRESS1!;
				break;
			}
      			case '2': {
				ETHADDRESS = process.env.ETH_ADDRESS2!;
				break;
			}
			case '3': {
				ETHADDRESS = process.env.ETH_ADDRESS3!;
				break;
			}
      			case '4': {
				ETHADDRESS = process.env.ETH_ADDRESS4!;
				break;
			}
			case '5': {
				ETHADDRESS = process.env.ETH_ADDRESS5!;
				break;
			}
      			case '6': {
				ETHADDRESS = process.env.ETH_ADDRESS6!;
				break;
			}
			default: {
				ETHADDRESS = process.env.ETH_ADDRESS!;
				break;
			}
    		}
		
		const account = await connector.client.private.getAccount(
			ETHADDRESS
		);
		console.log('dYdX account: ', account);
		if (Number(account.account.freeCollateral) == 0) {
			return false;
		} else {
			return true;
		}
	} catch (error) {
		console.error(error);
	}
};
