"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const rxjs_1 = require("rxjs");
const http_1 = require("http");
const https_1 = require("https");
let RequestService = class RequestService {
    get(link) {
        return new rxjs_1.Observable((o) => {
            if (link.includes('https://')) {
                https_1.get(link, (resp) => {
                    let data = '';
                    resp.on('data', (chunk) => data += chunk);
                    resp.on('end', () => o.next(data));
                }).on('error', (err) => {
                    console.error('Error: ' + err.message);
                    o.error(err);
                });
            }
            else {
                http_1.get(link, (resp) => {
                    let data = '';
                    resp.on('data', (chunk) => data += chunk);
                    resp.on('end', () => o.next(data));
                }).on('error', (err) => {
                    console.error('Error: ' + err.message);
                    o.error(err);
                });
            }
        });
    }
};
RequestService = __decorate([
    container_1.Service()
], RequestService);
exports.RequestService = RequestService;
