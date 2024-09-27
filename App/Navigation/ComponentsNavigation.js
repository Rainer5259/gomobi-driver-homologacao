//Here you should import the modules' screen files
//Aqui deve importar os arquivos de telas dos modulos

import finance from 'react-native-finance/Navigation'
import chat from 'react-native-chat/navigation'
import theme from 'react-native-theme-screen/navigation';
import signature from 'react-native-subscription/index';

    const allComponents = {
        ...finance,
        ...chat,
		...theme,
		...signature,
        //...othersComponenteHere,
    };

export default allComponents;
