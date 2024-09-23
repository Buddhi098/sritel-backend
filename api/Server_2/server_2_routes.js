const {
  INSERT,
  UPDATE,
  SELECT,
  DELETE,
  QUERY,
  SELECT_WHERE,
} = require("../../models/Server_2_DB");
const {
  INSERT3,
  UPDATE3,
  SELECT3,
  DELETE3,
  QUERY3,
  SELECT_WHERE3,
} = require("../../models/Server_3_DB");

const express = require("express");
const router = express.Router();
const { notification } = require("../../include/NodemailerConfig");

//ADMIN___________________________________________
router.post("/addpackage", async (req, res) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const data = req.body.data;
    const voice = req.body.voice;
    const sms = req.body.sms;
    const price = req.body.price;
    const type = req.body.type;

    // console.log('Data received:', { PK_name, PK_des, PK_data, PK_voice, PK_sms, PK_price, PK_type });

    const response = await QUERY3(
      `INSERT INTO package(name, description, type, data_limit, voice_limit, sms_limit, price) 
            VALUES('${name}', '${description}', '${type}', ${parseFloat(data)}, 
            ${parseInt(voice)}, ${parseInt(sms)}, ${parseInt(price)})`
    );

    res.send({
      type: "success",
      message: "Package added successfully",
      response,
    });
  } catch (error) {
    console.error("Error inserting package:", error); // Log the actual error
    res
      .status(500)
      .send({
        type: "error",
        message: "Error adding package",
        error: error.message,
      });
  }
});

// delete package___________________________________________
router.delete("/deletePackage/:id", async (req, res) => {
  try
  {
    const package_id = req.params.id
    if(package_id !== null)
    {
      const result = await DELETE3(`DELETE FROM package WHERE id = ${package_id}`);
      if(result)
      {
        res.send({type:"success", message:"package deleted"});
      }
    }
    else
    {
      res.send({type:"error", message:'package not found'});
    }
  }
  catch(error){
    res.status(500).send("Error deleting packages");
  }
});

// ADMIN & USERS___________________________________________
router.get("/getallpackages", async (req, res) => {
  try {
    const response = await QUERY3("SELECT * FROM package");
    res.send(response);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).send("Error fetching packages");
  }
});

// Activate package route with try-catch
router.post("/activatepackage", async (req, res) => {
  try {
    // let { user, id } = req.body;
    const user_id = req.body.user_id;
    const package_id = req.body.package_id;
    const paid_unpaid = req.body.paid_unpaid;

    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(futureDate.getDate() + 30);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const year_2 = futureDate.getFullYear();
    const month_2 = String(futureDate.getMonth() + 1).padStart(2, "0");
    const day_2 = String(futureDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    const formattedDate_2 = `${year_2}-${month_2}-${day_2}`;

    const response = await QUERY(
      `INSERT INTO user_package(package_id, user_id, activated_date, expiration_date) VALUES('${package_id}', '${user_id}', '${formattedDate}', '${formattedDate_2}')`
    );
    if (paid_unpaid === "paid") {
      const response = await QUERY(
        `INSERT INTO user_package(package_id, user_id, activated_date, expiration_date) VALUES('${package_id}', '${user_id}', '${formattedDate}', '${formattedDate_2}')`
      );
      res.send({ type: "success", message: "Package activated successfully" });
    } else {
      res.send({ type: "error", message: "Package not paid" });
    }
  } catch (error) {
    console.error("Error activating package:", error);
    res.status(500).send("Error activating package");
  }
});

router.post("/activatepackageDirectly", async (req, res) => {
  try {
    // let { user_id, package_id } = req.body;
    const user_id = req.body.user_id;
    const package_id = req.body.package_id;
    const paid_unpaid = req.body.paid_unpaid;

    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(futureDate.getDate() + 30);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const year_2 = futureDate.getFullYear();
    const month_2 = String(futureDate.getMonth() + 1).padStart(2, "0");
    const day_2 = String(futureDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    const formattedDate_2 = `${year_2}-${month_2}-${day_2}`;

    if (paid_unpaid === "paid") {
      const response = await QUERY(
        `INSERT INTO user_package(package_id, user_id, activated_date, expiration_date) VALUES('${package_id}', '${user_id}', '${formattedDate}', '${formattedDate_2}')`
      );
      res.send({ type: "success", message: "Package activated successfully" });
    } else {
      res.send({ type: "error", message: "Package not paid" });
    }
  } catch (error) {
    console.error("Error activating package:", error);
    res.status(500).send("Error activating package");
  }
});

router.post("/activate-package", async (req, res) => {
  const user_id = req.body.user_id;
  const package_id = req.body.package_id;

  // Generate current and expiration dates
  const activated_date = new Date();
  const expiration_date = new Date();
  expiration_date.setMonth(activated_date.getMonth() + 1); // Example: 1 month from activation date

  // Insert the package activation directly
  try {
      await QUERY3(`INSERT INTO user_package(user_id, package_id, activated_date, expiration_date) VALUES('${user_id}', '${package_id}', '${activated_date.toISOString()}', '${expiration_date.toISOString()}')`);
      
      const find_package = await SELECT_WHERE3("package", "id", package_id);
      const email = (await SELECT_WHERE("user", "id", user_id))[0].email;

      const package_name = find_package[0].name;
      const package_description = find_package[0].description;
      const package_data = find_package[0].data_limit;
      const package_voice = find_package[0].voice_limit;
      const package_sms = find_package[0].sms_limit;
      const package_price = find_package[0].price;

      await notification(email, package_name, package_description, package_data, package_voice, package_sms, package_price);
      
      res.send({ type: "success", message: "Package activated successfully!" });
  } catch (error) {
      console.error(error);
      res.send({
          type: "error",
          message: "Error occurred while activating package!",
      });
  }
});


router.get("/user-packages", async (req, res) => {
  const user_id = req.query.user_id; // Assuming user_id is passed as a query parameter
  const package_id = req.query.package_id;

  QUERY3(`SELECT up.*, p.* FROM user_package up
         JOIN package p ON up.package_id = p.id
         WHERE up.user_id = '${user_id}' AND up.expiration_date > NOW()`
  )
    .then((result) => 
    {
      res.send({ type: "success", data: result });
      
    })
    .catch((error) => {
      console.error(error);
      res.send({
        type: "error",
        message: "Error occurred while fetching packages!",
      });
    });
});

router.get("/available-packages", async (req, res) => {
  const user_id = req.query.user_id; // Assuming user_id is passed as a query parameter

  QUERY3(
    `SELECT * FROM package 
         WHERE id NOT IN (
           SELECT package_id FROM user_package 
           WHERE user_id = '${user_id}' AND expiration_date > NOW()
         )`
  )
    .then((result) => {
      res.send({ type: "success", data: result });
    })
    .catch((error) => {
      console.error(error);
      res.send({
        type: "error",
        message: "Error occurred while fetching available packages!",
      });
    });
});

router.post("/store-payment", async (req, res) => {
  const { user_id, amount, currency, confirm ,id} = req.body;
  // Get current timestamp and format it to 'YYYY-MM-DD HH:MM:SS'
  const timestamp = new Date().toISOString().slice(0, 19).replace("T", " "); // Convert to SQL datetime format

  QUERY3(
    `INSERT INTO payments ( user_id, amount, currency, confirm, timestamp)
       VALUES ('${user_id}', '${amount}', '${currency}', '${confirm}', '${timestamp}')`
  )
    .then((result) => {
      res.send({
        type: "success",
        message: "Payment record stored successfully!",
      });
    })
    .catch((error) => {
      console.error(error);
      res.send({
        type: "error",
        message: "Error occurred while storing payment record!",
      });
    });
});

module.exports = router;
