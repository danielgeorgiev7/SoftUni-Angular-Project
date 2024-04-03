# Cinemasync Website Documentation

## Project Overview

Cinemasync is a platform dedicated to movies, providing a space for users to engage with each other through posts, comments, and likes.

The website offers information about most popular movies, top box office and 20 unique movie categories.

# Features

 ## Home Page
      
  Carousels of most popular movies and top box office
  
 ## Login
 
   Allows users to log in to their accounts.

 ## Register
 
   Enables new users to create accounts.

 ## Categories
 
   List of 20 movie categories leading to a category page when clicked.

   Each category page is accessible through /categories/:categoryName.

   Each category page contains top 50 movies of that category.

 ## Posts

   Posts page for logged-in users displaying posts with summary information.

   Each post details page is accessible by clicking a post or through /posts/:postId.

   Post details pages contain information about the post and comments.

   Posts can be commented by all logged-in users.
   
   Posts and comments can be liked by all logged-in users except their creator.

   Post and comments can be edited and deleted by their creator.
      
 ## Profile

  Profile page for logged-in users displaying user information and posts by user.

  Profile page is accessible through navigation bar and /profile.

  Profile information such as profile image, bio and favourite movie can be edited there.

# Project Architecture

## Frontend

### Angular: 

Used for building the user interface. 

### Boostrap

Used for styling components in combination with regular CSS.

## API Integration

Fetches movie-related information from MoviesVerse API.

## Firebase

### Realtime Database: 

Firebase Realtime Database is used to store and retrieve information.

### Authentication: 

Firebase Authentication handles user sign-up, sign-in, and user management.

### Storage: 

Firebase Storage is used to store media files such as images.

### Hosting: 

Firebase Hosting is used for deployment of the application.

## External APIs

### MoviesVerse API:

Retrieves real-time movie information for most popular movies and top box office.
