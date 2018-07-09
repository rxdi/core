"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = require("../../container/decorators/Service");
const rxjs_1 = require("rxjs");
let ComponentsService = class ComponentsService {
    constructor() {
        this.components = new rxjs_1.BehaviorSubject([]);
    }
    register(plugin) {
        this.components.next([...this.components.getValue(), plugin]);
    }
    getComponents() {
        return this.components.getValue();
    }
};
ComponentsService = __decorate([
    Service_1.Service()
], ComponentsService);
exports.ComponentsService = ComponentsService;
