"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = require("../../decorators/service/Service");
const bootstrap_logger_1 = require("../bootstrap-logger");
const injector_decorator_1 = require("../../decorators/injector/injector.decorator");
const rxjs_1 = require("rxjs");
let ExitHandlerService = class ExitHandlerService {
    constructor() {
        this.errorHandler = new rxjs_1.Subject();
    }
    init() { }
    exitHandler(options, err) {
        this.errorHandler.next(err);
        if (options.cleanup) {
            this.logger.logExitHandler('AppStopped');
        }
        if (err)
            console.log(err.stack);
        if (options.exit) {
            this.logger.logExitHandler('Unhandled error rejection');
        }
        process.exit(0);
    }
    onExitApp(events) {
        return new rxjs_1.Observable(o => events &&
            events.length &&
            events.forEach(event => process.on(event, e => o.next(e))));
    }
};
__decorate([
    injector_decorator_1.Injector(bootstrap_logger_1.BootstrapLogger),
    __metadata("design:type", bootstrap_logger_1.BootstrapLogger)
], ExitHandlerService.prototype, "logger", void 0);
ExitHandlerService = __decorate([
    Service_1.Service()
], ExitHandlerService);
exports.ExitHandlerService = ExitHandlerService;
