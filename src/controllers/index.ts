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

router.get('/', async (req, res) => {
	console.log('Recieved GET request.');

	const dydxAccount = await dydxGetAccount(req.body);
	const perpAccount = await perpGetAccount();

	if (!dydxAccount && !perpAccount) {
		res.send('Error');
	} else {
		// const message = 'D account (default) ready: ' + dydxAccount + ' | P account ready: ' +	perpAccount;
		// res.send(message);
		res.send('OK');
	}
	
	const clientIP = getIPAddress(req);
	console.log('IP address:', clientIP);
});

router.post('/', async (req, res) => {
	console.log('Recieved strategy alert:', req.body);

	const validated = await validateAlert(req.body);
	if (!validated) {
		res.send('Error');
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

	const clientIP = getIPAddress(req);
	console.log('IP address:', clientIP);
});

router.get('/debug-sentry', function mainHandler(req, res) {
	throw new Error('My first Sentry error!');
});

export default router;
