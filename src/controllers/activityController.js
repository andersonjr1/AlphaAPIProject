import {
  activityDataBase,
  userDataBase,
  enrollmentDataBase,
} from "../database/index.js";
import { v6 as uuidv6 } from "uuid";

function visualizeParticipantsOfActivity(req, res) {
  const activityId = req.params.id;

  enrollmentDataBase.readAllData((err, dataEnrollment) => {
    if (err) {
      return res.status(500).json("Internal Error");
    }

    const participantsId = [];

    dataEnrollment.forEach((enrollment) => {
      if (activityId == enrollment.value.activity_id) {
        participantsId.push(enrollment.value.user);
      }
    });

    if (participantsId.length == 0) {
      return res
        .status(400)
        .json({ error: "There are no participants in this activity" });
    }

    userDataBase.readAllData((err, dataUser) => {
      if (err) {
        return res.status(500).json("Internal Error");
      }
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
      return res.status(400).json(participants);
    });
  });
}

function listAvailableActivities(req, res) {
  const userId = req.user.id;
  const userAdmin = req.user.admin;
  const userIdQuery = req.query.user_id;

  if (req.query.available == "true") {
    activityDataBase.readAllData((err, dataActivity) => {
      if (err) {
        return res.status(500).json("Internal Error");
      }
      if (dataActivity.length == 0) {
        return res.status(400).json({ error: "There are no activities" });
      }
      enrollmentDataBase.readAllData((err, dataEnrollment) => {
        if (err) {
          return res.status(500).json("Internal Error");
        }

        const activitiesWithEnrollment = {};

        const availableActivities = [];

        const alreadyEnrolled = [];

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
        dataActivity.forEach((activity) => {
          if (alreadyEnrolled.indexOf(activity.key) != -1) {
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
  }

  if (userIdQuery == userId || (userAdmin && userIdQuery)) {
    activityDataBase.readAllData((err, dataActivity) => {
      if (err) {
        return res.status(500).json("Internal Error");
      }
      if (dataActivity.length == 0) {
        return res.status(400).json({ error: "There are no activities" });
      }
      enrollmentDataBase.readAllData((err, dataEnrollment) => {
        if (err) {
          return res.status(500).json("Internal Error");
        }
        const alreadyEnrolled = [];

        const enrolledActivities = [];

        dataEnrollment.forEach((enrollment) => {
          const activityId = enrollment.value.activity_id;
          if (enrollment.value.user == userIdQuery) {
            alreadyEnrolled.push(activityId);
          }
        });
        dataActivity.forEach((activity) => {
          if (alreadyEnrolled.indexOf(activity.key) != -1) {
            enrolledActivities.push(activity);
          }
        });
        res.status(200).json(enrolledActivities);
      });
    });
  }
}

function visualizeAllActivities(req, res) {
  activityDataBase.readAllData((err, data) => {
    if (err) {
      return res.status(500).json({ error: "Internal Error" });
    }
    res.status(200).json(data);
  });
}

function addActivity(req, res) {
  const title = req.body.title.trim();
  const description = req.body.description.trim();
  let date = req.body.data.trim();
  let place = req.body.place.trim();
  let participantsMaximum = req.body.participants.trim();

  if (!title || !date || !place || !participantsMaximum) {
    return res.status(400).json({ error: "Please enter all data" });
  }

  date = new Date(date);
  participantsMaximum = Number(participantsMaximum);

  const activity = {
    title,
    description,
    date,
    place,
    participants_maximum: participantsMaximum,
  };

  const id = uuidv6();

  activityDataBase.put(id, JSON.stringify(activity), (err) => {
    if (err) {
      return res.status(500).json({ error: "Internal Error" });
    }
    res.status(200).json(activity);
  });
}

function deleteActivity(req, res) {
  const id = req.params.id;
  activityDataBase.get(id, (err) => {
    if (err) {
      return res.status(400).json({ error: "This activity was not found" });
    }

    activityDataBase.del(id, (err) => {
      if (err) {
        return res.status(400).json({ error: "Internal Error" });
      }

      res.status(200).json({ success: "Activity was deleted" });
    });
  });
}

function editActivity(req, res) {
  const id = req.params.id;
  const title = req.body.title.trim();
  const description = req.body.description.trim();
  let date = req.body.data.trim();
  let place = req.body.place.trim();
  let participantsMaximum = req.body.participants.trim();

  if (!title && !date && !place && !participantsMaximum && !description) {
    return res.status(400).json({ error: "Please enter at least one" });
  }
  activityDataBase.get(id, (err, data) => {
    if (err) {
      return res.status(400).json({ error: "This activity was not found" });
    }

    const activity = JSON.parse(data);

    if (title) {
      activity.title = title;
    }

    if (description) {
      activity.description = description;
    }

    if (date) {
      date = new Date(date);
      activity.date = date;
    }

    if (place) {
      activity.place = place;
    }

    if (participantsMaximum) {
      participantsMaximum = Number(participantsMaximum);
      activity.participants_maximum = participantsMaximum;
    }

    activityDataBase.put(id, JSON.stringify(activity), (err) => {
      if (err) {
        return res.status(500).json({ error: "Internal Error" });
      }
      res.status(200).json(activity);
    });
  });
}

export {
  visualizeParticipantsOfActivity,
  visualizeAllActivities,
  addActivity,
  deleteActivity,
  editActivity,
  listAvailableActivities,
  activityDataBase,
};
