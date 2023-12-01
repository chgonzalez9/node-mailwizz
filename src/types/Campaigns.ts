/**
 * @description Interface for the parameters of the API call to get all campaigns
 * @interface GetAllCampaignsParams
 * @property {number} page - Page of the response
 * @property {number} per_page - Per page of the response
 * @memberof Campaigns
 * @see https://api-docs.mailwizz.com/#get-all-campaigns
 */

export interface GetAllCampaignsParams {
	page?: number;
	per_page?: number;
}

/**
 * @description Interface for the response of the API call to get all campaigns
 * @interface GetAllCampaignsResponse
 * @property {string} status - Status of the response
 * @property {number} code - Code of the response
 * @property {string} message - Message of the response
 * @property {number} http_status_code - HTTP status code of the response
 * @property {number} total_items - Total items of the response
 * @property {number} total_pages - Total pages of the response
 * @property {number} page - Page of the response
 * @property {number} per_page - Per page of the response
 * @property {Array<Campaign>} data - Data of the response
 * @memberof Campaigns
 * @see https://api-docs.mailwizz.com/#get-all-campaigns
 */
export interface GetAllCampaignsResponse {
	status: string;
	data: GetAllCampaignData[];
}

/**
 * @description Interface for the campaign
 * @interface GetAllCampaignsData
 * @property {string} data.count - Count of the campaign
 * @property {number} data.total_pages - Total pages of the campaign
 * @property {number} data.current_page - Current Page of the campaign
 * @property {number} data.next_page - Per page of the campaign
 * @property {number} data.prev_page - Per page of the campaign
 * @property {GetCampaignsResponseRecords[]} data.records - Records of the campaign
 * @memberof Campaigns
 * @see https://api-docs.mailwizz.com/#get-all-campaigns
 */
 
export interface GetAllCampaignsData {
	count: string;
	total_pages: number;
	current_page: number;
	next_page?: number;
	prev_page?: number;
	records: GetAllCampaignsResponseRecords[];
}

/**
 * @description Interface for the reponse of the API call to get all the campaign
 * @interface GetAllCampaignsResponseRecords
 * @property {string} campaign_uid - Campaign UID of the response
 * @property {string} campaign_id - Campaign ID of the response
 * @property {string} name - Name of the response
 * @property {string} status - Type of the response
 * @property {string} [group: string] - Any other property of the response
 * @memberof Campaigns
 * @see https://api-docs.mailwizz.com/#get-all-campaigns
 */

export interface GetAllCampaignsResponseRecords {
	campaign_uid: string;
	campaign_id: string;
	name: string;
	status: string;
	[group: string]: any;
}

/**
 * @description Interface for the parameters of the API call to get a campaign
 * @interface GetCampaignParams
 * @property {string} campaignUid - Campaign UID of the campaign
 * @memberof Campaigns
 * @see https://api-docs.mailwizz.com/#get-a-campaign
 */

export interface GetCampaignParams {
	campaignUid: string;
}

/**
 * @description Interface for the response of the API call to get a campaign
 * @interface GetCampaignResponse
 * @property {string} status - Status of the response
 * @property {Campaign} data - Data of the response
 * @property {GetCampaignResponseRecord[]} data.record - Record of the response
 * @property {string} [segment: string] - Segment of the response
 * @property {string} [group: string] - Group of the response
 * @memberof Campaigns
 * @see https://api-docs.mailwizz.com/#get-one-campaign
 */

export interface GetCampaignResponse {
	status: string;
	data: Campaign;
	record: GetCampaignResponseRecord[];
	[segment: string]: any;
	[group: string]: any;
}

/**
 * @description Interface for the campaign record
 * @interface GetCampaignResponseRecord
 * @property {string} campaign_uid - Campaign UID of the campaign
 * @property {string} campaign_id - Campaign ID of the campaign
 * @property {string} name - Name of the campaign
 * @property {string} type - Type of the campaign
 * @property {string} from_name - From name of the campaign
 * @property {string} from_email - From email of the campaign
 * @property {string} to_name - To email
 * @property {string} reply_to - Reply to of the campaign
 * @property {string} subject - Subject of the campaign
 * @property {string} status - Status of the campaign
 * @property {string} data_added - Date added of the campaign
 * @property {string} send_at - Send at of the campaign (YYYY-MM-DD hh:mm)
 * @property {GetCampaignRecordList[]} record.list - List of the campaign
 * @memberof Campaigns
 * @see https://api-docs.mailwizz.com/#get-one-campaign
 */
export interface GetCampaignResponseRecord {
	campaign_uid: string;
	campaign_id: string;
	name: string;
	type: string;
	from_name: string;
	from_email: string;
	to_name: string;
	reply_to: string;
	subject: string;
	status: string;
	date_added: string;
	send_at: string;
	[group: string]: any;
}

/**
 * @description Interface for the list of the campaign response record
 * @interface GetCampaignRecordList
 * @property {string} list_uid - List UID of the campaign
 * @property {string} name - Name of the campaign
 * @property {number} subscribers_count - Subscribers count of the campaign
 * @memberof Campaigns
 * @see https://api-docs.mailwizz.com/#get-one-campaign
 */
export interface GetCampaignRecordList {
	list_uid: string;
	name: string;
	subscribers_count: number;
}


/**
 * @description Interface for the parameters of the API call to create a campaign
 * @interface CreateCampaignParams
 * @property {string} name - Name of the campaign
 * @property {CreateCampaignType} type - Type of the campaign
 * @property {string} fromName - From name of the campaign
 * @property {string} fromEmail - From email of the campaign
 * @property {string} subject - Subject of the campaign
 * @property {string} replyTo - Reply to of the campaign
 * @property {string} sendAt - Send at of the campaign (YYYY-MM-DD hh:mm:ss)
 * @property {string} listId - List ID of the campaign
 * @property {string} segmentId - Segment ID of the campaign
 * @property {string} urlTracking - URL tracking of the campaign
 * @property {string} templateId - Template ID of the campaign
 * @memberof Campaigns
 * @see https://api-docs.mailwizz.com/#create-a-campaign
 */
export interface CreateCampaignParams {
	name: string;
	type?: CreateCampaignType;
	fromName: string;
	fromEmail: string;
	subject: string;
	replyTo: string;
	sendAt: string;
	listId: string;
	segmentId?: string;
	urlTracking?: string;
	templateId: string;
}

/**
 * @description Type of the campaign
 * @enum {string}
 * @memberof Campaigns
 */
export enum CreateCampaignType {
	REGULAR = "regular",
	AUTORESPONDER = "autoresponder"
}

/**
 * @description Interface for the response of the API call to create a campaign
 * @interface CreateCampaignResponse
 * @property {string} status - Status of the response
 * @property {string} campaign_uid - Campaign UID of the response
 * @memberof Campaigns
 * @see https://api-docs.mailwizz.com/#create-a-campaign
 */
export interface CreateCampaignResponse {
	status: string;
	campaign_uid: string;
}

/**
 * @description Interface for update a campaign
 * @interface UpdateCampaignParams
 * 
 */
