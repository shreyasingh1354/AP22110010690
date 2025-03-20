# Average Calculator HTTP Microservice

This project implements a REST API microservice that calculates averages of different types of numbers (prime, Fibonacci, even, and random) fetched from a third-party server.

## Features

- REST API endpoint that accepts different number type identifiers
- Sliding window implementation for unique number storage
- Configurable window size with automatic management
- Timeout handling for external API calls (500ms maximum)
- JWT Bearer token authentication
- Comprehensive response formatting with previous and current state

## API Specification

### Get Numbers by Type


GET /numbers/{numberType}


Parameters:
- numberType: Type of numbers to fetch
  - p: Prime numbers
  - f: Fibonacci numbers
  - e: Even numbers
  - r: Random numbers

Headers:
- Authorization: Bearer token for authentication

### Response Format

json
{
  "windowPrevState": [],
  "windowCurrState": [1, 3, 5, 7],
  "numbers": [1, 3, 5, 7],
  "avg": "4.00"
}


## Business Logic

- The service maintains a configurable window size (e.g., 10) for storing unique numbers
- Upon each request, the service fetches numbers from the third-party server
- Duplicate numbers are disregarded to ensure uniqueness
- Requests taking longer than 500ms or encountering errors are ignored
- When the window size is exceeded, the oldest numbers are replaced with the newest ones
- Each response includes:
  - Previous window state before the API call
  - Current window state after the API call
  - Numbers received from the third-party server
  - Average calculation of the current numbers

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)


## Installation

1. Clone the repository or extract the project files
2. Navigate to the project directory
3. Install dependencies:
   

npm install


## Running the Application

Start the server:

npm start


The server will run on port 9876 by default.

## Testing

### Example Test Case

Assuming a window size of 10 and server running on localhost port 9876:

#### Request

GET http://localhost:9876/numbers/e


#### 1st Response
json
{
  "windowPrevState": [],
  "windowCurrState": [2, 4, 6, 8],
  "numbers": [2, 4, 6, 8],
  "avg": "5.00"
}


#### 2nd Response
json
{
  "windowPrevState": [2, 4, 6, 8],
  "windowCurrState": [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
  "numbers": [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
  "avg": "23.40"
}


### Test Server APIs

For testing, a test server is provided with the following APIs that return numbers of a particular type:

#### Prime Numbers API
- Request: http://20.244.56.144/test/primes
- Response: { "numbers": [2,3,5,7,11] }

#### Fibonacci Numbers API
- Request: http://20.244.56.144/test/fibo
- Response: { "numbers": [55,89,144,233,377,610,987,1597,2584,4181,6765] }

#### Even Numbers API
- Request: http://20.244.56.144/test/even
- Response: { "numbers": [8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56] }

#### Random Numbers API
- Request: http://20.244.56.144/test/rand
- Response: { "numbers": [2,19,25,7,4,24,17,27,30,21,14,10,23] }

![image](https://github.com/user-attachments/assets/57ba805c-deac-41f8-9d7c-05f43f06cf01)



# Social Media Analytics HTTP Microservice

## Overview

This microservice provides real-time analytical insights for business stakeholders monitoring user behavior on a social media platform. It consumes APIs from a test social media server to deliver two key endpoints:

1. *Top Users API* - Returns the top five users with the highest number of posts
2. *Top/Latest Posts API* - Returns either the most popular posts (by comment count) or the latest posts

## Requirements

- The microservice exclusively consumes the test server API for data retrieval
- Users are pre-authorized business stakeholders (no registration or login required)
- Performance, responsiveness, and accuracy are critical
- The application must adapt to potential changes in the social media platform's data structure

## API Endpoints

### Top Users


GET http://hostname/users


*Response*: Top five users with the highest number of posts

*Implementation Considerations*:
- Efficient storage and retrieval of user post counts
- Minimizing API calls to reduce costs

### Top/Latest Posts


GET http://hostname/posts?type=[latest|popular]


*Query Parameters*:
- type: Either "latest" or "popular" (default)

*Response*:
- When type=popular: All posts with the maximum number of comments
- When type=latest: Latest 5 posts in real-time, with the newest posts first

*Implementation Considerations*:
- Effective identification of posts with highest comment counts
- Handling unsorted and potentially large datasets
- Managing continuously updating data feeds

## Test Server APIs

The microservice consumes the following test server APIs:

### Get Users API


GET http://20.244.56.144/test/users


Returns all users registered on the social media application.

### Get Posts API


GET http://20.244.56.144/test/users/:userid/posts


Returns all posts authored by a specific user.

### Get Comments API


GET http://20.244.56.144/test/posts/:postid/comments


Returns all comments on a specific post.
