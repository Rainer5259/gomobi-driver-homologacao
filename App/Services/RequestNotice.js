import React, {useEffect, useState} from 'react';
import {NativeEventEmitter, NativeModules, Platform} from 'react-native';
import RNUnlockDevice from 'react-native-unlock-device';

import NavigationService from './NavigationService';
import {handlerException} from './Exception';

const NativeEvents = new NativeEventEmitter(NativeModules.RNProviderBubble);

import {useSelector, useDispatch} from 'react-redux';
import {
	SET_REQUEST_NOTICE,
	WAITING_SET_REQUEST_NOTICE,
} from '../Store/actions/actionTypes';

import reactNativeProviderBubble from 'react-native-provider-bubble';

export default function RequestNotice() {
	const state = useSelector((state) => state);
	const {request: ride} = state;
	const dispatch = useDispatch();

	/**
	 * Seta o objeto da corrida ao recebê la
	 * @param {object} item
	 */
	const onSetRequestNotice = async (item) => {
		dispatch({
			type: SET_REQUEST_NOTICE,
			payload: item,
		});
	};

	/**
	 * Seta o ojeto da corrida secundaria ao recebê la
	 * @param {object} item
	 */
	const onSetWaitingRequestNotice = async (item) => {
		dispatch({
			type: WAITING_SET_REQUEST_NOTICE,
			payload: item,
		});
	};

	/**
	 * Adiciona o event listener para receber as corridas
	 */
	useEffect(() => {
		NativeEvents.removeAllListeners('handleRequest');
		NativeEvents.addListener('handleRequest', requestEvent);
	}, []);

	/**
	 * Desbloqueia o aparelho do motorista
	 */
	const unlockScreen = () => {
		try {
			if (Platform.OS == 'android') {
				RNUnlockDevice.unlock();
			}
		} catch (error) {
			handlerException('RNUnlockDevice', error);
		}
	};

	/**
	 * Limpa do redux a corrida se ela for diferente da incoming_request
	 */
	const clearPreviousRide = async (request, incomingRide) => {
		if (request && incomingRide) {
			if (request.request_id !== incomingRide.request_id) {
				await onRequestClear();

				return null;
			}
		}

		return request;
	};

	/**
	 * Limpa a corrida armazenada
	 * @param {object} item
	 */
	const onRequestClear = async () => {
		dispatch({
			type: 'CLEAR',
		});
	};

	/**
	 * Função executada ao disparar um handleRequest
	 * @param {object} request
	 */
	const requestEvent = async (request) => {
		try {
			const data = await JSON.parse(request.data).data;

			if (data && data.incoming_requests) {
				const incomingRide = data.incoming_requests[0];

				if (incomingRide.later == true) {
					handleScheduleRequest(incomingRide);

					return;
				}

				if (incomingRide.waiting_ride == false) {
					await handleRequest(incomingRide);

					return;
				}

				if (incomingRide.waiting_ride == true) {
					await handleWaitingRequest(incomingRide);

					return;
				}
			}
		} catch (error) {
			handlerException('requestEvent', error);
			handlerException('requestEventData', request.data);
			reactNativeProviderBubble.finishRequest();
		}
	};

	/**
	 * Função executada ao chegar um agendamento
	 * @param {object} incomingRide
	 */
	function handleScheduleRequest(incomingRide) {
		NavigationService.navigate('ScheduleRequestScreen', {
			schedule: incomingRide,
		});
	}

	/**
	 * Função executada ao chegar uma corrida em espera
	 * @param {object} incomingRide
	 */
	async function handleWaitingRequest(incomingRide) {
		try {
			if (ride.waiting_request == null && !ride.waiting_receive_notive) {
				await onSetWaitingRequestNotice({
					request: incomingRide,
					user: incomingRide.request_data.user,
				});

				NavigationService.navigate('ServiceRequestScreen', {
					waiting_ride: true,
				});

				unlockScreen();
			}
		} catch (error) {
			handlerException('handleWaitingRequest', error);
			reactNativeProviderBubble.finishRequest();
		}
	}

	/**
	 * Função executada ao chegar uma corrida
	 * @param {object} incomingRide
	 */
	async function handleRequest(incomingRide) {
		try {
			let request = await clearPreviousRide(ride.request, incomingRide);

			if (request == null) {
				await onSetRequestNotice({
					request: incomingRide,
					user: incomingRide.request_data.user,
				});

				NavigationService.navigate('ServiceRequestScreen', {
					waiting_ride: false,
				});

				unlockScreen();
			}
		} catch (error) {
			handlerException('handleRequest', error);
			reactNativeProviderBubble.finishRequest();
		}
	}

	return <></>;
}
