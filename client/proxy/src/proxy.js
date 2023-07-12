"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
//import * as assert from 'assert'
const assert_1 = __importDefault(require("assert"));
const https = __importStar(require("https"));
const fs = __importStar(require("fs"));
const url = __importStar(require("url"));
let key = fs.readFileSync('ssl/key.pem');
let cert = fs.readFileSync('ssl/cert.pem');
const options = { key, cert };
let server = https.createServer(options, function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, assert_1.default)(request.url !== undefined);
        const { pathname } = url.parse(request.url);
        console.log(pathname);
        if ((pathname === null || pathname === void 0 ? void 0 : pathname.indexOf("secure")) != -1) {
            axios_1.default.get('http://localhost:8100' + pathname)
                .then((results) => {
                //console.log(results.status)
                //console.log(results.data)
                response.writeHead(results.status);
                response.end(results.data);
            })
                .catch((error) => {
                console.log("secure communication error");
                console.log(error);
            });
        }
        else if ((pathname === null || pathname === void 0 ? void 0 : pathname.indexOf("verify_core")) != -1) {
            axios_1.default.get('http://localhost:8090' + pathname)
                .then((results) => {
                //console.log(results.status)
                //console.log(results.data)
                response.writeHead(results.status);
                response.end(results.data);
            })
                .catch((error) => {
                console.log("verify_core communication error");
                console.log(error);
            });
        }
        else if ((pathname === null || pathname === void 0 ? void 0 : pathname.indexOf("verify")) != -1) {
            axios_1.default.get('http://localhost:8080' + pathname)
                .then((results) => {
                //console.log(results.status)
                //console.log(results.data)
                response.writeHead(results.status);
                response.end(results.data);
            })
                .catch((error) => {
                console.log("verify communication error");
                console.log(error);
            });
        }
        else {
            axios_1.default.get('http://localhost:8100' + pathname)
                .then((results) => {
                //console.log(results.status)
                //console.log(results.data)
                response.writeHead(results.status);
                response.end(results.data);
            })
                .catch((error) => {
                console.log("else communication error");
                console.log(error);
            });
        }
    });
});
server.listen(4433, () => {
    console.log("proxy start");
});
