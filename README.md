# Columbia Valley Hut Society: MERN Stack Project
This full-stack React web application was built and designed for use by the Columbia Valley Hut Society, a Canadian volunteer-run organization responsible for several mountain cabins throughout the Columbia Mountain range of BC. 

## Preview
For access to the current deployed version [visit the CVHS](https://powerful-oasis-65796.herokuapp.com/)

## Motivation
As a volunteer organization it is incredibly difficult to maintain a website that holds up to modern design standards and speeds. When using the [original CVHS](http://cvhsinfo.org/cms/) Booking engine it was apparent that the website was not maintained to a high standard and suffered constantly over all devices, with mobile optimization being out of the question. As someone who had found great joy in using the facilities maintained by the CVHS, this project became a mutually beneficial way for me to develop my skills as a React developer, and give back to a community that provides a sevice I greatly apprectiate.

## Design 
The client demographic for the CVHS varies massively, requiring high contrast colors and carful consideration of font size. As a heading font 'Bungee' depicts the bold, prominent nature associated with mountain environments. Stone grey and deep blue are the two most common colors in the alpine, reflecting the Ingeous rock and distant atmospheric haze respectively. Neumorphism is widely used throughout the website, adding an element of varying toography to the application. 

## Features 
This web application was built with the understanding that anyone with the administration privileges should be able to read and understand the features of this website, as well as write, update and delete data associated with it. As a booking engine, clients are able to:
* Register an account (JWT & Bcrypt)
* Login
* Verify email address before creating reservations
* Receive a general overview of each of the cabins
* Understand the price breakdown for each cabin
* Pay through integrated Paypal Rest SDK
* Review bookings under Account Information
* Add/Delete comments on any posts

Additionaly, those with Admin privileges are able to:
* Create, edit and delete news posts
* Remove inappropriate comments
* Search for reservations by id, email, name, or mobile number
* Make amendments to existing reservations
* Cancel existing reservations while triggering an automatic 80% refund

## API's
**SendGrid**: Send verification and booking confirmation emails from the backend server.

**Paypal Rest SDK**: Providing secure payment link from secure backend with redirect back to web app. Capable of capturing initial payments by clients, whilst refunds only accessible to those with Admin privileges.

## Coming In Future Updates
* Replacing Paypal Rest SDK with Card Payments via Stripe
* Booking via Admin increases date range by two weeks, for an additional $35 fee
* Date Modifications prompt a charge/refund to associated card before finalizing
* Refactoring JS to remove non-DRY sections, splitting components to reduce sizes.
* Optimizing through the addition of React Memo
* Increased accessibility support for screen readers
* Alternative Dark Mode CSS
* Restructuring CSS for each element (ie: button styles in button.css)


