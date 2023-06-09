import { getFileInfo, resolveConfig } from 'prettier';
import { sortImports } from './import-sorter.js';

function sortImportsPlugin(fileInfo, options) {
  const { ast, parser, filePath } = fileInfo;

  if (!parser || !ast) {
    console.log('Prettier AST and parser not available. Skipping import sorting.');
    return null;
  }

  const configPromise = resolveConfig(filePath);
  const fileContent = fileInfo.source;

  return configPromise.then((config) => {
    if (!config || !config.plugins || !config.plugins.includes('prettier-plugin-import-sorter')) {
      console.log('Prettier plugin not configured. Skipping import sorting.');
      return null;
    }

    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
      console.log('File is not a TypeScript file. Skipping import sorting.');
      return null;
    }

    const sortedContent = sortImports(fileContent);

    return {
      ast,
      formatted: sortedContent,
    };
  });
}

export const parsers = {
    typescript: sortImportsPlugin,
    tsx: sortImportsPlugin,
};
