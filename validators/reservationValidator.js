import * as yup from 'yup';

const reservationValidationSchema = yup.object().shape({
    carId: yup
        .string()
        .required('Car ID is required.'),

    name: yup
        .string()
        .required('Name is required.')
        .min(2, 'Name must be at least 2 characters long.')
        .max(100, 'Name must be at most 100 characters long.'),

    location: yup
        .string()
        .required('Location is required.')
        .min(3, 'Location must be at least 3 characters long.')
        .max(100, 'Location must be at most 100 characters long.'),

    number: yup
        .string()
        .required('Phone number is required.')
        .matches(/^\+?[1-9]\d{1,14}$/, 'Phone number must be in a valid format.'),

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

export default reservationValidationSchema;
