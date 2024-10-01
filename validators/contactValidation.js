import * as yup from 'yup';

const contactValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required.')
    .min(2, 'Name must be at least 2 characters long.'),
  
  email: yup
    .string()
    .required('Email is required.')
    .email('Must be a valid email address.'),
  
  phoneNumber: yup
    .string()
    .required('Phone number is required.')
    .matches(/^\+?[1-9]\d{1,14}$/, 'Phone number must be a valid format.'),
  
  message: yup
    .string()
    .required('Message is required.')
    .min(10, 'Message must be at least 10 characters long.'),
});

export default contactValidationSchema;
