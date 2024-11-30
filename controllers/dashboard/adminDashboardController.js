// import { badRequestResponse, serverErrorResponse, successResponse } from "../../helpers/apiResponsesHelpers.js";
// import usersModel from '../../models/usersModel.js';
// import contactsModel from '../../models/contactsModel.js';
// import jobsModel from '../../models/jobsModel.js';
// import cvMatchersModel from '../../models/cvMatchersModel.js';

// const dashboardStats = async (req, res) => {
//   try {
//     const totalUsers = await usersModel.countDocuments({ role: "user" });
//     const totalJobs = await jobsModel.countDocuments();
//     const totalCvMatchers = await cvMatchersModel.countDocuments();
//     const totalContacts = await contactsModel.countDocuments();
//     const totalQueriesData = await contactsModel.aggregate([
//       { $project: { messageCount: { $size: "$messages" } } },
//       { $group: { _id: null, totalQueries: { $sum: "$messageCount" } } },
//     ]);

//     const totalQueries = totalQueriesData.length > 0 ? totalQueriesData[0].totalQueries : 0;

//     // 6. Fetch total CV Creators records

//     // const totalCvCreators = await CvCreatorsCollection.countDocuments();
//     const totalCvCreators = 10;

//     const stats = {
//       totalUsers,
//       totalJobs,
//       totalCvMatchers,
//       totalContacts,
//       totalQueries,
//       totalCvCreators
//     };

//     return successResponse(res, "Dashboard stats fetched successfully", stats);
//   } catch (error) {
//     console.error("Error Message in Catch BLock:", error.message);
//     return serverErrorResponse(res, "Internal server error. Please try again later.");
//   }
// };

// const getUsersMonthly = async (req, res) => {
//   try {
//     const { month, year } = req.body;

//     if (!month || !year) {
//       return badRequestResponse(res, "Month and Year are required fields.", null);
//     }

//     if (month < 1 || month > 12) {
//       return badRequestResponse(res, "Invalid month value. It should be between 1 and 12.", null);
//     }

//     // Calculate the start and end of the month
//     const startOfMonth = new Date(year, month - 1, 1);
//     const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

//     const usersCreated = await usersModel.countDocuments({
//       role: "user",
//       createdAt: { $gte: startOfMonth, $lte: endOfMonth },
//     });

//     return successResponse(res, `Total users created in ${month}/${year} fetched successfully.`, { usersCreated });
//   } catch (error) {
//     console.error("Error Message in Catch BLock:", error.message);
//     return serverErrorResponse(res, "Internal server error. Please try again later.");
//   }
// };

// export { dashboardStats, getUsersMonthly };
