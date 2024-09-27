import io from 'socket.io-client';
import _ from 'lodash';
import * as constants from '../Util/Constants';
// import {handleException} from 'use-log-errors';

export default WebSocketServer = {
	isConnected: false,
	socket: null,
	interval: null,
	connect() {
		try {
			if (this.socket) {
				this.socket.destroy();
				delete this.socket;
				this.socket = null;
			}

			this.socket = io.connect(constants.SOCKET_URL, {
				pingInterval: constants.SOCKET_TIMEOUT,
				pingTimeout: 2 * constants.SOCKET_TIMEOUT,
				transports: ['websocket'],
				reconnection: true,
			});

			this.socket.on('connect', () => {
				this.isConnected = true;
			});

			this.socket.on('disconnect', () => {
				this.isConnected = false;
			});

			return this.socket;
		} catch (error) {
			// handleException('WebSocketServer', error);
		}
	},
};
