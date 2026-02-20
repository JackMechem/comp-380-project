# Frontend and Backend Communication & Backend Design

# Basic Backend Design (Follows REST API Standard)

## Routes <a name="routes-table"></a>

| Resource                  | Method            | URL                          | Description                                                                                                                                                                         | Accepts Query Strings                                                                                                                                                                                                                                                               |
| ------------------------- | ----------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth/Login                | POST              | `/api/auth/login`            | Authenticate user and return a token or session.                                                                                                                                    | No                                                                                                                                                                                                                                                                                  |
| Cars                      | GET               | `/api/cars`                  | Search/Filter cars.                                                                                                                                                                 | Yes -- To Filter: `/api/cars?type=SUV&avaliable=true&transmition=manual`. Return specific car: `/api/cars?carid={id}`. Only return specific parameters: `/api/cars?include=make&include=model&include=id` (if include is not provided it should default to include all parameters). |
| Reviews                   | GET               | `/api/cars/reviews`          | Get reviews for cars.                                                                                                                                                               | Yes -- For reviews on a specific car: `/api/cars/reviews?carid={id}`. To get a specific review: `/api/cars/reviews?reviewid={id}`. To get reviews tied to a specific user: `/api/cars/reviews?userid={id}`                                                                          |
| Add to Cart               | POST              | `/api/cart`                  | Add car to cart in account. Car ID and user authentication token will be sent through the request body.                                                                             | No                                                                                                                                                                                                                                                                                  |
| Get Cart                  | GET               | `/api/cart`                  | Get contents of cart for logged in user.                                                                                                                                            | No                                                                                                                                                                                                                                                                                  |
| Create Bookings           | POST              | `/api/bookings`              | Checkout and create a booking. This will have more complexity when dealing with payment services like stripe. Usually a stripe session number is provided so we can verify payment. | No                                                                                                                                                                                                                                                                                  |
| Get Bookings              | GET               | `/api/bookings`              | View all bookings for the logged in user.                                                                                                                                           | Yes -- To get specific booking: `/api/bookings?bookingid={id}`                                                                                                                                                                                                                      |
| Cancel Bookings           | DELETE            | `/api/bookings`              | Cancel a specific booking by booking ID. Accepts query strings.                                                                                                                     | Yes -- To delete specific booking: `/api/bookings?bookingid={id}`                                                                                                                                                                                                                   |
| **Admin**: Modify Booking | PATCH             | `/api/admin/bookings/modify` | Update booking to "Picked Up" or "Returned".                                                                                                                                        | Yes -- To modify specific booking: `/api/admin/bookings/modify?bookingid={id}`                                                                                                                                                                                                      |
| **Admin**: Cancel Booking | DELETE (or PATCH) | `/api/admin/bookings/cancel` | Cancel or delete a booking. Since we may not want to delete or archive the booking right away, we can use PATCH to mark the entry as cancled and handle the deletion later.         | No                                                                                                                                                                                                                                                                                  |
| **Admin**: All Reports    | GET               | `/api/admin/reports`         | Get sales reports.                                                                                                                                                                  | Yes -- To get reports within date range: `/api/admin/reports?datemin=2005-05-13&datemax=2020-08-23`. To get reports on user: `/api/admin/reports?userid={id}`)                                                                                                                      |

## Responses from API

### GET `/api/cars`

When dealing with very large databases, APIs often return reponses in "pages" to avoid sending large amounts of data to the client, which could potentially clog up the server and increase reponse times. When using pages, the server will return an object indicating how many total pages there are, what page was sent, and how many objects are in a page. These parameters usually have default values but can be changed with a query string, with the exception of the total pages parameter.

Query string example with pages: `/api/cars?page=1&objects-per-page=10`.

#### Example response with default page parameters & no query parameters

```json
{
    "cars": [
        {
            "id": "7SAXCBE62RF001234",
            "make": "Volkswagen",
            "model": "Golf GTI",
            "year": 2024,
            "transmission": "manual",
            "gears": 6,
            "fuelType": "gas",
            "engineIsInline": true,
            "engineCylinders": 4,
            "engineDisplacement": 2.0,
            "torqe": 273,
            "torqeUnit": "ft-lb"
            "engineExtraDetails": ["Turbocharged"],
            "horsepower": 228,
            "seats": 5,
            "milesPerGallonOrChargeHighway": 30,
            "milesPerGallonOrChargeCity": 25,
            "pricePerDay": 85.0,
            "currency": "USD",
            "isAvailable": true,
            "imageUrls": ["https://imageurl.jpg", "https://anotherimageurl.jpg"],
            "longitude": -118.2437,
            "latitude": 34.0522,
            "features": ["Heated Seats", "Keyless Ignition", "Leather Seats"],
            "description": "It's a VW Golf GTI and it's sick."
        },
        {
            "id": "2T3P1RFV5PW123456",
            "make": "Mercedes Benz",
            "model": "C300",
            "year": 2009,
            "transmission": "automatic",
            "gears": 7,
            "fuelType": "gas",
            "engineIsInline": false,
            "engineCylinders": 4,
            "engineDisplacement": 2.0,
            "torqe": 221,
            "torqeUnit": "ft-lb"
            "engineExtraDetails": [],
            "horsepower": 228,
            "seats": 5,
            "milesPerGallonOrChargeHighway": 25,
            "milesPerGallonOrChargeCity": 20,
            "pricePerDay": 113.0,
            "currency": "USD",
            "isAvailable": true,
            "imageUrls": ["https://imageurl.jpg", "https://anotherimageurl.jpg"],
            "longitude": -118.2437,
            "latitude": 34.0522,
            "features": ["Heated Seats",  "Leather Seats"],
            "description": "It's a Mercedes C300"
        },
        {
            "id": "7SAXCBE62RF001234",
            "make": "Tesla",
            "model": "Model 3 Long Range",
            "year": 2024,
            "transmission": "automatic",
            "gears": 1,
            "fuelType": "electric",
            "engineIsInline": false,
            "engineCylinders": null,
            "engineDisplacement": null,
            "torqe": 377,
            "torqeUnit": "ft-lb",
            "engineExtraDetails": ["Dual Motor AWD", "82 kWh Battery"],
            "horsepower": 394,
            "seats": 5,
            "milesPerGallonOrChargeHighway": 124,
            "milesPerGallonOrChargeCity": 138,
            "pricePerDay": 145.0,
            "currency": "USD",
            "isAvailable": true,
            "imageUrls": ["https://imageurl.jpg", "https://anotherimageurl.jpg"],
            "longitude": -118.2437,
            "latitude": 34.0522,
            "features": [
                "Autopilot",
                "Premium Audio",
                "Glass Roof",
                "Heated and Ventilated Seats"
            ],
            "description": "Teslas suck"
        }
    ],
    "pageInfo": {
        "current": 1,
        "total": 50,
        "objectsPerPage": 3,
    },
}
```

## Example Frontend Implementation With Next.js (App Router)

### GET `/api/cars`

#### Query parameters used

String: `?include=make&include=model&include=id`

#### Response from server

```json
{
	"cars": [
		{
			"id": "7SAXCBE62RF001234",
			"make": "Volkswagen",
			"model": "Golf GTI"
		},
		{
			"id": "2T3P1RFV5PW123456",
			"make": "Mercedes Benz",
			"model": "C300"
		},
		{
			"id": "7SAXCBE62RF001234",
			"make": "Tesla",
			"model": "Model 3 Long Range"
		}
	],
	"pageInfo": {
		"current": 1,
		"total": 50,
		"objectsPerPage": 3
	}
}
```

#### Example React component that fetches data from API and displays car make and model, along with the total cars in the system.

```javascript
const CarsPage = async () => {
	const response = await fetch(
		"https://server.com/api/cars?include=make&include=model&include=id",
		{
			method: "GET",
			headers: {
				Accept: "application/json",
			},
			cache: "no-store",
		},
	);

	if (!response.ok) {
		return <div>Error! Server responded with status: {response.status}</div>;
	}

	const result = await response.json();

	return (
		<div>
			<h1>Cars</h1>
			<div>
				{result.data.map((car) => (
					<div key={car.id}>
						<p>
							{car.make} {car.model}
						</p>
					</div>
				))}
			</div>
			<p>
				Total cars: {result.pageInfo.total * result.pageInfo.objectsPerPage}
			</p>
		</div>
	);
};

export default CarsPage;
```
