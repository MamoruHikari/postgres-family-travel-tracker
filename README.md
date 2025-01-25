# Postgres Family Travel Tracker

An interactive web application designed to track family travels and visited countries. Built with a focus on simplicity, functionality, and engaging design, this app uses Node.js, Express, and PostgreSQL for seamless data management and dynamic rendering.

## Deployed Application
Check out the deployed app here: [Postgres Family Travel Tracker](https://postgres-family-travel-tracker.onrender.com). *Note*: The app is hosted on the free tier of Render, so it may take up to 60 seconds to load.

## Features
- **User Management**: Add new family members with unique names and assign custom colors for easy distinction.  
- **Country Tracking**: Log the countries each user has visited, dynamically fetched and stored in the PostgreSQL database.  
- **Dynamic Updates**: Display data (e.g., visited countries, total count) dynamically based on user interactions.  
- **Interactive UI**: Built with EJS templates to deliver a responsive and user-friendly interface.  
- **Error Feedback**: Provide clear error messages for issues like duplicate entries or incomplete details.  
- **Session Handling**: Track the currently active user session for a personalized experience.  

## Tech Stack
- **Frontend**: HTML, CSS, EJS for templating.  
- **Backend**: Node.js with Express framework.  
- **Database**: PostgreSQL (via Neon service for database hosting).  
- **Hosting**: Render (for app deployment).  
- **Middleware**: `body-parser` for parsing form data, `express-session` for session handling.  

## Future Enhancements
1. **Advanced Statistics**: Add insights like the most visited countries, total number of countries visited, and travel trends.  
2. **Search and Filter**: Implement search functionality to filter countries or users.  
3. **User Authentication**: Introduce secure login and signup features for individual users.  
4. **Map Integration**: Visualize visited countries on an interactive world map.  
5. **Mobile Optimization**: Enhance the UI/UX for smaller screens and improve responsiveness.  
6. **Dark Mode**: Add a toggle for light and dark modes to improve accessibility.  

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.  
