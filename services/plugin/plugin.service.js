"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
// import { PluginBase, PluginNameVersion, PluginPackage } from 'hapi';
const container_1 = require("../../container");
let PluginService = class PluginService {
    constructor() {
        this.plugins = new rxjs_1.BehaviorSubject([]);
        this.beforePlugins = new rxjs_1.BehaviorSubject([]);
        this.afterPlugins = new rxjs_1.BehaviorSubject([]);
    }
    register(plugin) {
        this.plugins.next([...this.plugins.getValue(), plugin]);
    }
    registerBefore(plugin) {
        this.beforePlugins.next([...this.plugins.getValue(), plugin]);
    }
    registerAfter(plugin) {
        this.afterPlugins.next([...this.plugins.getValue(), plugin]);
    }
    getPlugins() {
        return this.plugins.getValue();
    }
    getAfterPlugins() {
        return this.afterPlugins.getValue();
    }
    getBeforePlugins() {
        return this.beforePlugins.getValue();
    }
};
PluginService = __decorate([
    container_1.Service()
], PluginService);
exports.PluginService = PluginService;
