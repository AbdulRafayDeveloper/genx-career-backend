import { badRequestResponse, serverErrorResponse, successResponse } from "../../helpers/apiResponsesHelpers.js";
import usersModel from '../../models/usersModel.js';
import contactsModel from '../../models/contactsModel.js';
import jobsModel from '../../models/jobListingsModel.js';
import cvMatchersModel from '../../models/cvMatchersModel.js';
import cvTemplates from '../../models/cvTemplates.js';
import cvCreators from '../../models/cvCreatorsModel.js';

const dashboardStats = async (req, res) => {
  try {
    const totalUsers = await usersModel.countDocuments({ role: "user" });
    const totalJobs = await jobsModel.countDocuments();
    const totalCvMatchers = await cvMatchersModel.countDocuments();
    const totalContacts = await contactsModel.countDocuments();
    const totalCvTemplates = await cvTemplates.countDocuments();
    const totalCvCreators = await cvCreators.countDocuments();

    const stats = {
      totalJobs,
      totalUsers,
      totalQueries: totalContacts,
      totalCvMatchers,
      totalCvCreators,
      totalCvTemplates: totalCvTemplates,
    };

    return successResponse(res, "Dashboard stats fetched successfully", stats);
  } catch (error) {
    console.log("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(res, "Internal server error. Please try again later.");
  }
};

const getUsersMonthly = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${currentYear + 1}-01-01T00:00:00.000Z`);

    const result = await usersModel.aggregate([
      {
        $match: {
          role: "user",
          createdAt: {
            $gte: startOfYear,
            $lt: endOfYear,
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          usersCreated: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          usersCreated: 1,
        },
      },
    ]);

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const found = result.find((r) => r.month === i + 1);
      return {
        monthNumber: i + 1,
        monthName: monthNames[i],
        usersCreated: found ? found.usersCreated : 0,
      };
    });

    return successResponse(res, `Monthly user data for year ${currentYear} fetched successfully.`, {
      year: currentYear,
      monthlyData,
    });
  } catch (error) {
    console.log("Error Message in Catch Block:", error.message);
    return serverErrorResponse(res, "Internal server error. Please try again later.");
  }
};



export { dashboardStats, getUsersMonthly };
