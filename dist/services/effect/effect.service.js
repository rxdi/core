"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = require("../../decorators/service/Service");
const rxjs_1 = require("rxjs");
let EffectsService = class EffectsService {
    constructor() {
        this.effects = new rxjs_1.BehaviorSubject([]);
    }
    register(plugin) {
        this.effects.next([...this.effects.getValue(), plugin]);
    }
    getEffects() {
        return this.effects.getValue();
    }
};
EffectsService = __decorate([
    Service_1.Service()
], EffectsService);
exports.EffectsService = EffectsService;
