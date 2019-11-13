const path = require('path');

module.exports = {
    "parser": "babel-eslint",
    "extends": ["airbnb"],
    "env": {
      "browser": true
    },
    "rules": {
      "indent": [2, "tab", { "SwitchCase": 1, "VariableDeclarator": 1 }], // Switch indent to tab.
      "no-tabs": 0, // Turn off no tabs.
      "react/jsx-indent": [2, "tab"], // Switch jsx indent to tab.
      "react/jsx-indent-props": [2, "tab"], // Switch jsx props indent to tab.
      "arrow-params": 0, // Allow omit parens for one param.
      "import/prefer-default-export": 0, // Allow named exports for one export.
      "react/jsx-filename-extension": 0, // Allow .js files to contain .jsx
      "react/destructuring-assignment": 0, // Allow props to be used directly with destructuring.
      "react/prop-types": 0, // Unsure, but triggering for this.props.children
      "camelcase": 0, // Sometimes you can use variable with underscore and not camelcase
      "no-console": 0, // Can have console logs
      "react/jsx-props-no-spreading": 0, // Props spreading is allowed
    },
    "settings": {
      "import/resolver": {
        "webpack": { 
          "config": "./webpack.config.js" 
        }
      }
    }
};