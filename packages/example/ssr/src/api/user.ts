import BaseMethod from '@/api/index';

class UserApi extends BaseMethod {
	/**
	 * 获取用户基本信息
	 */
	public getUserInfo(): Promise<API.User.Response> {
		return this.get('/api/user');
	}
}

export default UserApi;

const api = new UserApi();

export { api };
