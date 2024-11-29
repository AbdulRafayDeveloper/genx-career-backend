const getDateFilter = (datePosted) => {
    try {
        const currentDate = new Date();
        let filterDate;

        switch (datePosted) {
            case 'last_day':
                filterDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
                break;
            case 'last_3_days':
                filterDate = new Date(currentDate.setDate(currentDate.getDate() - 3));
                break;
            case 'last_week':
                filterDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
                break;
            case 'last_2_weeks':
                filterDate = new Date(currentDate.setDate(currentDate.getDate() - 14));
                break;
            case 'last_month':
                filterDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
                break;
            default:
                filterDate = new Date(0); // Anytime (no filter)
                break;
        }

        return filterDate;
    } catch (error) {
        console.error("Error in Catch Block:", error.message);
        return { status: 500, message: "Internal server error. Please try again later" };
    }
};

export { getDateFilter };
