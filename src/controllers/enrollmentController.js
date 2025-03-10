import { enrollmentDataBase } from "../database/index.js";
import { userDataBase } from "./accountController.js";
import { activityDataBase } from "./activityController.js";

import { v6 as uuidv6 } from "uuid";

// Function to unenroll a user from an activity
function unenrollActivity(req, res) {
  const userId = req.user.id;
  const activityId = req.body.activity_id;

  if (!userId || !activityId) {
    res.status(400).json({ error: "Coloque todos os campos" });
  }

  // Fetch the activity from the database
  try {
    activityDataBase.get(activityId, (err, activityData) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "A atividade não foi encontrada" });
      }

      const now = new Date();

      const activityDate = new Date(JSON.parse(activityData).date);

      if (activityDate.getTime() < now.getTime()) {
        return res.status(400).json({ error: "A atividade já foi realizada" });
      }

      // Fetch the user from the database
      userDataBase.get(userId, (err, userData) => {
        if (err) {
          return res
            .status(400)
            .json({ error: "O usuario não foi encontrado" });
        }

        enrollmentDataBase.readAllData((err, data) => {
          if (err) {
            return res.status(500).json({ error: "Erro interno no servidor" });
          }

          const currentActivity = data.filter(
            (element) => element.value.activity_id == activityId
          );
          if (currentActivity.length == 0) {
            return res
              .status(400)
              .json({ error: "O usuário não está na atividade" });
          }

          const indexActivity = currentActivity.findIndex((activity) => {
            return activity.value.user == userId;
          });

          // If the user is not enrolled, return an error
          if (indexActivity == -1) {
            return res
              .status(400)
              .json({ error: "O usuário não está na atividade" });
          }

          // Delete the enrollment record
          enrollmentDataBase.del(currentActivity[indexActivity].key, (err) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "Erro interno no servidor" });
            }
            return res
              .status(201)
              .json({ success: "A desinscrição foi um sucesso" });
          });
        });
      });
    });
  } catch (error) {
    console.error(error.message);
  }
}

// Function to enroll a user in an activity
function enrollActivity(req, res) {
  const userId = req.user.id;
  const activityId = req.body.activity_id;

  const now = new Date();

  if (!userId || !activityId) {
    res.status(400).json({ error: "Coloque todos os campos" });
  }

  // Fetch the activity from the database
  try {
    activityDataBase.get(activityId, (err, activityData) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "A atividade não foi encontrada" });
      }

      const now = new Date();

      const activityDate = new Date(JSON.parse(activityData).date);

      if (activityDate.getTime() < now.getTime()) {
        return res.status(400).json({ error: "A atividade já foi realizada" });
      }

      const participantsMaximum = JSON.parse(activityData).participants_maximum;

      // Fetch the user from the database
      userDataBase.get(userId, (err, userData) => {
        if (err) {
          return res
            .status(400)
            .json({ error: "O usuário não foi encontrado" });
        }

        // Fetch all enrollments from the database
        enrollmentDataBase.readAllData((err, data) => {
          if (err) {
            return res.status(500).json({ error: "Erro interno no servidor" });
          }

          const currentActivity = data.filter(
            (element) => element.value.activity_id == activityId
          );

          if (currentActivity.length >= participantsMaximum) {
            return res
              .status(400)
              .json({ error: "A atividade não tem vagas disponíveis" });
          }

          if (
            currentActivity.find((activity) => activity.value.user == userId)
          ) {
            return res
              .status(400)
              .json({ error: "O usuário já está na atividade" });
          }

          const id = uuidv6();

          // Create the enrollment record
          enrollmentDataBase.put(
            id,
            JSON.stringify({ activity_id: activityId, user: userId }),
            (err) => {
              if (err) {
                return res
                  .status(500)
                  .json({ error: "Erro interno no servidor" });
              }
              return res
                .status(201)
                .json({ success: "A inscrição foi um sucesso" });
            }
          );
        });
      });
    });
  } catch (error) {
    console.log(error.message);
  }
}

// Function to perform a search query for enrollments
function querySearch(req, res) {
  const userId = req.user.id;
  const userAdmin = req.user.admin;
  const userIdQuery = req.query.user_id;
  const activityIdQuery = req.query.activity_id;

  // Search for activities a specific user is enrolled in
  if (userIdQuery == userId || (userAdmin && userIdQuery)) {
    activityDataBase.readAllData((err, dataActivity) => {
      if (err) {
        return res.status(500).json({ error: "Erro interno no servidor" });
      }
      if (dataActivity.length == 0) {
        return res.status(400).json({ error: "Não tem atividades" });
      }
      enrollmentDataBase.readAllData((err, dataEnrollment) => {
        if (err) {
          return res.status(500).json({ error: "Erro interno no servidor" });
        }
        const alreadyEnrolled = [];

        const enrolledActivities = [];

        const now = new Date();

        // Process enrollments to find activities the user is enrolled in
        dataEnrollment.forEach((enrollment) => {
          const activityId = enrollment.value.activity_id;
          if (enrollment.value.user == userIdQuery) {
            alreadyEnrolled.push(activityId);
          }
        });

        // Filter activities the user is enrolled in and that are still upcoming
        dataActivity.forEach((activity) => {
          const activityDate = new Date(activity.value.date);
          if (
            alreadyEnrolled.indexOf(activity.key) != -1 &&
            now.getTime() < activityDate.getTime()
          ) {
            enrolledActivities.push(activity);
          }
        });
        res.status(200).json(enrolledActivities);
      });
    });
    return;
  }

  res.status(400).json({ error: "Pesquisa não é valida" });
}

export { enrollmentDataBase, unenrollActivity, enrollActivity, querySearch };
