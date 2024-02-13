const express = require("express");
const collection = require("./mongo");
const cors = require("cors");
const app = express();
const Shipment = require("./Shipment");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Office = require("./Office");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/////////////////////////////////////////////
//Login and Signup stuff
/////////////////////////////////////////////

// Function to generate JWT token
function generateToken(email) {
  return jwt.sign({ email }, "your_secret_key", { expiresIn: "1h" }); // Change "your_secret_key" to your actual secret key
}

const todoSchema = new mongoose.Schema({
  text: String,
  createdBy: String,
  done: Boolean,
});

const Todo = mongoose.model("Todo", todoSchema);

app.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await collection.findOne({ email });

    if (user) {
      // Check if the password matches
      if (user.password === password) {
        // Generate JWT token
        const token = generateToken(email);
        // Send token as response
        res.json({ token });
      } else {
        // If password doesn't match, send a response indicating incorrect password
        res.status(401).json({ error: "Incorrect password" });
      }
    } else {
      // If user is not found, send a response indicating user does not exist
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    // If an error occurs during the process, send a generic error response
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.post("/signup", async (req, res) => {
  const { email, password, role, userName } = req.body;

  const data = {
    email: email,
    password: password,
    role: role,
    userName: userName,
  };

  try {
    const check = await collection.findOne({ email: email });

    if (check) {
      res.json("exist");
    } else {
      await collection.create(data);
      res.json("notexist");
    }
  } catch (e) {
    res.json("fail");
  }
});

app.get("/userRole", async (req, res) => {
  const { email } = req.query;

  try {
    const user = await collection.findOne({ email });

    if (user) {
      res.json({ role: user.role });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/users", async (req, res) => {
  const { role } = req.query;

  try {
    const users = await collection.find({ role });

    if (users) {
      res.json(users);
    } else {
      res.status(404).json({ error: "No client users found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/////////////////////////////////////////////
//Is responsible for sending the package
/////////////////////////////////////////////

app.post("/sendPackage", async (req, res) => {
  const { senderName, senderEmail, receiverEmail, packageDescription, weight } = req.body;

  try {
    // Create a new shipment with the provided data
    const newShipment = new Shipment({
      senderName,
      senderEmail,
      receiverEmail,
      packageDescription,
      weight,
      status: "Pending" // Set the status to "Pending" for new shipments
    });

    // Save the new shipment to the database
    await newShipment.save();

    // Find the user who made the order
    const user = await collection.findOne({ email: senderEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add the new shipment to the user's shipments
    user.shipments.push(newShipment._id);
    await user.save();

    res.json({ message: "Package sent successfully", shipment: newShipment });
  } catch (error) {
    console.error("Error sending package:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/shipments/:id", async (req, res) => {
  const { action } = req.body;
  const shipmentId = req.params.id;

  try {
    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    if (action === "update") {
      // Handle shipment update logic
    } else if (action === "markAsShipped") {
      // Handle marking shipment as shipped logic
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }
  } catch (error) {
    console.error("Error updating shipment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/////////////////////////////////////////////
//Makes the server retrieve all shipments from the database and sends them as a json
//response This allows clients to fetch the list of shipments stored in the database.
/////////////////////////////////////////////

app.get("/shipments", async (req, res) => {
  try {
    const shipments = await Shipment.find();
    res.json(shipments);
  } catch (error) {
    console.error("Error fetching shipments", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/////////////////////////////////////////////
//Retrieve Orders Placed by Current User
/////////////////////////////////////////////

// Assuming you have a route to fetch shipments for the current user
app.get("/userShipments", async (req, res) => {
  const { userId } = req.query; // Assuming the user's ID is provided as a query parameter

  try {
    // Find all shipments where the sender's ID matches the current user's ID
    const shipments = await Shipment.find({ sender: userId });

    res.json(shipments); // Send the filtered shipments as a JSON response
  } catch (error) {
    console.error("Error fetching user shipments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



/////////////////////////////////////////////
//Responsible for deleting shipments
/////////////////////////////////////////////

app.delete("/shipments/:id", async (req, res) => {
  const shipmentId = req.params.id;

  try {
    // Find the shipment by ID and delete it
    const deletedShipment = await Shipment.findByIdAndDelete(shipmentId);

    if (!deletedShipment) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    // Remove references to the deleted shipment from the user collection
    await collection.updateMany(
      { shipments: shipmentId },
      { $pull: { shipments: shipmentId } }
    );

    res.json({ message: "Shipment deleted successfully" });
  } catch (error) {
    console.error("Error deleting shipment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/////////////////////////////////////////////
//Update Employee Account Settings (Part of task 3)
/////////////////////////////////////////////

// Route handler to update user data
app.post("/updateUser", async (req, res) => {
  const { email, newPassword, newUserName, newEmail } = req.body;

  try {
    // Find the user by email
    const user = await collection.findOne({ email });

    if (user) {
      // Update user's password if provided
      if (newPassword !== undefined) {
        user.password = newPassword;
      }

      // Update user's username if provided
      if (newUserName !== undefined) {
        user.userName = newUserName;
      }

      // Update user's email if provided
      if (newEmail !== undefined) {
        user.email = newEmail;
      }

      // Save the updated user to the database
      await user.save();

      res.json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/////////////////////////////////////////////
//Delete Employee Account (Part of task 3)
/////////////////////////////////////////////

app.delete("/users/:email", async (req, res) => {
  const currentUserEmail = req.params.email; // Assuming the email of the currently logged-in user is passed as a parameter

  try {
    // Use Mongoose to find and delete the user by email
    const deletedUser = await collection.findOneAndDelete({ email: currentUserEmail });

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/////////////////////////////////////////////
//Update Client Account (Part of task 3)
/////////////////////////////////////////////

// Update client account
app.post("/updateClient", async (req, res) => {
  const { email, newEmail, newPassword, newUserName } = req.body;

  try {
    // Find the client by email
    const client = await collection.findOne({ email });

    if (client) {
      // Update client's email if provided
      if (newEmail !== undefined) {
        client.email = newEmail;
      }

      // Update client's password if provided
      if (newPassword !== undefined) {
        client.password = newPassword;
      }

      // Update client's username if provided
      if (newUserName !== undefined) {
        client.userName = newUserName;
      }

      // Save the updated client to the database
      await client.save();

      res.json({ message: "Client updated successfully", client });
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/////////////////////////////////////////////
//Delete Client Account (Part of task 3)
/////////////////////////////////////////////

app.delete("/clients/:email", async (req, res) => {
  const userEmail = req.params.email;

  try {
    // Use Mongoose to find and delete the client by email
    const deletedUser = await collection.findOneAndDelete({ email: userEmail });

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/////////////////////////////////////////////
//To do list stuff
/////////////////////////////////////////////

app.post("/todos", async (req, res) => {
  const { text, createdBy, done } = req.body;

  try {
    // Използвайте create, за да създадете нов Todo в базата данни
    const newTodo = await Todo.create({
      text,
      createdBy,
      done,
    });

    res.json(newTodo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/todos", async (req, res) => {
  try {
    // Използвайте find, за да вземете всички todos от базата данни
    const todos = await Todo.find();

    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/todos/:id", async (req, res) => {
  const todoId = req.params.id;

  try {
    // Използвайте findByIdAndDelete, за да изтриете Todo от базата данни
    const deletedTodo = await Todo.findByIdAndDelete(todoId);

    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/////////////////////////////////////////////
//Add Office (part of task 3)
/////////////////////////////////////////////

// Get all offices
app.get("/offices", async (req, res) => {
  try {
    const offices = await Office.find();
    res.json(offices);
  } catch (error) {
    console.error("Error fetching offices:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new office
app.post("/addOffice", async (req, res) => {
  const officeInfo = req.body;

  try {
    const newOffice = new Office(officeInfo);
    await newOffice.save();

    res.status(201).json({ message: "Office added successfully", office: newOffice });
  } catch (error) {
    console.error("Error adding office:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/////////////////////////////////////////////
//Update Office (part of task 3)
/////////////////////////////////////////////

// Update an office
app.put("/offices/:id", async (req, res) => {
  const { id } = req.params;
  const updatedOfficeInfo = req.body;

  try {
    const updatedOffice = await Office.findByIdAndUpdate(id, updatedOfficeInfo, { new: true });

    if (!updatedOffice) {
      return res.status(404).json({ error: "Office not found" });
    }

    res.json({ message: "Office updated successfully", office: updatedOffice });
  } catch (error) {
    console.error("Error updating office:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/////////////////////////////////////////////
//Delete Office (part of task 3)
/////////////////////////////////////////////

// Delete an office
app.delete("/offices/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOffice = await Office.findByIdAndDelete(id);

    if (!deletedOffice) {
      return res.status(404).json({ error: "Office not found" });
    }

    res.json({ message: "Office deleted successfully" });
  } catch (error) {
    console.error("Error deleting office:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/////////////////////////////////////////////
//Employee Shipment Stuff- Marks shipments as shipped when you press the "Shipped" button
//and disables further editing
/////////////////////////////////////////////

app.post("/shipments/:id/markAsShipped", async (req, res) => {
  const shipmentId = req.params.id;

  try {
    // Find the shipment by ID
    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    // Update the shipment status to indicate it's shipped
    shipment.isShipped = true;

    // Save the updated shipment to the database
    await shipment.save();

    res.json({ message: "Shipment marked as shipped", shipment });
  } catch (error) {
    console.error("Error marking shipment as shipped:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/////////////////////////////////////////////
//Employee Shipment- defining what the "Update" button does
/////////////////////////////////////////////

// Update an office
app.put("/shipments/:id/updateShipment", async (req, res) => {
  const shipmentId = req.params.id;

  try {
    // Find the shipment by ID
    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    // Destructure the updated shipment properties from the request body
    const { senderEmail, receiverEmail, packageDescription, weight, status } = req.body;

    // Update the shipment properties if provided
    if (senderEmail !== undefined) {
      shipment.senderEmail = senderEmail;
    }
    if (receiverEmail !== undefined) {
      shipment.receiverEmail = receiverEmail;
    }
    if (packageDescription !== undefined) {
      shipment.packageDescription = packageDescription;
    }
    if (weight !== undefined) {
      shipment.weight = weight;
    }
    if (status !== undefined) {
      shipment.status = status;
    }

    // Save the updated shipment to the database
    await shipment.save();

    res.json({ message: "Shipment updated successfully", shipment });
  } catch (error) {
    console.error("Error updating shipment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/////////////////////////////////////////////
//Type in email to see all of the shipments connected to it
/////////////////////////////////////////////

// Define a new route to fetch shipments by user email
app.get("/shipmentsByUserEmail", async (req, res) => {
  const { email } = req.query; // Get the email from the query parameters

  try {
    // Find all shipments where the sender's email or receiver's email matches the inputted email
    const shipments = await Shipment.find({
      $or: [{ senderEmail: email }, { receiverEmail: email }],
    });

    res.json(shipments); // Send the filtered shipments as a JSON response
  } catch (error) {
    console.error("Error fetching shipments by user email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
