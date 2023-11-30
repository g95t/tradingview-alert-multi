import DYDXConnector from './client';
import { OrderResponseObject } from '@dydxprotocol/v3-client';
import { _sleep } from '../../helper';
import { AlertObject } from '../../types';

export const getOrder = async (order_id: string, alertMessage: AlertObject) => {
	let count = 0;
	const maxTries = 3;
	let filled;
	while (count <= maxTries && !filled) {
		try {
			const connector = await DYDXConnector.build(alertMessage);
			const orderResponse: { order: OrderResponseObject } =
				await connector.client.private.getOrderById(order_id);

			count++;
			filled = orderResponse.order.status == 'FILLED' ? true : false;

			if (filled) {
				return orderResponse;
			}
		} catch (error) {
			count++;
			filled = false;
			if (count == maxTries) {
				console.error(error);
			}
			await _sleep(5000);
		}
	}
};
