const fs = require('fs');
const path = require('path');

const artifactPath = path.join(__dirname, 'artifacts/contracts/LendingProtocol.sol/LendingProtocol.json');
const abiPath = path.join(__dirname, 'web_app/src/LendingProtocolABI.json');

const artifact = JSON.parse(fs.readFileSync(artifactPath));
fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));

console.log('ABI copiada a web_app/src/LendingProtocolABI.json');
