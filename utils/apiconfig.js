export const base_url = "https://exchange-slot-6a5d90e49e18.herokuapp.com";
export const server_url = `${base_url}/hello`;
export const logout_url = `${base_url}/auth/logout`;
export const get_new_access_token_url = `${base_url}/auth/refresh_access_token`;
// ================ ACCOUNT ENDPOINT ======================
export const register_api = `${base_url}/auth/register`;
export const login_api = `${base_url}/auth/login`;
export const reset_password_api = `${base_url}/auth/reset_password`;
export const account_api = `${base_url}/account`;
export const forgot_password_api = `${base_url}/auth/forget_password`;
export const verify_otp_api = `${base_url}/auth/verify_otp`;
// ================ EXCHANGE ENDPOINT ===============
export const exchange_class_create_api = `${base_url}/exchange_class`;
export const exchange_class_delete_api = (id) => `${base_url}/exchange_class/id/${id}`;
export const exchange_class_get_by_classCode_api = (classCode, page) => `${base_url}/exchange_class/class_code/${classCode}/page/${page}`;
export const exchange_slot_create_api = `${base_url}/exchange_slot`;
export const exchange_slot_delete_api = (id) => `${base_url}/exchange_slot/id/${id}`;
export const exchange_class_get_by_slot_api = (slot, page) => `${base_url}/exchange_slot/slot/${slot}/page/${page}`;
// ================EXCHANGE GET INFORMATION ENDPOINT ===========
export const exchange_class_get_by_studentCode = (studentCode) => `${base_url}/exchange_class/student_code/${studentCode}`;
export const exchange_slot_get_by_studentCode = (studentCode) => `${base_url}/exchange_slot/student_code/${studentCode}`;
export const get_classList = (page) => `${base_url}/class/page/${page}`;
// ================= ADMIN PRIVILIGE ============================
export const class_api_for_admin = `${base_url}/class`;
