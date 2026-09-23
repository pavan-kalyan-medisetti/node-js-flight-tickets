const express = require('express');
const { flights, bookings } = require('./data');

const app = express();
// Use environment port if available (great for AWS/Docker), fallback to 3000
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// 0. ROOT ROUTE (Fixes the "Cannot GET /" error)
app.get('/', (req, res) => {
    res.json({
        message: "✈️ Welcome to the Flight Booking API!",
        availableEndpoints: {
            "Search/Get All Flights": "GET /api/flights?origin=HYD&destination=BLR",
            "Book a Ticket": "POST /api/bookings",
            "View All Bookings": "GET /api/bookings",
            "Get Booking Details by ID": "GET /api/bookings/:id"
        }
    });
});

// 1. SEARCH FLIGHTS (Filter by origin and destination)
app.get('/api/flights', (req, res) => {
    const { origin, destination } = req.query;
    
    if (!origin || !destination) {
        return res.json(flights);
    }

    const filteredFlights = flights.filter(f => 
        f.origin.toLowerCase() === origin.toLowerCase() && 
        f.destination.toLowerCase() === destination.toLowerCase()
    );

    res.json(filteredFlights);
});

// 2. BOOK A TICKET
app.post('/api/bookings', (req, res) => {
    const { passengerName, flightId, seatsRequested } = req.body;

    if (!passengerName || !flightId || !seatsRequested || seatsRequested <= 0) {
        return res.status(400).json({ error: "Missing required booking details or invalid seat count." });
    }

    const flight = flights.find(f => f.id === flightId);
    if (!flight) {
        return res.status(404).json({ error: "Flight not found." });
    }

    const availableSeats = flight.totalSeats - flight.bookedSeats;
    if (seatsRequested > availableSeats) {
        return res.status(400).json({ 
            error: `Not enough seats available. Only ${availableSeats} remaining.` 
        });
    }

    flight.bookedSeats += seatsRequested;

    const newBooking = {
        bookingId: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
        passengerName,
        flightId,
        airline: flight.airline,
        route: `${flight.origin} to ${flight.destination}`,
        seatsBooked: seatsRequested,
        totalCost: flight.price * seatsRequested,
        bookingDate: new Date().toISOString().split('T')[0]
    };

    bookings.push(newBooking);
    res.status(201).json({ message: "Booking confirmed successfully!", bookingDetails: newBooking });
});

// 3. VIEW ALL BOOKINGS
app.get('/api/bookings', (req, res) => {
    res.json(bookings);
});

// 4. GET SPECIFIC TICKET DETAILS BY ID
app.get('/api/bookings/:id', (req, res) => {
    const booking = bookings.find(b => b.bookingId === req.params.id);
    
    if (!booking) {
        return res.status(404).json({ error: "Ticket booking reference not found." });
    }
    
    res.json(booking);
});

app.listen(PORT, () => {
    console.log(`✈️ Flight Booking API is live on port ${PORT}`);
});
