import express, { Router } from 'express';
import {
	dydxCreateOrder,
	dydxGetAccount,
	dydxBuildOrderParams,
	dydxExportOrder,
	validateAlert,
	checkAfterPosition,
	perpCreateOrder,
	perpBuildOrderParams,
	perpGetAccount,
	perpExportOrder,
	getIPAddress
} from '../services';

const router: Router = express.Router();

console.log('Version: 0.1');

router.get('/', async (req, res) => {
	console.log('Recieved GET request.');

	const dydxAccount = await dydxGetAccount(req.body);
	const perpAccount = await perpGetAccount();

	if (!dydxAccount && !perpAccount) {
		res.send('Error on getting account data');
	} else {
		const message =
			'dYdX Account Ready: ' +
			dydxAccount +
			'\n  Perpetual Protocol Account Ready: ' +
			perpAccount;
		res.send(message);
	}
});

router.post('/', async (req, res) => {
	console.log('Recieved Tradingview strategy alert:', req.body);

	const validated = await validateAlert(req.body);
	if (!validated) {
		res.send('Error. alert message is not valid');
		return;
	}

	// if (!orderParams) return;
	let orderResult;
	switch (req.body['exchange']) {
		case 'perpetual': {
			const orderParams = await perpBuildOrderParams(req.body);
			if (!orderParams) return;
			orderResult = await perpCreateOrder(orderParams);
			await perpExportOrder(
				req.body['strategy'],
				orderResult,
				req.body['price'],
				req.body['market']
			);
			break;
		}
		default: {
			const orderParams = await dydxBuildOrderParams(req.body);
			if (!orderParams) return;
			orderResult = await dydxCreateOrder(orderParams, req.body);
			if (!orderResult) return;
			await dydxExportOrder(
				req.body['strategy'],
				orderResult.order,
				req.body['price'],
				req.body
			);
		}
	}

	// checkAfterPosition(req.body);

	res.send('OK');
});

router.get('/debug-sentry', function mainHandler(req, res) {
	throw new Error('My first Sentry error!');
});

const ipAddress = getIPAddress();
console.log('Indirizzo IP:', ipAddress);

export default router;
