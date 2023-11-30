import DYDXConnector from './client';
import { FillResponseObject } from '@dydxprotocol/v3-client';
import { _sleep } from '../../helper';
import { AlertObject } from '../../types';

export const getFill = async (order_id: string, alertMessage: AlertObject) => {
	let count = 0;
	const maxTries = 3;
	while (count <= maxTries) {
		try {
			const connector = await DYDXConnector.build(alertMessage);
			const allFills: { fills: FillResponseObject[] } =
				await connector.client.private.getFills({ orderId: order_id });

			return allFills.fills[0];
		} catch (error) {
			count++;
			if (count == maxTries) {
				console.error(error);
			}
			await _sleep(5000);
		}
	}
};
