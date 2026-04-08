import express, { Request, Response } from "express";
import { requireUser } from "./middlewares/auth";
import * as lostPetService from "../services/lostPetService";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const pets = await lostPetService.getAllLostPets();
    res.json({ pets });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", requireUser(), async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();

    const lostPet = await lostPetService.createLostPet(req.body, userId);

    res.status(201).json({
      message: "Lost pet reported successfully",
      pet: lostPet,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", requireUser(), async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();

    const deleted = await lostPetService.deleteLostPet(
      req.params.id,
      userId
    );

    if (!deleted) {
      return res.status(404).json({ message: "Lost pet not found" });
    }

    res.json({ message: "Lost pet removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;




















// import express, { Request, Response } from "express";
// import { requireUser } from "./middlewares/auth";
// import * as lostPetService from "../services/lostPetService";
// import { sendSMS } from "../services/smsService"; // Import the SMS service
// import User from "../models/User";// Assuming your User model exists

// const router = express.Router();

// // Get all lost pets
// router.get("/", async (req: Request, res: Response) => {
//   try {
//     const pets = await lostPetService.getAllLostPets();
//     res.json({ pets });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Report a lost pet and send SMS to nearby users
// router.post("/", requireUser(), async (req: Request, res: Response) => {
//   try {
//     const userId = req.user!._id.toString();

//     // Create the lost pet report
//     const lostPet = await lostPetService.createLostPet(req.body, userId);

//     // Assuming that the 'location' in the request body contains geospatial data (e.g., { lat: 0, lon: 0 })
//     const location = req.body.location;

//     // Fetch nearby users based on the location (this assumes that you have a method to query users by location)
//     const nearbyUsers = await User.find({
//       location: { $near: location }, // MongoDB geospatial query (assumes location is indexed)
//     });

//     // Prepare the message
//     const message = `A dog is missing! 🐾\n\n` +
//                     `Name: ${lostPet.name}\n` +
//                     `Last Seen: ${lostPet.lastSeenLocation}\n` +
//                     `Contact: ${lostPet.contactPhone}\n` +
//                     `Please help find the dog and contact the owner if you have any information.`;

//     // Send SMS to each nearby user
//     for (let user of nearbyUsers) {
//       await sendSMS(user.phoneNumber, message);
//     }

//     res.status(201).json({
//       message: "Lost pet reported successfully, SMS sent to nearby users.",
//       pet: lostPet,
//     });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Delete a lost pet report
// router.delete("/:id", requireUser(), async (req: Request, res: Response) => {
//   try {
//     const userId = req.user!._id.toString();

//     const deleted = await lostPetService.deleteLostPet(req.params.id, userId);

//     if (!deleted) {
//       return res.status(404).json({ message: "Lost pet not found" });
//     }

//     res.json({ message: "Lost pet removed" });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// });

// export default router;













// import express, { Request, Response } from "express";
// import { requireUser } from "./middlewares/auth";
// import * as lostPetService from "../services/lostPetService";

// const router = express.Router();

// // Report a lost pet
// router.post("/", requireUser(), async (req: Request, res: Response) => {
//   try {
//     const userId = req.user!._id.toString();

//     // Create the lost pet
//     const lostPet = await lostPetService.createLostPet(req.body, userId);

//     // Notify nearby users (using the same function that calculates the distance)
//     await lostPetService.findNearbyUsers(lostPet._id, 5); // 5 km radius (example)

//     res.status(201).json({
//       message: "Lost pet reported successfully, nearby users notified.",
//       pet: lostPet,
//     });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// });

// export default router;