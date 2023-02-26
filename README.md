![alt text](https://github.com/prakash02dec/Restaurant-Reservation-system-/blob/main/Screenshot%20(171).png)
# ResDine
---
### [Report-Link](https://github.com/prakash02dec/Restaurant-Reservation-system-/blob/main/REPORT.pdf) 
<!-- ### Deployment-Link
#### AWS  [[http://ec2-15-206-100-143.ap-south-1.compute.amazonaws.com/]([http://52.66.205.99:3000/)](http://ec2-15-206-100-143.ap-south-1.compute.amazonaws.com/](http://52.66.205.99:3000/))         
#### Heroku [https://resdine.herokuapp.com/](https://resdine.herokuapp.com/)
--- -->
## Team Members
|Name|Email|Institute ID|    |    
|----|-----|-------|-----|    
| [Om Morendha](https://github.com/omkmorendha) | omkmorendha@gmail.com |20bcs095| Backend |
| [Nikam Yash](https://github.com/Yashnikam-10) | 20bcs093@iiitdwd.ac.in |20bcs093| Frontend |
| [Nimish Mangee](https://github.com/Nimishmangee) | 20bcs094@iiitdwd.ac.in |20bcs094| Frontend |
| [Prakash Agarwal](https://github.com/prakash02dec) | prakash02dec@gmail.com |20bcs099| Backend |
| [Sudeepto Chatterjee](https://github.com/sudeepto147) | sudeepto11032001@gmail.com |20bcs130| Frontend |

### Project Objectives
<!-- **A website for restaurant management which will have the following features:** -->
* Here, we want to provide a service for medium-to-high end restaurants to avail more reservations.
* Since our service is similar to "Bookmyshow" or "Zomato", restaurants would also get organic marketing in a similar manner.
* Our website would also help users to find good restaurants in their area.


#### FRAMEWORK AND LANGUAGE USED
1. HTML/CSS
2. Javascript
3. Bootstrap
4. NodeJS
5. Express.js
6. MongoDB

#### Node Packages/Dependencies Used
* "body-parser": "^1.19.0",
* "cors": "^2.8.5",
* "dotenv": "^10.0.0",
* "ejs": "^3.1.6",
* "express": "^4.17.1",
* "express-session": "^1.17.2",
* "lodash": "^4.17.21",
* "mongoose": "^6.0.14",
* "mongoose-findorcreate": "^3.0.0",
* "passport": "^0.5.0",
* "passport-google-oauth20": "^2.0.0",
* "passport-local": "^1.0.0",
* "passport-local-mongoose": "^6.1.0"
* "multer": "^1.4.4",
* "port": "^0.8.1"
   
---

### YOU WILL NEED MONGODB ATLAS CLUSTER, GOOGLE DEVELOPER ACCOUNT AND PAYTM DEVELOPER TO STEP ENV FILE CREDENTIAL 
Note : Always keep below env credential personal plzz dont share for secuirty purpose

#### ENV Setup
Create .env file as below.
```sh
GOOGLE_CLIENT_ID = 
GOOGLE_CLIENT_SECRET = 
MERCHANT_ID = 
MERCHANT_KEY = 
WEBSITE=WEBSTAGING
CHANNEL_ID=WEB
ATLAS_USER_ID=
ATLAS_USER_PASSWORD=
```
---

#### Installation Steps
Install the dependencies and devDependencies and start the server.

```sh
$ npm install
$ npm app.js 
```
* Open below url in browser!
http://localhost:3000/

---
#### credentials to login
* Mobile no=7777777777
* OTP = 489871
* any card CVV = 123

---
### AWS DEPLOYMENT DOCUMENTATION
1. Login into AWS and under the Services tab -> Compute, click on EC2.
2. After navigating to the EC2 dashboard, click on the “Launch Instance” button.
3. On AMI (Amazon Machine Images) selection page, we will choose Ubuntu 20.04 LTS which is also free-tier available or you can choose of your own choice
4. Choose the default instance type which is t2.micro.
5. Leave the default configurations for Configure Instance Details and Add Storage
6. Give a Tag resdine with key 123
7. In Configure Security Group, we will make SSH rule , HTTP rule , HTTPS rule , CUSTOM TCP rule with port 3000 for node js server and use source as anywhere.
8. Click on Review and Launch and save key pair
9. In the instance details click on the “Connect” button,here we will connect through SSH. we expect you already install AWS CLI on your system.
10. Copy the example link and paste in your terminal here you get connected with your instances
11. Now follow the following code in your terminal.. And I will be using little bit vim here
###### NOTE: following command is according to ubuntu instances
```sh
sudo apt-get update
sudo apt-get upgrade
sudo su
```
12. Now here git clone your files..
```sh
mkdir server
cd Restaurant-Reservation-system-
cp * -r /home/ubuntu/server
cd ..
cd server
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt install nodejs
npm install
vim /etc/environment
```
13. Now press I to insert and use arrows keys if you dont know how to navigate with H J K L inside vim mode then press escape then type :wq to save.. now on terminal type reboot and reconnect with instances ..
```sh
sudo su 
cd server
```
14. Now make sure the package.json file to have a npm start under script as below for example
```sh
"scripts": {
  "start": "node app.js"
}
```
```sh
npm start
```
15. Go to the instance IPv4 address + "3000" ,make sure address starts with HTTP as we haven’t added SSL encryption so you can’t access it through HTTPS.
16. Now we will install a library called pm2, which will keep our application running on the background..
```sh
sudo npm i -g pm2
pm2 start index.js
```
17. Finally , we will install and set-up Nginx as a reverse-proxy to redirect out application to the default port 80
```sh
sudo apt-get install nginx
vim /etc/nginx/sites-enabled/default
```
18. Now paste the below code 
```sh
server {
   listen         80 default_server;
   listen         [::]:80 default_server;
   server_name    localhost;
   root           /usr/share/nginx/html;
location / {
       proxy_pass http://127.0.0.1:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
   }
}
```
19. Restart the nginx
```sh
sudo service nginx restart
```
##### If you face problem then I will suggest to visit nginx or pm2 documentation first then stackoverflow.. If still error persist drop us mail.

---
###### Futher it will be updated as we proceed
