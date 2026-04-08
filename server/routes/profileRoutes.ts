// import express, { Request, Response } from 'express';
// import { requireUser } from './middlewares/auth';
// import * as profileService from '../services/profileService';

// const router = express.Router();

// // // Description: Get user profile
// // // Endpoint: GET /api/profile
// // // Request: {}
// // // Response: { profile: UserProfile }
// // router.get('/', requireUser(), async (req: Request, res: Response) => {
// //   try {
// //     const userId = req.user!._id.toString();
// //     const profile = await profileService.getProfile(userId);
// //     res.status(200).json({ profile });
// //   } catch (error: any) {
// //     console.error(`Error fetching profile: ${error.message}`);
// //     res.status(500).json({ message: error.message || 'Failed to fetch profile' });
// //   }
// // });

// // // Description: Update user profile
// // // Endpoint: PUT /api/profile
// // // Request: { profile: UpdateProfileData }
// // // Response: { profile: UserProfile, message: string }
// // router.put('/', requireUser(), async (req: Request, res: Response) => {
// //   try {
// //     const userId = req.user!._id.toString();
// //     const profileData = req.body;

// //     const profile = await profileService.updateProfile(userId, profileData);

// //     res.status(200).json({ profile, message: 'Profile updated successfully!' });
// //   } catch (error: any) {
// //     console.error(`Error updating profile: ${error.message}`);
// //     res.status(500).json({ message: error.message || 'Failed to update profile' });
// //   }
// // });

// // export default router;

// import express, { Request, Response } from 'express';
// import { requireUser } from './middlewares/auth';
// import * as profileService from '../services/profileService';
// import User from '../models/User';

// const router = express.Router();

// // Description: Get user profile
// router.get('/', requireUser(), async (req: Request, res: Response) => {
//   try {
//     const userId = req.user!._id.toString();
//     const profile = await profileService.getProfile(userId);
//     res.status(200).json({ profile });
//   } catch (error: any) {
//     console.error(`Error fetching profile: ${error.message}`);
//     res.status(500).json({ message: error.message || 'Failed to fetch profile' });
//   }
// });

// // Description: Update user profile (NOW ALSO HANDLES LOCATION)
// router.put('/', requireUser(), async (req: Request, res: Response) => {
//   try {
//     const userId = req.user!._id.toString();
//     const profileData = req.body;

//     // 🔥 NEW: Extract lat/lng if sent
//     const { latitude, longitude } = profileData;

//     // 🔥 Update normal profile fields
//     const profile = await profileService.updateProfile(userId, profileData);

//     // 🔥 NEW: Save geoLocation if coordinates provided
//     if (latitude && longitude) {
//       await User.findByIdAndUpdate(userId, {
//         geoLocation: {
//           type: 'Point',
//           coordinates: [longitude, latitude], // ⚠️ lng, lat
//         },
//       });
//     }

//     res.status(200).json({
//       profile,
//       message: 'Profile updated successfully!',
//     });
//   } catch (error: any) {
//     console.error(`Error updating profile: ${error.message}`);
//     res.status(500).json({ message: error.message || 'Failed to update profile' });
//   }
// });

// export default router;




































// import express, { Request, Response } from 'express';
// import { requireUser } from './middlewares/auth';
// import User from '../models/User';

// const router = express.Router();

// // ==========================
// // GET User Profile
// // ==========================
// router.get('/', requireUser(), async (req: Request, res: Response) => {
//   try {
//     console.log("==== DEBUG: GET /api/profile ====");
//     console.log("Authorization header:", req.headers.authorization);

//     const userId = req.user!._id.toString();
//     const user = await User.findById(userId).lean();

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     console.log("Fetched profile:", user);
//     res.status(200).json({ profile: user });
//   } catch (error: any) {
//     console.error(`Error fetching profile: ${error.message}`);
//     res.status(500).json({ message: error.message || 'Failed to fetch profile' });
//   }
// });

// // ==========================
// // UPDATE User Profile
// // ==========================
// router.put('/', requireUser(), async (req: Request, res: Response) => {
//   try {
//     console.log("==== DEBUG: PUT /api/profile ====");
//     console.log("Authorization header:", req.headers.authorization);
//     console.log("Request body:", req.body);

//     const userId = req.user!._id.toString();
//     const { latitude, longitude, geoLocation, ...otherFields } = req.body;

//     const updateData: any = { ...otherFields };

//     // If geoLocation is sent directly, use it
//     if (geoLocation && Array.isArray(geoLocation.coordinates)) {
//       updateData.geoLocation = {
//         type: 'Point',
//         coordinates: geoLocation.coordinates,
//       };
//     }
//     // Otherwise, use latitude/longitude if provided
//     else if (typeof latitude === 'number' && typeof longitude === 'number') {
//       updateData.geoLocation = {
//         type: 'Point',
//         coordinates: [longitude, latitude],
//       };
//     }

//     console.log("Data to update:", updateData);

//     const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).lean();

//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     console.log("Updated profile:", updatedUser);
//     res.status(200).json({ profile: updatedUser, message: 'Profile updated successfully!' });
//   } catch (error: any) {
//     console.error(`Error updating profile: ${error.message}`);
//     res.status(500).json({ message: error.message || 'Failed to update profile' });
//   }
// });

// export default router;


// // import express, { Request, Response } from 'express';
// // import { requireUser } from './middlewares/auth';  // Assuming this middleware ensures user is authenticated
// // import * as profileService from '../services/profileService';

// // const router = express.Router();

// // // Description: Get user profile
// // // Endpoint: GET /api/profile
// // // Request: {}
// // // Response: { profile: UserProfile }
// // router.get('/', requireUser(), async (req: Request, res: Response) => {
// //   try {
// //     const userId = req.user!._id.toString();
// //     const profile = await profileService.getProfile(userId);
// //     res.status(200).json({ profile });
// //   } catch (error: any) {
// //     console.error(`Error fetching profile: ${error.message}`);
// //     res.status(500).json({ message: error.message || 'Failed to fetch profile' });
// //   }
// // });

// // // Description: Update user profile
// // // Endpoint: PUT /api/profile
// // // Request: { profile: UpdateProfileData }
// // // Response: { profile: UserProfile, message: string }
// // router.put('/', requireUser(), async (req: Request, res: Response) => {
// //   try {
// //     const userId = req.user!._id.toString();
// //     const profileData = req.body;

// //     const profile = await profileService.updateProfile(userId, profileData);

// //     res.status(200).json({ profile, message: 'Profile updated successfully!' });
// //   } catch (error: any) {
// //     console.error(`Error updating profile: ${error.message}`);
// //     res.status(500).json({ message: error.message || 'Failed to update profile' });
// //   }
// // });

// // // **NEW ROUTE FOR UPDATING USER LOCATION**
// // // Description: Update user location (latitude and longitude)
// // // Endpoint: PUT /api/profile/location
// // // Request: { latitude: number, longitude: number }
// // // Response: { message: string, profile: UserProfile }
// // router.put('/location', requireUser(), async (req: Request, res: Response) => {
// //   try {
// //     const userId = req.user!._id.toString();
// //     const { latitude, longitude } = req.body;

// //     if (latitude == null || longitude == null) {
// //       return res.status(400).json({ message: "Latitude and longitude are required." });
// //     }

// //     const updatedProfile = await profileService.updateUserLocation(userId, latitude, longitude);

// //     res.status(200).json({ message: 'Location updated successfully!', profile: updatedProfile });
// //   } catch (error: any) {
// //     console.error(`Error updating location: ${error.message}`);
// //     res.status(500).json({ message: error.message || 'Failed to update location' });
// //   }
// // });

// // export default router;







import express, { Request, Response } from 'express';
import { requireUser } from './middlewares/auth';
import * as profileService from '../services/profileService';
import User from '../models/User';

const router = express.Router();

// Description: Get user profile
router.get('/', requireUser(), async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    const profile = await profileService.getProfile(userId);
    res.status(200).json({ profile });
  } catch (error: any) {
    console.error(`Error fetching profile: ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to fetch profile' });
  }
});

// Description: Update user profile (NOW ALSO HANDLES LOCATION)
router.put('/', requireUser(), async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    const profileData = req.body;

    // Extract latitude and longitude if provided
    const { latitude, longitude } = profileData;

    // Update user profile (name, location, etc.)
    const profile = await profileService.updateProfile(userId, profileData);

    // Save latitude and longitude to the user's profile if provided
    if (latitude !== undefined && longitude !== undefined) {
      await User.findByIdAndUpdate(userId, {
        latitude,    // Update latitude
        longitude,   // Update longitude
      });
    }

    res.status(200).json({
      profile,
      message: 'Profile updated successfully!',
    });
  } catch (error: any) {
    console.error(`Error updating profile: ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to update profile' });
  }
});

export default router;