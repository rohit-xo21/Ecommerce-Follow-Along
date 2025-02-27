# Ecommerce-Follow-Along

# 🛒 **ShopEase - Your One-Stop Online Shopping Experience**  

## **Overview**  
Welcome to **ShopEase**, an e-commerce platform reimagined! Designed with simplicity and elegance, ShopEase provides a seamless shopping experience for customers and efficient management tools for administrators. Whether you're a shopaholic or a business owner, ShopEase caters to your needs with style.  

---

## **Why ShopEase?**  
- **Convenience First**: Shop anytime, anywhere, from any device.  
- **Customer-Centric Design**: Features crafted with user feedback to ensure ease of use.  
- **Powerful Admin Tools**: Manage products, orders, and analytics effortlessly.  
- **Secure & Scalable**: Built on modern technology to grow with your business.  

---

## **Core Features**

### **For Shoppers**  
- 🛍️ **Browse & Discover**: Explore products with advanced filtering and search options.  
- ❤️ **Wishlist**: Save your favorite items for later.  
- 🛒 **Smart Cart**: A cart that remembers your items even when you leave.  
- 💳 **Seamless Checkout**: Multiple payment options with lightning-fast processing.  
- ⭐ **Reviews & Ratings**: Make informed decisions with community feedback.  

### **For Admins**  
- 📦 **Inventory Management**: Add, update, and organize products with ease.  
- 📊 **Real-Time Analytics**: Track sales, revenue, and customer engagement.  
- 👥 **User Management**: Assign roles, manage permissions, and ensure security.  
- 🚚 **Order Tracking**: Keep customers updated with live order statuses.  

---

## **Unique Highlights**  

- **Gamified Shopping**: Earn points for every purchase and redeem them for discounts.  
- **AI-Powered Recommendations**: Personalized product suggestions based on browsing history.  
- **Dark Mode**: Shop in style with an eye-friendly dark mode.  
- **Voice Search**: Find products faster by simply speaking to ShopEase!  

---

## **Tech Stack**  

- **Frontend**: React.js with Tailwind CSS for an intuitive and responsive interface.  
- **Backend**: Node.js with Express.js for a fast and secure API.  
- **Database**: MongoDB to store products, user profiles, and orders efficiently.  
- **Payment Gateway**: Stripe for smooth and secure transactions.  
- **Hosting**: Vercel for frontend deployment and AWS for backend services.  
- **Testing**: Jest for unit testing and Postman for API testing.  
- **Additional Tools**: WebSocket for live notifications, Firebase for authentication.  

---




## Milestone 2: Project Setup and Login Page

### Achievements:
1. Created the basic project skeleton.
2. Created the Login Page:
   - User is able to input his credentials: username/email and password.
   - Basic UI styling was applied using tailwind css.
3.  Test login functionality to make sure it works correctly.


---

## Milestone 3: Project Setup for Backend

In this milestone, the backend for the e-commerce application was established with the following:

1. Organized Folder Structure:  
   Added folders for controllers, models, routes, utils, and middlewares to improve maintainability.

2. Server and Database Setup:  
   - Built a Node.js and Express server to handle API requests.  
   - Connected to MongoDB using Mongoose for efficient data storage.

3. Error Handling:  
   Added basic error handling.
---

## Milestone 4: User Model, Controller, and File Uploads

### Features Implemented
1. Created a User Model to structure user data.
2. Set up a User Controller to handle user-related operations.
3. Configured Multer for file uploads (e.g., profile pictures).
4. Added routes for creating and fetching users.

--- 

## Milestone 5  

### Achievements:
1. **Created a Sign-Up Page:**  
   - Designed a clean and user-friendly interface with fields for:
     - Name  
     - Email  
     - Password  

2. **Implemented Form Validation:**  
   - Ensured proper email format validation.  
   - Added password validation with minimum security criteria.  

---

## Milestone 6

### Features implemented:
1. Implemented a backend signup endpoint that encrypts passwords using bcrypt and securely stores user data (name, email, etc.) in the database, ensuring privacy and compliance with security best practices.

--- 

## Milestone 7

### Features Implemented:
- **User Login Endpoint**: Developed an API to authenticate users by validating email/username and password, using bcrypt to securely hash and compare passwords.
- **Security**: Ensured secure storage of passwords by hashing them and implementing proper error handling for invalid credentials.

---

## Milestone 8

### Features Implemented:
- **Reusable Product Card Component**: Designed a dynamic card component that displays product details such as name, price, image, rating, and review count. It is reusable and accepts props for different product data.
- **Homepage Layout**: Implemented a responsive grid layout to showcase multiple product cards on the homepage, ensuring a clean and structured design for better user experience.

---

## Milestone 9

### Features Implemented:

- Product input form with validation.
- Multiple image upload functionality.

---

## Milestone 10 

### Achievements

- Created a Mongoose schema for products, including fields like name, description, and price with validation.  
- Developed a POST endpoint to receive product data and store it in MongoDB.  
- Implemented validation to ensure data integrity before saving product details.


---


## Milestone 11 

### Features implemented:

- Created an endpoint to fetch all product data stored in MongoDB and send it to the frontend.  
- Developed a function on the frontend to retrieve the data and display it dynamically using the product card component.  
- Enabled seamless integration between the backend and frontend for dynamic product display.

---

Here's a summary for **Milestone 12** to add to your README:  

---

## Milestone 12: Displaying User-Specific Products  

In this milestone, we implemented a **"My Products"** page that dynamically displays products added by a specific user. To achieve this, we:  

- **Created a backend endpoint** that filters and retrieves products based on the logged-in user's email from MongoDB.  
- **Fetched the filtered data on the frontend** and displayed it dynamically using the previously created product card component.  

---

## Milestone 13: Editing Uploaded Products  

In this milestone, we implemented **product editing functionality**, allowing users to modify previously uploaded products. Key implementations:  

- **Created a backend endpoint** to update product details in MongoDB.  
- **Added an "Edit" button** to each product card on the frontend.  
- **Auto-filled the form** with existing product data when the edit button was clicked, allowing users to update details before saving.

---

Here’s the summary for **Milestone 14** to add to your README:  

---

## Milestone 14: Deleting Products  

In this milestone, we implemented **product deletion functionality**, allowing users to remove products from the database. Key implementations:  

- **Created a backend endpoint** to delete a product from MongoDB using its unique ID.  
- **Added a "Delete" button** to each product card on the frontend.  
- **Sent the product ID to the backend** when the delete button was clicked to remove the product from the database.  

---

Here's the summary for **Milestone 15** to add to your README:  

---

## Milestone 15: Creating a Navbar Component  

In this milestone, we built a **Navbar component** to enable smooth navigation across different pages in our application. Key implementations:  

- **Created a reusable Nav component** with links to:  
  - Home  
  - My Products  
  - Add Product  
  - Cart  
- **Integrated the Navbar into all pages**, ensuring seamless navigation.  

---

## Milestone 16: Creating a Product Info Page  

In this milestone, we developed a **Product Info Page** that displays detailed information about each product and allows users to select a quantity and add items to the cart. Key implementations:  

- **Created a new product details page** that dynamically displays product information.  
- **Added a quantity selector** to let users choose how many units to purchase.  

---

## Milestone 17: Implementing Cart Functionality  

In this milestone, we built the backend functionality to **add products to the cart** and store them in the database. Key implementations:  

- **Updated the user schema** to include a cart field for storing selected products. 
- **Developed a backend endpoint** to receive product details and store them in the database when a user adds an item to the cart.  

---

## Milestone 18: Fetching Cart Items  

In this milestone, we implemented a **backend endpoint** to retrieve all products stored in a user's cart. Key implementations:  

- **Created a backend endpoint** to fetch cart items using the user's email.    

---

## Milestone 19: Enhancing Cart Functionality  

In this milestone, we implemented the **cart page UI** and enabled quantity adjustments for products. Key implementations:  

- **Created a frontend cart page** to display products using the existing backend API.  
- **Added `+` and `-` buttons** to allow users to increase or decrease product quantity.  
- **Developed backend endpoints** to handle quantity updates in the database.  

---  