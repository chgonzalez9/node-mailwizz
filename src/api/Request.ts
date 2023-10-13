const querystring = require("querystring");
let encrypt = require("../utils/encrypt");
let axios = require("axios");
let qs = require("qs");

const METHOD = {
	GET: "GET",
	POST: "POST",
	PUT: "PUT",
	DELETE: "DELETE"
};

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

	async send() {
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
			baseURL: this.config.baseUrl,
			url: this.url,
			headers: this.header
		};

		if (this.method === METHOD.GET) {
			options.params = this.query;
		} else {
			options.data = qs.stringify(this.data);
			options.headers["Content-Type"] = "application/x-www-form-urlencoded";
		}

		try {
			const response = await axios(options);
			return response.data;
		} catch (err) {
			if (!err.response) throw err;
			if (!err.response.data) throw err.response;
			throw err.response.data;
		}
	}

	__setXHttpMethodOverride() {
		this.header["X-HTTP-Method-Override"] = this.method;
	}

	__sign() {
		let specialHeaderParams = this.header;
		let privateKey = this.config.secret;
		let method = this.method;
		let paramPost = this.method === METHOD.GET ? {} : this.data || {};
		let paramGet =
			this.method === METHOD.GET ? this.data || {} : this.query || {};
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