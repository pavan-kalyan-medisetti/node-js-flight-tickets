// Mock database using in-memory arrays
const flights = [
    { id: "FL101", airline: "Delta Air Lines", origin: "New York", destination: "London", date: "2026-10-15", price: 450, totalSeats: 60, bookedSeats: 58 },
    { id: "FL102", airline: "Emirates", origin: "Dubai", destination: "Mumbai", date: "2026-10-16", price: 300, totalSeats: 100, bookedSeats: 45 },
    { id: "FL103", airline: "Singapore Airlines", origin: "Singapore", destination: "Tokyo", date: "2026-10-17", price: 550, totalSeats: 80, bookedSeats: 79 },
    { id: "FL104", airline: "Lufthansa", origin: "Frankfurt", destination: "Paris", date: "2026-10-18", price: 150, totalSeats: 50, bookedSeats: 12 }
];

const bookings = [];

module.exports = { flights, bookings };
