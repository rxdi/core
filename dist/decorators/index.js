"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./module/index"));
__export(require("./injector/index"));
__export(require("./inject-soft/index"));
__export(require("./inject/Inject"));
__export(require("./controller/index"));
__export(require("./effect/index"));
__export(require("./plugin/Plugin"));
__export(require("./service/Service"));
__export(require("./component/index"));
__export(require("./inject-many/InjectMany"));
var Service_1 = require("./service/Service");
exports.Injectable = Service_1.Service;
