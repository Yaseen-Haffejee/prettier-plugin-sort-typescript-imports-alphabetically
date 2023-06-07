const prettier = require('prettier');
const ts = require('typescript');

function sortImports(text) {
  const sourceFile = ts.createSourceFile('dummy.ts', text, ts.ScriptTarget.Latest, true);
  const imports = [];
  const nonImports = [];

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement) || ts.isImportEqualsDeclaration(statement)) {
      imports.push(statement);
    } else {
      nonImports.push(statement);
    }
  }

  imports.sort((a, b) => {
    const nameA = a.moduleSpecifier.getText();
    const nameB = b.moduleSpecifier.getText();
    return nameA.localeCompare(nameB);
  });

  const sortedImports = imports.concat(nonImports);
  const printer = ts.createPrinter();
  const sortedText = sortedImports.map((stmt) => printer.printNode(ts.EmitHint.Unspecified, stmt, sourceFile)).join('\n');

  return sortedText;
}

module.exports = {
  languages: [
    {
      name: 'TypeScript',
      parsers: ['typescript'],
      extensions: ['.ts'],
    },
  ],
  parsers: {
    typescript: {
      parse: (text) => ts.createSourceFile('dummy.ts', text, ts.ScriptTarget.Latest, true),
      preprocess: (text) => text,
      locStart: (node) => node.getStart(),
      locEnd: (node) => node.getEnd(),
    },
  },
  printers: {
    typescript: {
      print: (path) => {
        const text = path.getValue();
        const sortedText = sortImports(text);
        return sortedText;
      },
    },
  },
};
