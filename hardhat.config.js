
require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
    networks: {
    ephemery: {
      url: "https://otter.bordel.wtf/erigon",
      accounts: ["e107d6a1aaff3aef5ca6be1df39c96f82e4114ec60d239cde071067adc4f5b13"]
    }
  }
};
