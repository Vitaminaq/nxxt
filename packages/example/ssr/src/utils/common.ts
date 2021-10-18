/**
 * 判断邮箱格式是否正确
 * @param email 
 * @returns 
 */
export function isEmail(email: string): boolean {
  const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (email && !emailReg.test(email)) {
    return false;
  }
  return true;
}