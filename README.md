
# DriverFit <br>
 
DriverFit is an application that has the main feature of detecting fatigue by targeting vehicle drivers with the aim of minimising accidents mainly due to fatigue. <br>

url : http://localhost:3000

# Service
**POST /register** <br>
<img width="640" alt="image" src="https://github.com/DriverFit/Backend/assets/103325979/c9445fbe-21f2-4f47-80e1-aff28b88f7e9"> <br>

 
 **POST /login** <br>
 <img width="632" alt="image" src="https://github.com/DriverFit/Backend/assets/103325979/3fab826a-9d8f-4ea7-9268-fca35095cfc4"> <br>

 
 **GET /users/id** <br>


 # Database
 This database is used for login and register <br>
 **users** <br>
<img width="374" alt="Screenshot 2023-12-20 223305" src="https://github.com/DriverFit/Backend/assets/103325979/32fcae7f-3786-42f8-bc56-c09c9e13930b"> <br>



# Architecture

<img width="418" alt="image" src="https://github.com/DriverFit/Backend/assets/103325979/f14ac369-b1f9-4b5e-a8f9-2eae8fa95071"> <br>

This architecture is for login and register, Machine Learning models are directly applied to Mobile without being Deployed to Google Cloud Platform. <br>
We use Cloud services to deploy the API. we create APIs using the Node.js programming language. we use SQL storage with Mysql and to store images using Google Storage.




# Depedency
- bcrypt <br>
- body-parser <br>
- express <br>
- multer <br>
- mysql <br>
- nodemon <br>
- path <br>



