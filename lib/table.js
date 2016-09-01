const Table = require('cli-table2');

function createTable (nodes, filterNodeModules) {
  let table = new Table({
    colWidths: [20, null, 8, 8],
    head: ['Function', 'File', 'Line', 'Time']
  });

  nodes.reverse().forEach(n => {
    const row = [];
    let functionName = n.func.split(' ')[0];
    if (goodFunctionName(functionName)) {
      if (functionName) {
        row.push(functionName);
      } else {
        row.push('N/A');
      }
      let file = n.func.split(' ')[1];
      file = file.split(':')[0];
      file = addNewLine(file, 35).join('\n');
      row.push(file);
      let lineNumber = n.func.split(':')[1];
      row.push(lineNumber);
      row.push(n.depth);
      if (!filterNodeModules || !isModule(n)) {
        table.push(row);
      }
    }
  });
  return table.toString();
}

function goodFunctionName (functionName) {
  return !functionName.includes('app.(anonymous') &&
    !functionName.includes('function)') &&
    !functionName.includes('object.(anonymous');
}

function addNewLine (filePath, n) {
  let content = [];
  for (let i = 0; i < filePath.length; i += n) {
    content.push(filePath.substr(i, n));
  }
  return content;
}

function isModule (node) {
  return node.func.split(' ')[1].includes('node_modules');
}

module.exports = exports = {
  createTable
};
