import ts from "typescript";

function sortMultipleDestrcuturedImports(imports){
  const generalExpression = /import {(.*?)}/.exec(imports);
  const fromStatement =  /from (.*)/.exec(imports);
  let finalImport = imports
  if(generalExpression !== null){
    const sortedImports = generalExpression[1].trim().split(",").map(s=>s.trim()).sort().join(', ');
    finalImport = "import {"+ sortedImports + "}" + fromStatement[0];
  }
  console.log(finalImport);
  return finalImport;
}

export function sortImports(content) {
  const sourceFile = ts.createSourceFile('dummy.ts', content, ts.ScriptTarget.Latest, true);
  const imports = [];
  const nonImports = [];

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement) || ts.isImportEqualsDeclaration(statement)) {
      // const finalImport = sortMultipleDestrcuturedImports(statement.getText());
      imports.push(statement);
    } else {
      nonImports.push(statement);
    }
  }

  const sorted = imports.sort((a, b) => {
    const regexA = /import {(.*?)}/.exec(a.getText());
    const regexB = /import {(.*?)}/.exec(b.getText());
  
    const sortedRegexA = regexA ? regexA[1].trim().split(",").map(s=>s.trim()).sort().join(', ') : regexA;
    const sortedRegexB = regexB ? regexB[1].trim().split(",").map(s=>s.trim()).sort() : regexB;

    const importA = sortedRegexA ? sortedRegexA : '';
    const importB = sortedRegexB ? sortedRegexB: '';

    return importA.localeCompare(importB);
  });

  const sortedImports = sorted.concat(nonImports);
  const printer = ts.createPrinter();
  const sortedText = sortedImports.map((stmt) => printer.printNode(ts.EmitHint.Unspecified, stmt, sourceFile)).join('\n');

  return sortedText;
}