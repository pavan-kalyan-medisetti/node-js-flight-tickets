const express = require('express');
const { flights, bookings } = require('./data');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// 1. SEARCH FLIGHTS (Filter by origin and destination)
app.get('/api/flights', (req, reqRes) => {
    const { origin, destination } = req.query;
    
    if (!origin || !destination) {
        return reqRes.json(flights);
    }

    const filteredFlights = flights.filter(f => 
        f.origin.toLowerCase() === origin.toLowerCase() && 
        f.destination.toLowerCase() === destination.toLowerCase()
    );

    reqRes.json(filteredFlights);
});

// 2. BOOK A TICKET
app.post('/api/bookings', (req, reqRes) => {
    const { passengerName, flightId, seatsRequested } = req.body;

    if (!passengerName || !flightId || !seatsRequested || seatsRequested <= 0) {
        return reqRes.status(400).json({ error: "Missing required booking details or invalid seat count." });
    }

    const flight = flights.find(f => f.id === flightId);
    if (!flight) {
        return reqRes.status(404).json({ error: "Flight not found." });
    }

    const availableSeats = flight.totalSeats - flight.bookedSeats;
    if (seatsRequested > availableSeats) {
        return reqRes.status(400).json({ 
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
    reqRes.status(201).json({ message: "Booking confirmed successfully!", bookingDetails: newBooking });
});

// 3. VIEW ALL BOOKINGS
app.get('/api/bookings', (req, reqRes) => {
    reqRes.json(bookings);
});

// 4. GET SPECIFIC TICKET DETAILS BY ID
app.get('/api/bookings/:id', (req, reqRes) => {
    const booking = bookings.find(b => b.bookingId === req.params.id);
    
    if (!booking) {
        return reqRes.status(404).json({ error: "Ticket booking reference not found." });
    }
    
    reqRes.json(booking);
});

app.listen(PORT, () => {
    console.log(`✈️ Flight Booking API is live at http://localhost:3000`);
});
