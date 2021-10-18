import HelpsApi from '@/api/user';
import { BaseLoaderData, BaseClass } from '@/utils/base-loader-class';
import { ReqConfig } from '@/services/publics';

/**
 * 导航条配置
 */
export class UserInfo extends BaseLoaderData<unknown, API.User.Data, HelpsApi> {
	public baseAjaxMethod() {
		return this.api.getUserInfo();
	}
}

class User extends BaseClass<HelpsApi> {
	public static moduleName = 'user';
	public userInfo: UserInfo;

	public constructor(reqConfig?: ReqConfig) {
		super(new HelpsApi(reqConfig));
		this.userInfo = new UserInfo(this.api);
	}
}
export default User;
