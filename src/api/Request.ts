import { Config } from "mailtrain-interface";
import encrypt from "../utils/encrypt";
import rp from "request-promise";
import METHOD from "../utils/data";
import querystring from "querystring";

//const url = require("url");

class Request {
	private config: Config;
    url: string | null;
    method: METHOD | null;
    data: Record<string, any>;
    private query: Record<string, any>;
    private header: Record<string, any>;
	constructor({ publicKey, secret, baseUrl }: Config) {
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

	static get Type(): typeof METHOD {
		return METHOD;
	}

	send(): Promise<any> {
		if (this.data && this.method === METHOD.GET) {
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

		let options: rp.Options = {
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
			rp(options)
				.then((result: any) => {
					return resolve(result);
				})
				.catch((err: { response: { body: any; }; }) => {
					if (!err.response) return reject(err);
					if (!err.response.body) return reject(err.response);
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
		params = encrypt.ksort(params);

		var apiUrl = this.config.baseUrl + this.url;

		if (this.method === METHOD.GET && Object.keys(paramGet).length > 0) {
			apiUrl += "?" + querystring.stringify(paramGet);
			separator = "&";
		} else {
			separator = "?";
		}

		let signatureString = `${method} ${apiUrl}${separator}${encrypt.serialize(
			params
		)}`;
		console.log(apiUrl);
		console.log(signatureString);
		let hash = encrypt.hmac_sha(privateKey, signatureString);

		this.header["X-MW-SIGNATURE"] = hash;
	}
}

export default Request;
