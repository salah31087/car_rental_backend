import * as yup from 'yup';

export const reservationValidationSchema = yup.object().shape({
  carId: yup
    .string()
    .required('Car ID is required.'),

  name: yup
    .string()
    .required('Name is required.')
    .min(2, 'Name must be at least 2 characters long.')
    .max(25, 'Name must be at most 25 characters long.'),

  location: yup
    .string()
    .required('Location is required.')
    .min(3, 'Location must be at least 3 characters long.')
    .max(100, 'Location must be at most 100 characters long.'),

  number: yup
    .string()
    .required('Phone number is required.')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits.'),

  startDate: yup
    .date()
    .required('Start date is required.')
    .min(new Date(), 'Start date must be in the future.'),

  endDate: yup
    .date()
    .required('End date is required.')
    .min(yup.ref('startDate'), 'End date must be after start date.'),

  status: yup
    .string()
    .oneOf(['pending', 'confirmed'], 'Status must be either "pending" or "confirmed".')
});

export const reservationUpdateValidationSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters long.")
    .max(25, "Name must be at most 25 characters long."),

  location: yup.string(),
  number: yup.string().matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),

  startDate: yup
    .date()
    .min(new Date(), "Start date must be in the future."),

  endDate: yup
    .date()
    .min(yup.ref("startDate"), "End date must be after start date."),

  status: yup
    .string().trim()
    .oneOf(
      ["pending", "confirmed"],
      'Status must be either "pending" or "confirmed".'
    ),
});

export default reservationValidationSchema;

