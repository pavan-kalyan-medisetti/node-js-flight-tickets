# Flight Booking API Mini Project

A lightweight Node.js and Express REST API for managing flight ticket bookings with an in-memory data store.

## Setup Instructions

1. Extract the ZIP file.
2. Open your terminal in the `flight-booking-api` directory.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

- **GET** `/api/flights` - Retrieve all flights or filter using `?origin=New York&destination=London`
- **POST** `/api/bookings` - Book a flight (JSON Body: `passengerName`, `flightId`, `seatsRequested`)
- **GET** `/api/bookings` - Retrieve all user bookings
- **GET** `/api/bookings/:id` - Fetch specific booking details by ID
