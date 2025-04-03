import * as z from 'zod'

export const employeeSchema = z.object({
  first_name: z
    .string()
    .min(3, { message: 'First Name must be at least 3 characters' }),
  last_name: z
    .string()
    .min(3, { message: 'Last Name must be at least 3 characters' }),
  employee_id: z.string().min(1, { message: 'Employee ID is required' }),
  date_of_joining: z
    .string()
    .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
      message: 'Date of Joining should be in the format YYYY-MM-DD',
    }),
  email: z.string().email({ message: 'Enter a valid email address' }),
  gender: z.string().min(1, { message: 'Gender is required' }),
  work_location: z.string().min(1, { message: 'Work Location is required' }),
  designation_id: z.string().min(1, { message: 'Designation is required' }),
  department_id: z.string().min(1, { message: 'Department is required' }),
 annual_ctc: z.coerce.number().min(1, 'Annual CTC is required'),
  personal_email: z.string().email({ message: 'Enter a valid email address' }),
  mobile_number: z.string()
  .min(10, 'Mobile Number must be exactly 10 digits')
  .max(10, 'Mobile Number must be exactly 10 digits')
  .regex(/^\d{10}$/, { message: 'Mobile Number must be exactly 10 digits' }),
  date_of_birth: z.string().min(1, { message: 'Date of Birth is required' }),
  age: z.number().min(1, { message: 'Age is required' }),
  fathers_name: z.string().min(1, { message: 'Fathers Name is required' }),
  pan: z.string()
    .min(1, { message: 'PAN is required' })
    .length(10, { message: 'PAN must be exactly 10 characters' })
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'Invalid PAN format' }),
  address_line1: z.string().min(1, { message: 'Address Line 1 is required' }),
  address_line2: z.string().min(1, { message: 'Address Line 2 is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  pincode: z.string().min(1, { message: 'Pin Code is required' }),
})

export type EmployeeFormValues = z.infer<typeof employeeSchema>

export const emsEmployeeSchema = z.object({
  first_name: z
    .string()
    .min(3, { message: 'First Name must be at least 3 characters' }),
  last_name: z
    .string()
    .min(3, { message: 'Last Name must be at least 3 characters' }),
  employee_id: z.string().min(1, { message: 'Employee ID is required' }),
  date_of_joining: z
    .string()
    .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
      message: 'Date of Joining should be in the format YYYY-MM-DD',
    }),
  email: z.string().email({ message: 'Enter a valid email address' }),
  gender: z.string().min(1, { message: 'Gender is required' }),
  work_location: z.string().min(1, { message: 'Work Location is required' }),
  designation_id: z.string().min(1, { message: 'Designation is required' }),
  department_id: z.string().min(1, { message: 'Department is required' }),
 annual_ctc: z.coerce.number().min(1, 'Annual CTC is required'),
  personal_email: z.string().email({ message: 'Enter a valid email address' }),
  mobile_number: z.string()
  .min(10, 'Mobile Number must be exactly 10 digits')
  .max(10, 'Mobile Number must be exactly 10 digits')
  .regex(/^\d{10}$/, { message: 'Mobile Number must be exactly 10 digits' }),
  date_of_birth: z.string().min(1, { message: 'Date of Birth is required' }),
  age: z.number().min(1, { message: 'Age is required' }),
  fathers_name: z.string().min(1, { message: 'Fathers Name is required' }),
  pan: z.string()
    .min(1, { message: 'PAN is required' })
    .length(10, { message: 'PAN must be exactly 10 characters' })
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'Invalid PAN format' }),
  address_line1: z.string().min(1, { message: 'Address Line 1 is required' }),
  address_line2: z.string().min(1, { message: 'Address Line 2 is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  pincode: z.string().min(1, { message: 'Pin Code is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

export type EmsEmployeeFormValues = z.infer<typeof emsEmployeeSchema>

