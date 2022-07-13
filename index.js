import express, { response } from "express";
import path  from "path";
import got  from "got";
import dotenv from "dotenv";
import cors from "cors"
// import bodyParser from "body-parser";
// import body-parser from "body-parser";
dotenv.config()
const app = express();

app.use(express.static("public"));
app.use(express.json());

// app.use(cors({
//     origin: "*",
// }));
// app.use(bodyParser.json)
const __dirname = path.resolve()



const YOUR_DOMAIN = "http://localhost:8080";
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

// static files

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/checkout.html");
})
app.get("/success",function (req, res) {
  res.sendFile(__dirname + "/public/success.html");
})
// middleware

// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "https://example.com");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     next();
//   });
// routes
app.post("/payment",  async(req, res) => {
   
  console.log(req.body)
  

try {
    const response = await got.post("https://api.flutterwave.com/v3/payments", {
        headers: {
            Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
            "Access-Control-Allow-Origin": "*"
        },
        json: {
            tx_ref: makeid(12),
            amount: req.body.details.total,
            currency: "NGN",
            redirect_url: "https://localhost:8080/sucess",
           
            customer: {
                email: req.body.details.email,
                phonenumber: req.body.details.number,
                name:req.body.details.name ,
            },
            customizations: {
                title: "Azunda Payments",
                // logo: "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png"
            }
        }
    }).json();
    console.log(response)
  
    
    if(response.status==="success"){
      console.log( response.data.link+"/")
      
      
      
      res.send(response)
    }
} catch (err) {
    console.log(err.code);
    console.log(err.response.body);
}

  
    
});
console.log(process.env.FLW_SECRET_KEY)

// listening...
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
