require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = 3000;
// const APP_URL = '103.93.218.32';


app.use("/stripe", express.raw({ type: "*/*" }));
app.use(express.json());
app.use(cors());

app.post("/pay", async (req, res) => {
  try {
    const { email, totalPrice, name, address, zipCode } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice,
      currency: "pkr",
      payment_method_types: ["card"],
      metadata: { name: name, email: email, address: address, zipCode: zipCode },
    });
    const clientSecret = paymentIntent.client_secret;
    res.json({ message: "Payment initiated", clientSecret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// app.post("/stripe", async (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   let event;
//   try {
//     event = await stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: err.message });
//   }

//   // Event when a payment is initiated
//   if (event.type === "payment_intent.created") {
//     console.log(`${event.data.object.metadata.name} initated payment!`);
//   }
//   // Event when a payment is succeeded
//   if (event.type === "payment_intent.succeeded") {
//     console.log(`${event.data.object.metadata.name} succeeded payment!`);
//     // fulfilment
//   }
//   res.json({ ok: true });
// });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
