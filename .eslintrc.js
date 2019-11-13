const path = require('path');

module.exports = {
    "parser": "babel-eslint",
    "extends": ["airbnb"],
    "rules": {
      "indent": [2, "tab", { "SwitchCase": 1, "VariableDeclarator": 1 }], // Switch indent to tab.
      "no-tabs": 0, // Turn off no tabs.
      "react/jsx-indent": [2, "tab"], // Switch jsx indent to tab.
      "react/jsx-indent-props": [2, "tab"], // Switch jsx props indent to tab.
      "arrow-params": 0, // Allow omit parens for one param.
      "import/prefer-default-export": 0 // Allow named exports for one export.
    },
    "settings": {
      "import/resolver": {
        "webpack": { 
          "config": "./webpack.config.js" 
        }
      }
    }
};