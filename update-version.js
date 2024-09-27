const fs = require('fs');

// Caminho para o arquivo build.gradle
const buildGradlePath = 'android/app/build.gradle';

// Obter os valores personalizados, se fornecidos como argumentos
const args = process.argv.slice(2); // Ignorar os dois primeiros argumentos (node e nome do script)
const customVersionCode = args[0];
const customVersionName = args[1];

// Função para verificar se um valor é um número
function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

// Ler o arquivo build.gradle
fs.readFile(buildGradlePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Erro ao ler o arquivo build.gradle: ${err}`);
    return;
  }

  // Encontrar o valor atual de versionCode
  const versionCodeMatch = data.match(/versionCode\s+(\d+)/);
  const currentVersionCode = versionCodeMatch ? parseInt(versionCodeMatch[1]) : 1;

  // Incrementar o versionCode
  const newVersionCode = customVersionCode || (currentVersionCode + 1);

  // Encontrar o valor atual de versionName (um sequencial de 3 casas)
  const versionNameMatch = data.match(/versionName\s+"(\d+)\.(\d+)\.(\d+)"/);
  const currentVersionName = versionNameMatch ? versionNameMatch[0] : 'versionName "1.0.0"';

  // Usar valores personalizados, se fornecidos
  let updatedVersionCode = customVersionCode || newVersionCode;
  let updatedVersionName = currentVersionName;

  if (isNumeric(customVersionName)) {
    // Se o valor personalizado para versionName for um número, mantenha o valor
    updatedVersionName = `versionName ${customVersionName}`;
  } else if (customVersionName) {
    // Se o valor personalizado para versionName for uma string, use-o
    updatedVersionName = `versionName "${customVersionName}"`;
  } else {
    // Incrementar o versionName se nenhum valor for fornecido
    const versionNameParts = currentVersionName.match(/"(\d+)\.(\d+)\.(\d+)"/);
    const incrementedVersionName = versionNameParts
      ? `"${versionNameParts[1]}.${versionNameParts[2]}.${parseInt(versionNameParts[3]) + 1}"`
      : '"1.0.0"';
    updatedVersionName = `versionName ${incrementedVersionName}`;
  }

  // Atualizar o arquivo build.gradle com os novos valores
  const updatedBuildGradle = data
    .replace(/versionCode\s+\d+/, `versionCode ${updatedVersionCode}`)
    .replace(/versionName\s+".*?"/, updatedVersionName);

  // Escrever o arquivo atualizado
  fs.writeFile(buildGradlePath, updatedBuildGradle, (err) => {
    if (err) {
      console.error(`Erro ao escrever o arquivo build.gradle atualizado: ${err}`);
    } else {
      console.log(`Versão atualizada em ${buildGradlePath}`);
    }
  });
});
