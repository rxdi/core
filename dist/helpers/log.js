"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("../container/Container");
exports.logExtendedInjectables = (name, logExtendedInjectables) => {
    if (Container_1.Container.has(name) &&
        logExtendedInjectables) {
        console.log(`Warn: Injection Token '${name.name ||
            name}' is extended after it has being declared! ${JSON.stringify(Container_1.Container.get(name))}`);
    }
};
