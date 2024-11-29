import UsersCollection from '../../models/userModel.js';
import JobsCollection from '../../models/JobsModel.js';
import CvMatchersCollection from '../../models/cvMatchersModel.js';
import ContactsUsCollection from '../../models/contactModel.js';
import {
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from "../../helpers/apiResponses.js";

const dashboardStats = async (req, res) => {
  try {
    // 1. Fetch total users with the role "user"
    const totalUsers = await UsersCollection.countDocuments({ role: "user" });

    // 2. Fetch total jobs from the Jobs collection
    const totalJobs = await JobsCollection.countDocuments();

    // 3. Fetch total Cv Matchers from the CvMatchers collection
    const totalCvMatchers = await CvMatchersCollection.countDocuments();

    // 4. Fetch total contact records (total users who contacted)
    const totalContacts = await ContactsUsCollection.countDocuments();

    // 5. Fetch total queries (sum of all messages arrays' lengths in ContactsUsCollection)
    const totalQueriesData = await ContactsUsCollection.aggregate([
      { $project: { messageCount: { $size: "$messages" } } },
      { $group: { _id: null, totalQueries: { $sum: "$messageCount" } } },
    ]);

    const totalQueries =
      totalQueriesData.length > 0 ? totalQueriesData[0].totalQueries : 0;

    // 6. Fetch total CV Creators records

    // const totalCvCreators = await CvCreatorsCollection.countDocuments();
    const totalCvCreators = 10;

    const stats = {
      totalUsers,
      totalJobs,
      totalCvMatchers,
      totalContacts,
      totalQueries,
      totalCvCreators
    };

    return successResponse(res, "Dashboard stats fetched successfully", stats);
  } catch (error) {
    console.error("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(res, "Internal server error. Please try again later.");
  }
};

const getUsersMonthly = async (req, res) => {
  try {
    const { month, year } = req.body;

    if (!month || !year) {
      return badRequestResponse(res, "Month and Year are required fields.", null);
    }

    if (month < 1 || month > 12) {
      return badRequestResponse(res, "Invalid month value. It should be between 1 and 12.", null);
    }

    // Calculate the start and end of the month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const usersCreated = await UsersCollection.countDocuments({
      role: "user",
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    return successResponse(res, `Total users created in ${month}/${year} fetched successfully.`, { usersCreated });
  } catch (error) {
    console.error("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(res, "Internal server error. Please try again later.");
  }
};

export { dashboardStats, getUsersMonthly };
