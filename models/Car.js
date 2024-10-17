import mongoose from 'mongoose';

const { Schema } = mongoose;

const carSchema = new Schema(
  {
    model: String,
    type: String,
    pricePerDay: Number,
    location: String,
    gearBox: String,
    maximumSpeed: Number,
    fuelType: String,
    manufacturedYear: Number,
    maxPassengers: Number,
    mileage: Number,
    airCondition: String,
    description: String,
    carMainImage: String,
    carGallery: [String],
    availability: { type: Boolean, default: true },
  },
  { timestamps: true }
);


const Car = mongoose.model('Car', carSchema);

export default Car;



// ! =============== Example ================
// {
//   "model": "Toyota Camry",
//   "type": "Sedan",
//   "pricePerDay": 55,
//   "location": "New York",
//   "gearBox": "Automatic",
//   "maximumSpeed": 200,
//   "fuelType": "Gasoline",
//   "manufacturedYear": 2021,
//   "maxPassengers": 5,
//   "mileage": 12000,
//   "airCondition": true,
//   "description": "A comfortable and reliable sedan with excellent fuel efficiency.",
//   "carMainImage": "https://example.com/car-main-image.jpg",
//   "carGallery": [
//     "https://example.com/car-gallery-1.jpg",
//     "https://example.com/car-gallery-2.jpg",
//     "https://example.com/car-gallery-3.jpg"
//   ]
// }

// {
//   "model": "Ford Mustang",
//   "type": "Coupe",
//   "pricePerDay": 85,
//   "location": "Los Angeles",
//   "gearBox": "Manual",
//   "maximumSpeed": 250,
//   "fuelType": "Gasoline",
//   "manufacturedYear": 2020,
//   "maxPassengers": 4,
//   "mileage": 8000,
//   "airCondition": true,
//   "description": "A sporty coupe with thrilling performance and stylish design.",
//   "carMainImage": "https://example.com/mustang-main-image.jpg",
//   "carGallery": [
//     "https://example.com/mustang-gallery-1.jpg",
//     "https://example.com/mustang-gallery-2.jpg",
//     "https://example.com/mustang-gallery-3.jpg"
//   ]
// }



// {
//   "model": "Honda Civic",
//   "type": "Compact",
//   "pricePerDay": 40,
//   "location": "Chicago",
//   "gearBox": "Automatic",
//   "maximumSpeed": 180,
//   "fuelType": "Gasoline",
//   "manufacturedYear": 2019,
//   "maxPassengers": 5,
//   "mileage": 25000,
//   "airCondition": true,
//   "description": "A reliable compact car known for its fuel efficiency and comfort.",
//   "carMainImage": "https://example.com/civic-main-image.jpg",
//   "carGallery": [
//     "https://example.com/civic-gallery-1.jpg",
//     "https://example.com/civic-gallery-2.jpg",
//     "https://example.com/civic-gallery-3.jpg"
//   ]
// }


// {
//   "model": "Tesla Model 3",
//   "type": "Sedan",
//   "pricePerDay": 100,
//   "location": "San Francisco",
//   "gearBox": "Automatic",
//   "maximumSpeed": 225,
//   "fuelType": "Electric",
//   "manufacturedYear": 2022,
//   "maxPassengers": 5,
//   "mileage": 5000,
//   "airCondition": true,
//   "description": "An electric sedan with advanced technology and impressive range.",
//   "carMainImage": "https://example.com/model3-main-image.jpg",
//   "carGallery": [
//     "https://example.com/model3-gallery-1.jpg",
//     "https://example.com/model3-gallery-2.jpg",
//     "https://example.com/model3-gallery-3.jpg"
//   ]
// }


// {
//   "model": "Chevrolet Tahoe",
//   "type": "SUV",
//   "pricePerDay": 95,
//   "location": "Miami",
//   "gearBox": "Automatic",
//   "maximumSpeed": 190,
//   "fuelType": "Gasoline",
//   "manufacturedYear": 2021,
//   "maxPassengers": 7,
//   "mileage": 15000,
//   "airCondition": true,
//   "description": "A spacious SUV perfect for family trips and adventures.",
//   "carMainImage": "https://example.com/tahoe-main-image.jpg",
//   "carGallery": [
//     "https://example.com/tahoe-gallery-1.jpg",
//     "https://example.com/tahoe-gallery-2.jpg",
//     "https://example.com/tahoe-gallery-3.jpg"
//   ]
// }
