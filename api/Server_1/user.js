const path = require("path");
const express = require("express");
const router = express.Router();
const app = express();
const {
  INSERT,
  UPDATE,
  SELECT,
  DELETE,
  QUERY,
  SELECT_WHERE,
} = require("../../models/Server_1_DB");
const {
  INSERT3,
  UPDATE3,
  SELECT3,
  DELETE3,
  QUERY3,
  SELECT_WHERE3,
} = require("../../models/Server_3_DB");

const { SendMail } = require("../../include/NodemailerConfig");
const { generateOtp } = require("../../include/OtpGen");
const e = require("express");
const bcrypt = require("bcrypt");
const { error } = require("console");
const { type } = require("os");

router.post("/signinuser", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);
  (async () => {
    try {
      await SELECT_WHERE("user", "email", email).then((response) => {
        if (response.length > 0) {
          bcrypt.compare(
            password,
            response[0].password,
            async (err, result_2) => {
              if (result_2) {
                if (response[0].state != "verified") {
                  const otp = generateOtp(6);
                  QUERY(
                    "UPDATE user SET state='" +
                      otp +
                      "' WHERE email='" +
                      email +
                      "'"
                  ).then((result_3) => {
                    SendMail(otp, email).then((response) => {
                      res.send({
                        type: "warning",
                        message: "Need to verify email first",
                      });
                    });
                  });
                } else {
                  res.send({
                    type: "success",
                    role: response[0].role,
                    id: response[0].id,
                  });
                }
              } else {
                res.send({ type: "error", message: "Incorrect password" });
              }
            }
          );
        } else {
          res.send({ type: "error", message: "Incorrect email address" });
        }
      });
    } catch (error) {
      res.send("success");
      console.error("Error executing query:", error);
    }
  })();
});

router.post("/registeruser", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.send({
        type: "errorN",
        message: "An error occured. Try again later",
      });
    } else {
      QUERY("SELECT * FROM user WHERE email='" + email + "'").then((result) => {
        // console.log(result);
        if (result.length == 0) {
          const otp = generateOtp(6);
          QUERY(
            "INSERT INTO user(email,password,state,role) VALUES('" +
              email +
              "','" +
              hash +
              "','" +
              otp +
              "','" +
              "Customer" +
              "')"
          ).then((result_1) => {
            // console.log(result_1)
            const id = result_1.insertId;
            SendMail(otp, password, email).then((response) => {
              res.send({
                type: "success",
                message: "Account created successfully",
                id: id,
              });
            });
          });
        } else {
          res.send({ type: "error", message: "Account already exists!" });
        }
      });
    }
  });
});

router.post("/verifyuser", (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  SELECT_WHERE("user", "email", email).then((response) => {
    if (response[0].state != "verified" && response[0].state != "notverified") {
      if (response[0].state == otp) {
        QUERY(
          "UPDATE user SET state='verified' WHERE email='" + email + "'"
        ).then((response) => {
          res.send({
            type: "success",
            message: "Account verified successfully",
          });
        });
      } else {
        res.send({ type: "error", message: "Invalid OTP" });
      }
    } else {
      res.send({ type: "error", message: "An error occured" });
    }
  });
});

router.post("/addtobill", async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const package_id = req.body.package_id;
    // const package_name = req.body.package_name;
    // const price = req.body.price;
    const paid_unpaid = "unpaid";

    const data_res = await QUERY3(
      `SELECT * FROM package WHERE id = '${package_id}'`
    );
    const {
      id,
      name,
      description,
      type,
      data_limit,
      voice_limit,
      sms_limit,
      price,
    } = data_res[0];

    const result = await QUERY3(
      "SELECT * FROM user_bill WHERE user_id = '" +
        user_id +
        "' AND package_id = '" +
        package_id +
        "' AND paid_unpaid = 'unpaid'"
    );

    if (result.length === 0 && data_res != null) {
      const dataAdd = await QUERY3(
        "INSERT INTO user_bill(user_id, package_id, package_name, price, paid_unpaid) VALUES('" +
          user_id +
          "','" +
          package_id +
          "','" +
          name +
          "','" +
          price +
          "','" +
          paid_unpaid +
          "')"
      );

      if (dataAdd) {
        res.send({
          type: "success",
          message: "Package added to bill successfully",
        });
      } else {
        res.send({
          type: "error",
          message: "An error occurred while adding to bill. Try again later.",
        });
      }
    } else {
      res.send({
        type: "error",
        message: "Package already added to the bill!",
        data: result,
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send({ type: "error", message: "Internal server error" });
  }
});

router.post("/removeFromBill", async (req, res) => 
{
  try
  {
    const package_id = req.body.package_id;
    const user_id = req.body.user_id;

    const delete_result = await DELETE3(`DELETE FROM user_bill WHERE package_id = '${package_id}' AND user_id = '${user_id}'`);
    if (delete_result.affectedRows > 0) 
    {
      res.send({ type: "success", message: "Package removed from the bill successfully" });
    } else {
      res.status(404).send({ type: "error", message: "Package or user not found in the bill" });
    }

  }
  catch(error)
  {
    console.error("Error processing request:", error);
    res.status(500).send({ type: "error", message: "Internal server error" });
  }
});

router.post("/getTotalPaid", async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const paid_unpaid = "unpaid";

    const result = await QUERY3(
      `SELECT * FROM user_bill WHERE user_id = '${user_id}' AND paid_unpaid = '${paid_unpaid}'`
    );

    if (result.length !== 0) 
    {
      const totalPrice = result.reduce((sum, row) => sum + parseFloat(row.price),0);
      console.log({ Total: totalPrice });
      console.log(result);
      res.send({ result, totalPrice });
    } 
    else 
    {
      res.send({ type: "error", message: "No any packages you added" });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send({ type: "error", message: "Internal server error" });
  }
});

router.post("/getAddedBillDetails", async (req, res) => {
  const user_id = req.body.user_id;
  // const package_id = req.body.package_id;

  const result = await QUERY3(
    "SELECT * FROM user_bill WHERE user_id = '" + user_id + "'"
  );

  if (result.length > 0) {
    res.send({ result });
  } else {
    res.send({ type: "error", message: "data not found" });
  }
});

router.post("/payTotal", async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const paid_unpaid = "unpaid";
    const currency = "LKR";
    const confirm = "success";

    const result = await QUERY3(
      `SELECT * FROM user_bill WHERE user_id = '${user_id}' AND paid_unpaid = '${paid_unpaid}'`
    );

    if (result.length !== 0) {
      const totalPrice = result.reduce(
        (sum, row) => sum + parseFloat(row.price),
        0
      );

      const paymentUpdate = await QUERY3(
        `INSERT INTO payments(user_id, amount, currency, confirm) VALUES('${user_id}', '${totalPrice}', '${currency}', '${confirm}')`
      );

      if (paymentUpdate) {
        const updateUserBill = await QUERY3(
          `UPDATE user_bill SET paid_unpaid = 'paid' WHERE user_id = '${user_id}' AND paid_unpaid = '${paid_unpaid}'`
        );

        if (updateUserBill.affectedRows > 0) {
          res.send({
            result,
            totalPrice,
            message: "Payment successful and user_bill updated to paid",
          });
        } else {
          console.error("Failed to update user_bill. No rows affected.");
          res.send({
            type: "error",
            message:
              "Payment inserted, but user_bill update failed. No matching records found.",
          });
        }
      } else {
        res.send({ type: "error", message: "Payment failed" });
      }
    } else {
      res.send({
        type: "error",
        message: "No unpaid packages found for the user",
      });
    }
  } catch (error) {
    res.send({ type: "error", message: "Internal server error" });
  }
});

router.post("/paymentHistory", async (req, res) => {
  try {
    const user_id = req.body.user_id;
    if (!user_id) {
      return res
        .status(400)
        .send({ type: "error", message: "User ID is required" });
    }

    const result1 = await QUERY(`SELECT * FROM user WHERE id = '${user_id}'`);
    const result2 = await QUERY3(
      `SELECT * FROM payments WHERE user_id = '${user_id}'`
    );
    console.log("Result2 (Payments Query):", result2);

    if (result1.length !== 0 && result2.length !== 0) {
      const userName = result1[0].user_name;
      const userEmail = result1[0].email;

      const history = result2.map((payment) => ({
        amount: payment.amount,
        currency: payment.currency,
        confirms: payment.confirm,
        date: payment.timestap, // Ensure this field is named correctly
      }));

      res.send({ type: "success", userName, userEmail, history });
    } else {
      res.send({ type: "error", message: "No payment history or User found" });
    }
  } catch (error) {
    res.send({ type: "error", message: "Internal server error" });
  }
});

router.get("/getallstaff", (req, res) => {
  QUERY('SELECT * FROM `user` WHERE type="Staff"').then((response) => {
    res.send(response);
  });
});

router.post("/addstaff", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const type = req.body.type;
  const contact_no = req.body.contactNo;
  const password = "Sritel@123";

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.send({ type: "error", message: "An error occured. Try again later" });
    } else {
      QUERY("SELECT * FROM user WHERE email='" + email + "'").then((result) => {
        console.log(result);
        if (result.length == 0) {
          QUERY(
            "INSERT INTO user(name,contact_no,email,password,state,type) VALUES('" +
              name +
              "','" +
              contact_no +
              "','" +
              email +
              "','" +
              hash +
              "','" +
              "verified" +
              "','" +
              type +
              "')"
          ).then((result_1) => {
            SendMail(0, password, email).then((response) => {
              res.send({
                type: "success",
                message: "Account created successfully",
              });
            });
          });
        } else {
          res.send({ type: "error", message: "Account already exists!" });
        }
      });
    }
  });
});



module.exports = router;
