// const getDateFilter = (datePosted) => {
//     try {
//         const currentDate = new Date();
//         let filterDate;

//         switch (datePosted) {
//             case 'last_day':
//                 filterDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
//                 break;
//             case 'last_3_days':
//                 filterDate = new Date(currentDate.setDate(currentDate.getDate() - 3));
//                 break;
//             case 'last_week':
//                 filterDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
//                 break;
//             case 'last_2_weeks':
//                 filterDate = new Date(currentDate.setDate(currentDate.getDate() - 14));
//                 break;
//             case 'last_month':
//                 filterDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
//                 break;
//             default:
//                 filterDate = new Date(0); // Anytime (no filter)
//                 break;
//         }

//         return filterDate;
//     } catch (error) {
//         console.error("Error in Catch Block:", error.message);
//         return { status: 500, message: "Internal server error. Please try again later" };
//     }
// };

// export { getDateFilter };

// helpers/getDateFilter.js
const getDateFilter = (datePosted) => {
    try {
        // Define keywords that indicate relative date filters
        const keywords = ['last_day', 'last_3_days', 'last_week', 'last_2_weeks', 'last_month'];
        let filterDate;
        const currentDate = new Date();

        // If the input matches one of our keywords, compute the relative date.
        if (keywords.includes(datePosted)) {
            switch (datePosted) {
                case 'last_day':
                    filterDate = new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000);
                    break;
                case 'last_3_days':
                    filterDate = new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000);
                    break;
                case 'last_week':
                    filterDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'last_2_weeks':
                    filterDate = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
                    break;
                case 'last_month':
                    filterDate = new Date(currentDate);
                    filterDate.setMonth(filterDate.getMonth() - 1);
                    break;
                default:
                    filterDate = null;
                    break;
            }
        } else {
            // Otherwise, assume the datePosted is a date string from the frontend.
            const parsedDate = new Date(datePosted);
            if (!isNaN(parsedDate.getTime())) {
                filterDate = parsedDate;
            } else {
                // If the string is invalid, return null (no filter will be applied).
                filterDate = null;
            }
        }
        return filterDate;
    } catch (error) {
        console.error("Error in getDateFilter:", error.message);
        return null;
    }
};

export { getDateFilter };
