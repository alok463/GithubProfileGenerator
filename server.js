const inquirer = require("inquirer");
const fs = require("fs-extra");
const util = require("util");
const axios = require("axios");
const puppeteer = require("puppeteer");
const generateHTML = require("./createHTML"); 
const writeFileAsync = util.promisify(fs.writeFile);
const nodemailer = require('nodemailer')
const path =  require('path')
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
const directory = 'html';
const dotenv = require('dotenv');

dotenv.config();

//function that prompts the user what their github user name is and sets it as a constant userNameInput
function userNameInput(){
    const username = inquirer.prompt({
        type: "input",
        name: "username",
        message:"What is your Github username?",

    });
    return username;
}
function EmailInput(){
    const email = inquirer.prompt({
        type: "input",
        name: "email",
        message:"What is your email?",
    });
    return email;
}

//function that prompts the user what their color choice is out of the four options
function userColorChoice(){
    const color = inquirer.prompt({
        type: "rawlist",
        name: "color",
        message: "What color would you like your PDF to be?",
        choices: ["Green", "Blue", "Pink", "Red"]
    });
    return color;
}
//Calls the api and assigns the value to be username
function githubAPICall(username){
    let data = axios.get(`https://api.github.com/users/${username}`)
    return data;
}
function githubAPIStar(username){
    let gitStars = axios.get(`https://api.github.com/users/${username}/starred`)
    return gitStars
}





//async function always returns with a promise 
async function initz(){
    //try test for errors that are within the block
    try{
        // After userNameInputs function is executed, assign its value to let to an object
        let {username} = await userNameInput();
        let {email} = await EmailInput()
        // As the same as the call above it. After userColorChoice() function is executed. Take the color choice and assigns it to an object
        const {color} = await userColorChoice();
        //calls the api and assigns the username to the value and then assigns it to data.
        let {data} = await githubAPICall(username);
        let gitStars = await githubAPIStar(username);
        let gitStarsLength = gitStars.data.length
         //this data.color = color is for generateHTML.js to use. Has to be put below let{data} or else it doesnt know what data is
        data.color = color;
        data.gitStarsLength = gitStarsLength;
        const html = generateHTML(data);
        writeFileAsync('./html/index.html', html).then(function() {
        console.log("Successfully wrote to index.html");

    });

    //Generate PDF through puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html);
    await page.emulateMediaType("screen");
    await page.pdf({
        path: `html/${username}.pdf.pdf`,
        format: "A4",
        printBackground: true 

    });
   
    console.log("Successfully created PDF file.");
   
    await browser.close();
    let mailOptions = {
        to: email,
        subject: 'Sending Your Github Profile PDF To Your Email',
        from: process.env.email,
        attachments: [{
             filename: `${username}.pdf.pdf`,
             path: `./html/${username}.pdf.pdf`
        }]
        // attachments: [{
        //     filename: `${username}.pdf.pdf`,
        //     path: fs.createReadStream(`html/${username}.pdf.pdf`)
        // }],
    }
   
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.email, 
            pass: process.env.password
        }
    })
  
    await transporter.sendMail(mailOptions);
    console.log(`Mail sent to your inbox`) 

    }
    //if the error is outside of the try block it would trip catch
    catch(err){
        console.log(err);
    }
}
async function toRun() {
    console.log(`Delete started`)
    try {
      const files = await readdir(directory);
      const unlinkPromises = files.map(filename => unlink(`${directory}/${filename}`));
      console.log(`Files in the directory deleted`)
      return Promise.all(unlinkPromises);
      
    } catch(err) {
      console.log(err);
    }
  }
  
//create directories

async function createDirectory() {
   let Directories;
   try {
    
    if(fs.existsSync('html')) {
         console.log(`Directory already exists`)
         console.log(`Removing the directory and creating a new directory`)
         await fs.rmdir(path.join(__dirname, 'html'));
         console.log(`Creating a new directory`)
         Directories = await fs.mkdir(path.join(__dirname, 'html'));
    }
    if(!fs.existsSync('html')) {
    console.log(`Created a new directory`)
    Directories = await fs.mkdir(path.join(__dirname, 'html'));
    }

   }catch(error) {
       console.log(error)
   }
 
}



async function Sequence() {
   
    const fileDirectories = await createDirectory();
    const initialize = await initz()
    console.log(`Deleting files`)
    const ToRun = await toRun();
    await fs.rmdir(path.join(__dirname, 'html'));
    console.log('Finished')
    process.exit();
}

Sequence();