const nodemon = require('nodemon');
const fs = require('fs-extra');
const path = require('path');

const currentDirectory = process.cwd().replace('\\hotreload', '');

// deixar o codigo melhor e publicar no npm package

if (process.argv.length !== 4) {
  return;
}

const nameDep = process.argv[3];
const destino = `${currentDirectory}\\node_modules\\${nameDep}`
const namePathLib = process.argv[2];


const nodemonConfig = {
  script: '',
  ext: 'js,json,jsx',
  watch: [`./../../${namePathLib}`],
};

nodemon(nodemonConfig);

nodemon.on('start', () => {
  console.log('Aplicação iniciada.');
}).on('quit', () => {
  console.log('Aplicação encerrada.');
  process.exit();
}).on('restart', async (files) => {
  console.log('Aplicação reiniciada devido a alterações em: ', files);
  files = ignore(files);

  for await (const file of files) {
    const destinoPath = path.join(destino, removeAbsolutPath(file));
    await copiarArquivoSeAlterado(file, destinoPath);
  }
});

function removeAbsolutPath(file) {
  return file.substr(file.lastIndexOf(namePathLib), file.length).replace(namePathLib, '');
}

async function copiarArquivoSeAlterado(origem, destino) {
  try {
    await fs.copy(origem, destino);
    console.log(`Arquivo copiado de ${origem} para ${destino}`);
  } catch (erro) {
    console.error('Erro ao copiar o arquivo:', erro);
  }
}

const filesToIgnore = [
  'yarn.lock',
  'README.md',
  'node_modules',
  'package.json',
  '.git',
  '.gitignore',
  '.vscode',
];

function ignore(files) {
  return files.filter(file => !filesToIgnore.includes(file));
}