import axios from 'axios'

const baseURL = 'http://localhost:3030/'

// const baseURL = 'https://0326-123-201-248-77.ngrok-free.app/'

// const baseURL = 'https://employee-management-system-wxt6.onrender.com/'
// const baseURL = 'http://localhost:8080/'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})
////////////////////////////////// Payroll Api//////////////////////////////////////////

export const payRollMakeOrder = (data: any) => api.post('/makeorder', data)
// export const payRollMakeOrder = () => api.get('/pay')

export const getEmployeeIds = () => api.post('/get_employee_id_list')

export const addEmployee = (data: any) => api.post('/create_employee', data)

export const getEmployeeById = (employeeId: string, data: any) =>
  api.post(`/get_employee_by_id/${employeeId}`, data)

export const updateEmployee = (employeeId: string, data: any) =>
  api.put(`/update_employee/${employeeId}`, data)

export const employeeExit = (employeeId: string, data: any) =>
  api.put(`/handle_employee_status/${employeeId}`, data)
export const deleteEmployee = (employeeId: string) =>
  api.delete(`/delete_employee/${employeeId}`)

export const getAllEmployees = (data: any) =>
  api.post('/get_all_employees', data)

export const getDashboardDetails = (data: any) => api.post('/dashboard', data)

// Auth API
export const signUpUser = (data: any) => api.post('/signup', data)

export const signInUser = (data: any) => api.post('/signin', data)
//////////////////////////////////////////////////////////////////////////////////////////////
/// User API
export const createUser = (data: any) => api.post('/create_user', data)

export const getAllUsers = (data: any) => api.post('/get_all_users', data)

export const updateUser = (userId: string, data: any) =>
  api.put(`/update_user/${userId}`, data)

export const deleteUser = (userId: string, data: any) =>
  api.delete(`/delete_user/${userId}`, data)

//////////////////////////////////////////////////////////////////////////////////////////////
// Designation API
export const getAllDesignations = (data: any) =>
  api.post('/get_all_designations', data)

export const createDesignation = (data: any) =>
  api.post('/create_designation', data)

export const getAllDepartments = (data: any) =>
  api.post('/get_all_departments', data)

export const createDepartment = (data: any) =>
  api.post('/create_department', data)

export const updateDepartment = (department_id: string, data: any) =>
  api.put(`/update_department/${department_id}`, data)
export const updateDesignation = (designation_id: string, data: any) =>
  api.put(`/update_designation/${designation_id}`, data)
//////////////////////////////////////////////////////////////////////////////////////////////
// Salary Payment API
export const createSalaryPayment = (data: any) =>
  api.post('/handle_payment_method', data)
////////////////////////////////////////////////////////////////////////////////////////////

// Bulk Employee API
export const createBulkEmployee = (data: any) =>
  api.post('/create_bulk_employees', data)
////////////////////////////////////////////////////////////////////////////////////////////
// loan API
export const getAllLoans = (data: any) => api.post('/get_all_loans', data)

export const createLoan = (data: any) => api.post('/create_loan', data)
////////////////////////////////////// END Payroll API ////////////////////////////////////////

/// EMS API
export const emsSignUpUser = (data: any) => api.post('/ems_signup', data)
export const emsSignInUser = (data: any) => api.post('/ems_signin', data)

export const emsCreateDesignation = (data: any) =>
  api.post('/create_ems_designation', data)
export const emsGetAllDesignations = (data: any) =>
  api.post('/get_all_ems_designations', data)
export const emsUpdateDesignation = (designation_id: string, data: any) =>
  api.put(`/update_ems_designation/${designation_id}`, data)

export const emsCreateDepartment = (data: any) =>
  api.post('/create_ems_department', data)
export const emsGetAllDepartments = (data: any) =>
  api.post('/get_all_ems_departments', data)
export const emsUpdateDepartment = (department_id: string, data: any) =>
  api.put(`/update_ems_department/${department_id}`, data)

export const emsCreateEmployee = (data: any) =>
  api.post('/create_ems_employee', data)
export const emsGetAllEmployees = (data: any) =>
  api.post('/get_all_ems_employees', data)

export const emsGetEmployeeById = (employee_id: string, data: any) => api.post(`/get_ems_employee_by_id/${employee_id}`, data)

export const updateEmsEmployee = (employeeId: string, data: any) =>
  api.put(`/update_ems_employee/${employeeId}`, data)

export const deleteEmsEmployee = (employeeId: string) =>
  api.delete(`/delete_ems_employee/${employeeId}`)

export const emsCreateProject = (data: any) =>
  api.post('/create_ems_project', data)
export const emsGetAllProjects = (data: any) => api.post('/ems_projects', data)

export const emsUpdateProject = (project_id: string, data: any) =>
  api.put(`/update_ems_project/${project_id}`, data)

export const emsCreateTask = (data: any) => api.post('/create_ems_tasks', data)

export const emsGetAllTasks = (data: any) => api.post('/get_all_ems_tasks', data)

export const emsGetEmployeeIdList = () => api.post('/get_ems_employee_id_list')

export const emsCreateBulkEmployee = (data: any) =>
  api.post('/create_bulk_ems_employees', data)


export const emsGetTasksById = (id: string) => api.get(`/get_ems_tasks_by_id/${id}`)

export const emsUpdateTask = (id: string, data: any) => api.put(`/update_ems_tasks/${id}`, data)

export const deleteEmsTasks = (id: string) => api.delete(`/delete_ems_tasks/${id}`)

export const emsGetEmployeeTasksList = (data: any) => api.post('/get_ems_employee_tasks_list', data)

export const emsUpdateEmployeeTaskStatus = (data: any) => api.post('/update_ems_employee_task_status', data)

export const getEmsDashboardDetails = (data:any )=> api.post('/ems_dashboard',data)