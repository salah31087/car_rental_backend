import * as yup from 'yup';

// Create a Yup validation schema
const carSchema = yup.object().shape({
    model: yup.string().required('Model is required'),
    type: yup.string().required('Type is required'),
    pricePerDay: yup.number().positive().required('Price per day is required'),
    location: yup.string().required('Location is required'),
    gearBox: yup.string().transform((value) => value?.toLowerCase()).oneOf(['manual', 'automatic'], 'Gearbox must be either manual or automatic').required('Gearbox is required'),
    maximumSpeed: yup.number().positive().required('Maximum speed is required'),
    fuelType: yup.string().transform((value) => value?.toLowerCase()).oneOf(['petrol', 'diesel', 'electric'], 'Fuel type must be either petrol, diesel or electric').required('Fuel type is required'),
    manufacturedYear: yup.number().integer().min(1886).max(new Date().getFullYear()).required('Manufactured year is required'),
    maxPassengers: yup.number().integer().positive().required('Maximum passengers are required'),
    mileage: yup.number().positive().required('Mileage is required'),
    airCondition: yup.boolean().required('Air conditioning field is required'),
    description: yup.string(),
    // carMainImage: yup.string(),
    // carGallery: yup.array().of(yup.string()).optional(),
    availability: yup.boolean().default(true),
});

export default carSchema;
