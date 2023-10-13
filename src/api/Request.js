"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const encrypt_1 = __importDefault(require("../utils/encrypt"));
const request_promise_1 = __importDefault(require("request-promise"));
const data_1 = __importDefault(require("../utils/data"));
const querystring_1 = __importDefault(require("querystring"));
//const url = require("url");
class Request {
    constructor({ publicKey, secret, baseUrl }) {
        this.config = {
            publicKey: publicKey,
            secret: secret,
            baseUrl: baseUrl
        };
        this.url = null;
        this.method = null;
        this.data = {};
        this.query = {};
        this.header = {
            "X-MW-PUBLIC-KEY": this.config.publicKey,
            "X-MW-TIMESTAMP": Math.floor(new Date().valueOf() / 1000).toString(),
            "X-MW-REMOTE-ADDR": ""
        };
    }
    static get Type() {
        return data_1.default;
    }
    send() {
        if (this.data && this.method === data_1.default.GET) {
            this.query = this.data;
            this.data = {};
        }
        this.__sign();
        this.__setXHttpMethodOverride();
        if (!this.url) {
            throw new Error("URL is not set");
        }
        if (!this.method) {
            throw new Error("Method is not set");
        }
        let options = {
            method: this.method,
            baseUrl: this.config.baseUrl,
            url: this.url,
            headers: this.header
        };
        if (this.data) {
            options.form = this.data;
        }
        if (this.query) {
            options.qs = this.query;
        }
        //delete options.uri;
        return new Promise((resolve, reject) => {
            (0, request_promise_1.default)(options)
                .then((result) => {
                return resolve(result);
            })
                .catch((err) => {
                if (!err.response)
                    return reject(err);
                if (!err.response.body)
                    return reject(err.response);
                return reject(err.response.body);
            });
        });
    }
    __setXHttpMethodOverride() {
        this.header["X-HTTP-Method-Override"] = this.method;
    }
    __sign() {
        let specialHeaderParams = this.header;
        let privateKey = this.config.secret;
        let method = this.method;
        let paramPost = this.data || {};
        let paramGet = this.query || {};
        let separator;
        let params = Object.assign({}, specialHeaderParams, paramPost);
        params = encrypt_1.default.ksort(params);
        var apiUrl = this.config.baseUrl + this.url;
        if (this.method === data_1.default.GET && Object.keys(paramGet).length > 0) {
            apiUrl += "?" + querystring_1.default.stringify(paramGet);
            separator = "&";
        }
        else {
            separator = "?";
        }
        let signatureString = `${method} ${apiUrl}${separator}${encrypt_1.default.serialize(params)}`;
        console.log(apiUrl);
        console.log(signatureString);
        let hash = encrypt_1.default.hmac_sha(privateKey, signatureString);
        this.header["X-MW-SIGNATURE"] = hash;
    }
}
exports.default = Request;
