declare namespace API.User {
	export interface Data {
		user: User;
	}

	export interface User {
		id: number;
		sess_id: string;
		app_id: number;
		mobile: string;
		operation_password: string;
		email: string;
		corp_info_id: number;
		corp_id: number;
		fiv_liveness_ok: number;
		fiv_face_id_status: number;
		eva_quota_ok: number;
		eva_status: number;
		address_book_ok: number;
		corp_email_ok: number;
		operation_password_ok: number;
		emergency_contact_ok: number;
		quota_max: string;
		quota_used: string;
		quota_temporary: string;
		quota_status: number;
		dk_cash: string;
		channel: string;
		invitor_uid: number;
		unfreezed_loan_date: null;
		unfreezed_date: string;
		cust_group: string;
		risk_level: string;
		rate_type: number;
		last_login_ip: string;
		last_login_at: string;
		credited_at: string;
		pdf_id: string;
		pdf_url: string;
		last_broadcast_id: number;
		channel_id: number;
		is_hotel_new_user: number;
		created_at: string;
		updated_at: string;
		member_info: MemberInfo;
		enterprise_user_name: string;
		enterprise_user_position: string;
		enterprise_name: string;
		enterprise_id: string;
		is_corp_white: boolean;
		is_corp_quotas: boolean;
		is_corp_bankcard: boolean;
		bank_card: BankCard;
		im_url: string;
		im_title: string;
		is_hide_loan_cons: IsHideLoanCons;
		last_periods: number;
		idCardIsExpired: boolean;
		livenessIsExpired: boolean;
		wx_union_id: string;
		mina_openid: string;
		mp_openid: null;
		mp_td_status: string;
		remained_quota: string;
		quota_status_text: string;
		is_internal_employee: number;
		binded_thirds: BindedThirds;
		can_refiv: number;
		is_frozen_loan: number;
		stats: Stats;
		corp: UserCorp;
		corp_title: CorpTitle;
		id_card: IDCard;
		temporary_quotas: null;
		emergency_contact: EmergencyContact;
		user_cons_quota: UserConsQuota;
		user_points: UserPoints;
		account_info: AccountInfo;
	}

	export interface AccountInfo {
		uid: number;
		name: string;
		avatar_url: string;
		gender: number;
		thumb_avatar_url: string;
	}

	export interface BankCard {
		id: number;
		uid: number;
		bank_id: number;
		mobile: string;
		card_no: string;
		pdf_id: string;
		pdf_url: string;
		open_branch: string;
		valid_date: null;
		entrust_channel: number;
		pay_token: string;
		created_at: string;
		updated_at: string;
		bank: Bank;
	}

	export interface Bank {
		id: number;
		name: string;
		wx_bank_code: string;
		bank_code: string;
		logo_url: string;
		back_url: string;
		channel: string;
		status: number;
		created_at: string;
		updated_at: string;
	}

	export interface BindedThirds {
		Wechat: number;
		Etc: number;
		Rper: number;
		Enterprise: number;
	}

	export interface UserCorp {
		id: number;
		info_id: number;
		name: string;
		tax_no: string;
		type: string;
		telephone: string;
		address: string;
		email_host: string;
		reg_no: string;
		org_no: string;
		credit_no: string;
		founded_at: string;
		legal_man: string;
		is_black: number;
		created_at: string;
		updated_at: string;
		info: Info;
	}

	export interface Info {
		id: number;
		name: string;
		tax_no: string;
		type: string;
		telephone: string;
		address: string;
		email_host: string;
		reg_no: string;
		org_no: string;
		credit_no: string;
		founded_at: string;
		legal_man: string;
		remark: string;
		permit_status: number;
		audit_status: number;
		credit_grade: CreditGrade;
		social_security: SocialSecurityClass;
		c_trees: string[];
		p_trees: string[];
		grade: number;
		status: string;
		regist_capi_new: string;
		branches: string[];
		scale: number;
		has_illegal: number;
		crop_trade: string;
		available_titles: string[];
		user_titles: null;
		grade_tax_last_year: string;
		grade_tax_last: string;
		insurance_num: number;
		total_certed_persons: number;
		created_at: string;
		updated_at: string;
		permit_status_text: string;
		is_denied: boolean;
	}

	export interface CreditGrade {
		name: string;
		credit_no: string;
		grade_list: GradeList[];
	}

	export interface GradeList {
		year: string;
		grade: string;
	}

	export interface SocialSecurityClass {
		name: string;
		report_date: string;
		report_year: string;
		social_security: { [key: string]: SocialSecurityValue };
	}

	export enum SocialSecurityValue {
		Empty = '-',
		The0万元 = '0万元',
		The0人 = '0人',
	}

	export interface CorpTitle {
		id: number;
		uid: number;
		corp_id: number;
		name: string;
		open_bank: string;
		open_account: string;
		address: string;
		telephone: string;
		qr_code_url: string;
		created_at: string;
		updated_at: string;
		corp: CorpTitleCorp;
	}

	export interface CorpTitleCorp {
		id: number;
		name: string;
		tax_no: string;
	}

	export interface EmergencyContact {
		id: number;
		uid: number;
		relation: number;
		name: string;
		mobile: string;
		created_at: string;
		updated_at: string;
	}

	export interface IDCard {
		uid: number;
		real_name: string;
		cert_no: string;
		gender: number;
		valid_date: string;
		valid_status: number;
		is_expired: boolean;
	}

	export interface IsHideLoanCons {
		loan: number;
		cons: number;
	}

	export interface MemberInfo {
		id: number;
		uid: number;
		mobile: string;
		user_level: number;
		order_sn: string;
		channel: number;
		pay_pattern: number;
		open_time: string;
		updated_at: string;
		expire_time: string;
		open_type: number;
		money: string;
		member_days: number;
		open_first_time: string;
		next_right_date: string;
		version: number;
		channel_id: number;
		del_flag: number;
		create_time: string;
		next_renew_order_date: null;
		next_renew_payment_date: null;
		next_renew_type: number;
		user_type: number;
		is_formal: number;
		expire_time_str: string;
		memberDays: number;
		saveMoney: number;
	}

	export interface Stats {
		id: number;
		uid: number;
		invoice_num_total: number;
		invoice_fee_total: string;
		invoice_num: number;
		invoice_fee: string;
		invoice_repeat_times: number;
		reim_times: number;
		reim_fee: string;
		reim_times_total: number;
		reim_fee_total: string;
		repayment_times: number;
		repayment_fee: string;
		overdue_times: number;
		overdue_fee: string;
		overdue_fee_cur: string;
		interest_free_num: number;
		interest_free_fee: string;
		usable_coupon_num: number;
		fiv_id_card_num: number;
		ecp_input_same_mobile: number;
		new_msg_cnt: number;
		fiv_face_id_num: number;
		modify_corp_times: number;
		available_invoice_num: number;
	}

	export interface UserConsQuota {
		id: number;
		uid: number;
		eva_quota_ok: number;
		quota_max: string;
		quota_used: string;
		quota_status: number;
		eva_status: number;
		unfreezed_date: string;
		cust_group: string;
		repay_day: number;
		bill_day: number;
		risk_level: string;
		rate_type: number;
		overdue_fee_cur: string;
		first_cons_date: string;
		credited_at: string;
		created_at: string;
		updated_at: string;
		quota_basic: string;
		quota_vip: string;
		quota_pay: string;
		quota_routine: string;
		quota_quarter: string;
		remained_quota: string;
		can_refiv: number;
		current_date: CurrentDate;
		current_bill: null;
		current_overdue_date: null;
		first_overdue_bill: null;
		overdue_bill_count: number;
	}

	export interface CurrentDate {
		repay_date: string;
		bill_date: string;
	}

	export interface UserPoints {
		id: number;
		uid: number;
		total_num: string;
		available_num: string;
		unavailable_num: string;
		history_exchange_num: string;
		history_order_num: number;
		history_income_num: string;
		history_exchange_times: number;
		history_pay_num: string;
		history_pay_order_num: number;
		frozen_num: string;
		rate_equal_to_rmb: string;
		equal_to_rmb: string;
	}

	export type Response = API.APIBaseResponse<Data>;
}
