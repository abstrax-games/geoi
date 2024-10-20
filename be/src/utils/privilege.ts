class PrivilegeChecker {
    // 普通用户权限
    static readonly IS_LOGIN = 0; // 登录
    
    static readonly ADD_GEOI = 1; // 添加句子

    // 管理员权限
    static readonly MANAGE_GEOI = 4096;
    static readonly MANAGE_USER = 8192;
    static readonly MANAGE_SYSTEM = 16384;

    // 检查权限
    static check(userPrivilege: { privilege: number }, privilege: number): boolean {
        return (userPrivilege.privilege & privilege) === privilege
    }
}

export default PrivilegeChecker