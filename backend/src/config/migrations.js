const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./database");

async function handleDuplicateEnrollments() {
  const transaction = await sequelize.transaction();

  try {
    // First, identify duplicate enrollments
    const [duplicates] = await sequelize.query(
      `
      SELECT client_id, program_id, array_agg(enrollment_id ORDER BY enrollment_date DESC) as enrollment_ids
      FROM enrollment
      GROUP BY client_id, program_id
      HAVING COUNT(*) > 1
    `,
      { transaction }
    );

    // Delete duplicate enrollments, keeping only the most recent one
    for (const dup of duplicates) {
      const [mostRecent, ...oldEnrollments] = dup.enrollment_ids;
      if (oldEnrollments.length > 0) {
        await sequelize.query(
          `
          DELETE FROM enrollment 
          WHERE enrollment_id = ANY($1)
        `,
          {
            bind: [oldEnrollments],
            transaction,
          }
        );
      }
    }

    await transaction.commit();
    console.log("Successfully handled duplicate enrollments");
    return true;
  } catch (error) {
    await transaction.rollback();
    console.error("Migration failed:", error);
    return false;
  }
}

module.exports = {
  handleDuplicateEnrollments,
};
