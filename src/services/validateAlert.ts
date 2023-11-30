import { AlertObject } from '../types';
import { Market } from '@dydxprotocol/v3-client';
import DYDXConnector from './dydx/client';
import { getStrategiesDB } from '../helper';

export const validateAlert = async (alertMessage: AlertObject): Promise<boolean> => {
	// check correct alert JSON format
	if (!Object.keys(alertMessage).length) {
		console.error('Tradingview alert is not JSON format.');
		return false;
	}

	// check passphrase
	let TRADINGVIEWPASSPHRASE: string | undefined;
	
	switch (alertMessage.exchID) {
		case '1':
			TRADINGVIEWPASSPHRASE = process.env.TRADINGVIEW_PASSPHRASE1!;
			break;
      		case '2':
			TRADINGVIEWPASSPHRASE = process.env.TRADINGVIEW_PASSPHRASE2!;
			break;
		case '3':
			TRADINGVIEWPASSPHRASE = process.env.TRADINGVIEW_PASSPHRASE3!;
			break;
      		case '4':
			TRADINGVIEWPASSPHRASE = process.env.TRADINGVIEW_PASSPHRASE4!;
			break;
		case '5':
			TRADINGVIEWPASSPHRASE = process.env.TRADINGVIEW_PASSPHRASE5!;
			break;
      		case '6':
			TRADINGVIEWPASSPHRASE = process.env.TRADINGVIEW_PASSPHRASE6!;
			break;
      		default:
			TRADINGVIEWPASSPHRASE = process.env.TRADINGVIEW_PASSPHRASE!;
			break;
    	}
	if (TRADINGVIEWPASSPHRASE && !alertMessage.passphrase) {
		console.error('Passphrase is not set on alert message.');
		return false;
	}
	if (
		alertMessage.passphrase &&
		alertMessage.passphrase != TRADINGVIEWPASSPHRASE
	) {
		console.error('Passphrase from tradingview alert does not match to config');
		return false;
	}

	// check exchange
	if (alertMessage.exchange) {
		const validExchanges = ['dydx', 'perpetual'];
		if (!validExchanges.includes(alertMessage.exchange)) {
			console.error('Exchange name must be dydx or perpetual');
			return false;
		}
	}

	// check strategy name
	if (!alertMessage.strategy) {
		console.error('Strategy field of tradingview alert must not be empty');
		return false;
	}

	// check orderSide
	if (alertMessage.order != 'buy' && alertMessage.order != 'sell') {
		console.error(
			'Side field of tradingview alert is not correct. Must be buy or sell'
		);
		return false;
	}

	//check position
	if (
		alertMessage.position != 'long' &&
		alertMessage.position != 'short' &&
		alertMessage.position != 'flat'
	) {
		console.error('Position field of tradingview alert is not correct.');
		return false;
	}

	//check reverse
	if (typeof alertMessage.reverse != 'boolean') {
		console.error(
			'Reverse field of tradingview alert is not correct. Must be true or false.'
		);
		return false;
	}

	// check market if exchange is dydx
	if (!alertMessage.exchange || alertMessage.exchange == 'dydx') {
		const market = Market[alertMessage.market as keyof typeof Market];
		if (!market) {
			console.error('Market field of tradingview alert is not correct.');
			return false;
		}

		const connector = await DYDXConnector.build(alertMessage);

		const markets = await connector.client.public.getMarkets(market);
		// console.log('markets', markets);

		const minOrderSize = parseFloat(markets.markets[market].minOrderSize);

		// check order size is greater than mininum order size
		if (alertMessage.size && alertMessage.size < minOrderSize) {
			console.error(
				'Order size of this strategy must be greater than mininum order size:',
				minOrderSize
			);
			return false;
		}
	}

	const [db, rootData] = getStrategiesDB();
	console.log('strategyData', rootData[alertMessage.strategy]);

	const rootPath = '/' + alertMessage.strategy;

	if (!rootData[alertMessage.strategy]) {
		const reversePath = rootPath + '/reverse';
		db.push(reversePath, alertMessage.reverse);

		const isFirstOrderPath = rootPath + '/isFirstOrder';
		db.push(isFirstOrderPath, 'true');
	}

	if (
		alertMessage.position == 'flat' &&
		rootData[alertMessage.strategy].isFirstOrder == 'true'
	) {
		console.log(
			'this alert is first and close order, so does not create a new order.'
		);
		return false;
	}

	return true;
};
