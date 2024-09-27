import {
  APPLICATION_PAGES,
  SETTINGS_UPDATED,
  LOAD_AUDIO_REQUEST_BEEP,
  LOAD_AUDIO_CANCELLATION_BEEP,
  ENABLED_LANGUAGES,
  CLICKER_UPDATED,
  PAYMENT_NOMENCLATURES,
  LOAD_AUDIO_CHAT_PROVIDER
} from './actionTypes'

export const settingsAction = settings => {
  return dispatch => {
    dispatch({
      type: SETTINGS_UPDATED,
      settings
    })
  }

}

export const languagensAction = language => {
  return dispatch => {
    dispatch({
      type: ENABLED_LANGUAGES,
      language
    })
  }

}

export const audio = audio => {
  return dispatch => {
    dispatch({
      type: LOAD_AUDIO_REQUEST_BEEP,
      audio
    })
  }

}

export const audioCancellation = audio => {
  return dispatch => {
    dispatch({
      type: LOAD_AUDIO_CANCELLATION_BEEP,
      audio
    })
  }
}

export const audioChatProvider = audio => {
  return dispatch => {
    dispatch({
      type: LOAD_AUDIO_CHAT_PROVIDER,
      audio
    })
  }
}

export const aplicationPage = page => {
  return dispatch => {
    dispatch({
      type: APPLICATION_PAGES,
      page
    })
  }
}

export const clickerAction = clicker => {
  return dispatch => {
    dispatch({
      type: CLICKER_UPDATED,
      clicker
    })
  }
}

export const setPaymentNomenclatures = nomenclatures => {
	return dispatch => {
		dispatch({
			type: PAYMENT_NOMENCLATURES,
			nomenclatures,
		});
	};
};
  