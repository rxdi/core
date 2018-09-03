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
const childProcess = require("child_process");
let NpmService = class NpmService {
    constructor() {
        this.packagesToDownload = new rxjs_1.BehaviorSubject([]);
        this.command = '';
    }
    setPackages(packages) {
        this.packagesToDownload.next(packages);
    }
    preparePackages() {
        this.packagesToDownload.getValue().forEach((p) => this.command += `${p.name}@${p.version} `);
    }
    installPackages() {
        this.preparePackages();
        console.log(`Installing npm packages on child process! ${this.command}`);
        let child = null;
        if (child) {
            child.stdout.removeAllListeners('data');
            child.stderr.removeAllListeners('data');
            child.removeAllListeners('exit');
            child.kill();
        }
        child = childProcess.spawn('npm', ['i', this.command]);
        child.stdout.on('data', (data) => {
            process.stdout.write(data);
        });
        child.stderr.on('data', (data) => {
            process.stdout.write(data);
        });
        child.on('exit', (code) => {
            console.log(`Child process exited with code ${code}`);
            console.log(`Installing npm packages DONE! ${this.command}`);
            child = null;
        });
    }
};
NpmService = __decorate([
    container_1.Service()
], NpmService);
exports.NpmService = NpmService;
