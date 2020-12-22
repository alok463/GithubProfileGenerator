## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)

## General info
This Application allows you to generate your Github Profile in a pdf form and send the generated file to your inbox.
* The application is a command line application wherein it prompts the user to input his Github User name and also his email ID. 
* Upon recieving the User's Input the application creates directory to output the profile in a HTML format. 
* Furthermore the application picks the index.html from the directory and converts to a PDF file and sends the converted PDF file to the User's email. After its successful run, the application deletes the created directories and exits. 
	
## Technologies
I used the following Node libraries to create this project
* Nodemailer (To send email and attachments to the User's Inbox)
* Puppeteer (For Converting index.html to PDF files)
* fs modules (File System Modules for creating and removing directories)
* axios (To data request to an external API)
* Inquirer (For making input prompts)
	
## Things that I learnt during this course of this  project
* Promises and Async/Await Concepts
* FS modules, axios and nodemailer
## Setup
To run this project locally on your machine follow the below mentioned steps
```
$ mkdir newFolder
$ cd newFolder
$ git clone
$ touch .dotenv
$ add the your email and password
$ npm install --force
$ npm start
```
