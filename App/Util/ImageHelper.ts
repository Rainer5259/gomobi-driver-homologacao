import RNFetchBlob from 'rn-fetch-blob';

//React Native Fs
var RNFS = require('react-native-fs');
const downloadDirectory = RNFS.DocumentDirectoryPath;

/**
 * Função para retornar o diretório de destino do arquivo juntamente com seu nome e extensao
 */
function getFullDirectoryName(icon, facebook = false) {
  if (icon != 'undefined' && icon != null) {
    const directoryFile = `${downloadDirectory}/${getIconNameFromUrl(
      icon,
      facebook,
    )}`;
    return directoryFile;
  }
}

/**
 * Função para retornar o nome do icone juntamente com sua extensão
 */
function getIconNameFromUrl(url, facebook = false) : string | null {
  //Split para pegar a última barra antes do nome do arquivo juntamente com sua extensão
  const iconName = url.split('/');
  if (!facebook) {
    if (iconName.length > 0) {
      if (iconName[iconName.length - 1].length > 0)
        return iconName[iconName.length - 1];
      else return iconName[iconName.length - 2] + '.png';
    } else {
      return null;
    }
  }
  return 'facebook.png';
}

/**
 * Função para preparar o json com as informações do icone e chamar a função de salvar
 */
function doStoreIcons(file, facebook = false) {
  if (file != null) {
    const iconName = getIconNameFromUrl(file, facebook);
    let jsonSaveIcon = {
      url: file,
      name: iconName,
    };
    storeIconsFromUrl(jsonSaveIcon);
  }
}

/**
 * Função para salvar os icones de request do servidor no diretório padrão
 */
function storeIconsFromUrl(infoFile) {
  const downloadDest = `${downloadDirectory}/${infoFile.name}`;
  //Json para guardar as informações do arquivo
  let DownloadFileOptions = {
    fromUrl: infoFile.url,
    toFile: downloadDest,
  };
  //Verifica se o arquivo já está salvo no diretório
  RNFS.readFile(downloadDest, 'ascii')
    .then(file => {})
    .catch(err => {

      //Realiza o download da imagem passando o arquivo com as configurações
      RNFS.downloadFile(DownloadFileOptions)
        .promise.then(file => {})
        .catch(err => {});
    });
}

class ImageHelper {
  constructor() {}

  //Show the main directory to read/save files
  directoryInfo() {
    // Show the list of files in default directory
    RNFS.readDir(downloadDirectory)
      .then(result => {})
      .catch(err => {});
  }

  // Main function to download the image
  async downloadImage(imageUrl: string, title?: string, description?: string): Promise<any> {
    // To add the time suffix in filename
    let date = new Date();
    // Getting the extention of the file
    let regexExt = /[.]/.exec(imageUrl) ? /[^.]+$/.exec(imageUrl) : undefined;
    let ext = regexExt ? '.' + regexExt[0] : '';
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const { config, fs } = RNFetchBlob;
    let options = {
      fileCache: true,
      // Related to the Android only
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: fs.dirs.DownloadDir + '/gomobi_' + Math.floor(date.getTime() + date.getSeconds() / 2) + ext,
        title: 'GoMobi' + (title ? ' - ' + title : ''),
        description: description || '',
      },
    };
    return config(options).fetch('GET', imageUrl);
  }
}

export default ImageHelper;
