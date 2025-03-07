import { enrollmentDataBase } from "../database/index.js";
import { userDataBase } from "./accountController.js";

// Function to perform a search query for enrollments
function querySearch(req, res) {
  const activityIdQuery = req.query.activity_id;

  // Search for participants in a specific activity (admin-only)
  if (activityIdQuery) {
    enrollmentDataBase.readAllData((err, dataEnrollment) => {
      if (err) {
        return res.status(500).json({ error: "Erro interno no servidor" });
      }

      const participantsId = [];

      // Find all users enrolled in the specified activity
      dataEnrollment.forEach((enrollment) => {
        if (activityIdQuery == enrollment.value.activity_id) {
          participantsId.push(enrollment.value.user);
        }
      });

      if (participantsId.length == 0) {
        return res
          .status(400)
          .json({ error: "Não tem participantes nessa atividade" });
      }

      // Fetch all users from the database
      userDataBase.readAllData((err, dataUser) => {
        if (err) {
          return res.status(500).json({ error: "Erro interno no servidor" });
        }

        // Map participant IDs to user details
        const participants = participantsId.map((id) => {
          const index = dataUser.findIndex((element) => {
            return element.key == id;
          });
          const participant = {
            key: id,
            value: {
              email: dataUser[index].value.email,
              name: dataUser[index].value.name,
            },
          };
          return participant;
        });
        return res.status(200).json(participants);
      });
    });
    return;
  }

  res.status(400).json({ error: "Pesquisa não é valida" });
}

export { querySearch };
