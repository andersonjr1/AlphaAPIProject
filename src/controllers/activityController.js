import {
  activityDataBase,
  userDataBase,
  enrollmentDataBase,
} from "../database/index.js";
import { v6 as uuidv6 } from "uuid";

import {
  isValidName,
  isValidDescription,
  isValidPlace,
  isValidDate,
  isValidParticipants,
} from "../utils/validate.js";

// Function to list available activities for a user
function listAvailableActivities(req, res) {
  const userId = req.user.id;

  if (req.query.available == "true") {
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

        const activitiesWithEnrollment = {};

        const availableActivities = [];

        const alreadyEnrolled = [];

        const now = new Date();

        // Process enrollments to count participants and track user enrollments
        dataEnrollment.forEach((enrollment) => {
          const activityId = enrollment.value.activity_id;
          if (enrollment.value.user == userId) {
            alreadyEnrolled.push(activityId);
          }
          if (!activitiesWithEnrollment[activityId]) {
            return (activitiesWithEnrollment[activityId] = 1);
          }
          activitiesWithEnrollment[activityId]++;
        });
        // Filter and prepare available activities
        dataActivity.forEach((activity) => {
          const activityDate = new Date(activity.value.date);
          if (
            alreadyEnrolled.indexOf(activity.key) != -1 ||
            now.getTime() > activityDate.getTime()
          ) {
            return;
          }
          if (!activitiesWithEnrollment[activity.key]) {
            activity.value.current_participants = 0;
            availableActivities.push(activity);
            return;
          }
          activity.value.current_participants =
            activitiesWithEnrollment[activity.key];
          availableActivities.push(activity);
        });
        res.status(200).json(availableActivities);
      });
    });
    return;
  }

  res.status(400).json({ error: "Pesquisa não é valida" });
}

// Function to fetch and return all activities
function visualizeAllActivities(req, res) {
  activityDataBase.readAllData((err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
    res.status(200).json(data);
  });
}

// Function to add a new activity
function addActivity(req, res) {
  const title = req.body.title.trim();
  const description = req.body.description.trim();
  let date = req.body.data.trim();
  let place = req.body.place.trim();
  let participantsMaximum = req.body.participants.trim();

  if (!title || !date || !place || !participantsMaximum) {
    return res.status(400).json({ error: "Coloque todos os dados" });
  }

  participantsMaximum = parseInt(participantsMaximum);

  if (!isValidDate(date)) {
    return res.status(400).json({ error: "Data não é valida" });
  }

  if (!isValidName(title)) {
    return res.status(400).json({ error: "Título não é valido" });
  }

  if (!isValidDescription(description)) {
    return res.status(400).json({ error: "Descrição não é válida" });
  }

  if (!isValidParticipants(participantsMaximum)) {
    return res
      .status(400)
      .json({ error: "Máximo de participantes não é valido" });
  }

  if (!isValidPlace(place)) {
    return res.status(400).json({ error: "Local não é valido" });
  }

  date = new Date(date);

  const activity = {
    title,
    description,
    date,
    place,
    participants_maximum: participantsMaximum,
  };

  const id = uuidv6();

  // Save the activity to the database
  activityDataBase.put(id, JSON.stringify(activity), (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
    res.status(201).json({ success: "A atividade foi criada com sucesso" });
  });
}

// Function to delete an activity
function deleteActivity(req, res) {
  const id = req.params.id;
  activityDataBase.get(id, (err) => {
    if (err) {
      return res.status(400).json({ error: "A atividade não foi encontrada" });
    }

    // Delete the activity from the database
    activityDataBase.del(id, (err) => {
      if (err) {
        return res.status(500).json({ error: "Erro interno no servidor" });
      }

      res.status(200).json({ success: "Atividade foi deletada" });
    });
  });
}

// Function to edit an existing activity
function editActivity(req, res) {
  const id = req.params.id;
  const title = req.body.title.trim();
  const description = req.body.description.trim();
  let date = req.body.data.trim();
  let place = req.body.place.trim();
  let participantsMaximum = req.body.participants.trim();

  if (!title && !date && !place && !participantsMaximum && !description) {
    return res.status(400).json({ error: "Coloque pelo menos um campo" });
  }

  // Fetch the existing activity from the database
  activityDataBase.get(id, (err, data) => {
    if (err) {
      return res.status(400).json({ error: "A atividade não foi encontrada" });
    }

    const activity = JSON.parse(data);

    if (title) {
      if (!isValidName(title)) {
        return res.status(400).json({ error: "Título não é valido" });
      }
      activity.title = title;
    }

    if (description) {
      if (!isValidDescription(description)) {
        return res.status(400).json({ error: "Descrição não é válida" });
      }
      activity.description = description;
    }

    if (date) {
      if (!isValidDate(date)) {
        return res.status(400).json({ error: "Data não é valida" });
      }
      date = new Date(date);
      activity.date = date;
    }

    if (place) {
      if (!isValidPlace(place)) {
        return res.status(400).json({ error: "Local não é valido" });
      }
      activity.place = place;
    }

    if (participantsMaximum) {
      participantsMaximum = parseInt(participantsMaximum);
      if (!isValidParticipants(participantsMaximum)) {
        return res
          .status(400)
          .json({ error: "Máximo de participantes não é valido" });
      }
      activity.participants_maximum = participantsMaximum;
    }

    // Save the updated activity to the database
    activityDataBase.put(id, JSON.stringify(activity), (err) => {
      if (err) {
        return res.status(500).json({ error: "Erro interno no servidor" });
      }
      res.status(200).json({ success: "Atividade foi editada" });
    });
  });
}

export {
  visualizeAllActivities,
  addActivity,
  deleteActivity,
  editActivity,
  listAvailableActivities,
  activityDataBase,
};
