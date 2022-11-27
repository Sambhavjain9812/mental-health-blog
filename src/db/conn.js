const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/mentalhealth", {
    // useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("successful");
  })
  .catch((error) => {
    console.log(error);
  });
