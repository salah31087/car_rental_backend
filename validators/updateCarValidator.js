import * as yup from 'yup';

// Create a Yup validation schema for updating car details
const updateCarSchema = yup.object().shape({
    model: yup.string().optional(),
    type: yup.string().optional(),
    pricePerDay: yup.number().positive().optional(),
    location: yup.string().optional(),
    gearBox: yup.string().transform((value) => value?.toLowerCase()).oneOf(['manual', 'automatic'], 'Gearbox must be either manual or automatic').optional(),
    maximumSpeed: yup.number().positive().optional(),
    fuelType: yup.string().optional(),
    manufacturedYear: yup.number().integer().min(1886).max(new Date().getFullYear()).optional(),
    maxPassengers: yup.number().integer().positive().optional(),
    mileage: yup.number().positive().optional(),
    airCondition: yup.boolean().optional(),
    description: yup.string().optional(),
    carMainImage: yup.string().url('Must be a valid URL').optional(),
    carGallery: yup.array().of(yup.string().url('Must be a valid URL')).optional(),
    availability: yup.boolean().optional(),
});

export default updateCarSchema;
