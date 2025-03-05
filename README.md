# AlphaAPIProject

This project features a full-stack application designed to enable users to participate in voluntary activities. The front-end provides an intuitive user interface, while the back-end handles data management, user authentication, and activity coordination. Together, they create a seamless experience for users to discover, join, and manage volunteer opportunities.

## Table of Content
* [Installation](#installation)
* [Usage](#usage)
* [Project Structure](#project_structure)
* [Configuration](#configuration)
* [API Endpoints](#api_endpoints)
<a name="installation"></a>
## Installation
Steps to set up the project locally:

1. Clone the repository:

     ```bash
     git clone https://github.com/andersonjr1/AlphaAPIProject.git
     cd AlphaAPIProject/
     ```

1. Install dependencies:

     ```bash
     npm install
     ```

1. Set up environment variables:

     * Create a `.env` file in the root directory.
     * Add necessary environment variable (e.g., `PORT`, `SECRETE_KEY`).

1. Create db_data in the root directory

1. Run the application:

     ```
     npm start
     ```
     or, for development with nodemon:
     ```
     npm run dev
     ```

<a name="usage"></a>
## Usage
Once the application is running, you can interact with it through the front-end or directly via API endpoints.

* Visit `http://localhost:PORT/entrar` in your browser to access the sign in page.

* Visit `http://localhost:PORT/registrar` in your browser to access the sign up page.
* Visit `http://localhost:PORT/disponivel` in your browser to access the page with all available activities for the logged user to participate.

* (Only Admin) Visit `http://localhost:PORT/criar` in your browser to access the page that can create new activities.

* (Only Admin) `http://localhost:PORT/atividades` in your browser to access the page with all activities. In this page the admin can delete an activity, edit an activity and visualize all participants of an activity.



<a name="project_structure"></a>
## Project Structure
```
project-name/
├── src/
│   ├── config/          # Enviroment configuration.
│   ├── controllers/     # Logic for handling requests
│   ├── database/        # Databases
│   ├── pages/           # Static pages
│   ├── routes/          # API route definitions
│   ├── utils/           # Utility functions
│   └── app.js           # Main application file
├── .gitignore           # Files and directories to ignore in Git
├── package-lock.json    # Lockfile for dependencies
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```
<a name="configuration"></a>
## Configuration
To run this project, you need to set up environment variables in a `.env` file. Below are the required variables:
```.env
# Server Configuration
PORT=3000

# JWT Authentication
SECRET_KEY="your-secret-key-for-authentication"

```

<a name="api_endpoints"></a>
## API Endpoints
The API provides RESTful endpoints for interacting with the application. Below is a list of available endpoints, their methods, description, if login is necessary and if must be admin.

### Authentication
| Method | Endpoint | Logged in | Admin | Description |
| ------ | -------- | --------- | ----- | ----------- |
| POST | /api/login/ | no | no | Authenticate an user |
| POST | /api/register/ | no | no | Creates an user |

### Enrollment
| Method | Endpoint | Logged in | Admin | Description |
| ------ | -------- | --------- | ----- | ----------- |
| POST | /api/enrollment/ | yes | no | Enroll user in an activity |
| DELETE | /api/enrollment/ | yes | no | Unroll user in an activity |

### Activities
| Method | Endpoint | Logged in | Admin | Description |
| ------ | -------- | --------- | ----- | ----------- |
| GET | /api/activity/ | yes | yes | Returns all activities |
| GET | /api/activity/:id | yes | yes | Returns all participants from an activity  |
| GET | /api/activity/search? | yes | no | Returns available activites for the user, or activities that the user is enrolled |
| POST | /api/activity/ | yes | yes | Create an activity |
| PUT | /api/activity/:id | yes | yes | Edit an activity |
| DELETE | /api/activity/:id | yes | yes | Delete an activity |
