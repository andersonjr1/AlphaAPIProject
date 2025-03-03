import { enrollmentDataBase } from "../database/index.js";
import { userDataBase } from "./accountController.js";
import { activityDataBase } from "./activityController.js";

import { v6 as uuidv6 } from "uuid";

function unenrollActivity(req, res) {
  const userId = req.body.user_id;
  const activityId = req.body.activity_id;

  if (!userId || !activityId) {
    res.status(400).json({ error: "Please enter all data" });
  }

  activityDataBase.get(activityId, (err, activityData) => {
    if (err) {
      return res.status(400).json({ error: "This activity was not found" });
    }

    const participantsMaximum = JSON.parse(activityData).participants_maximum;

    userDataBase.get(userId, (err, userData) => {
      if (err) {
        return res.status(400).json({ error: "This user was not found" });
      }

      enrollmentDataBase.readAllData((err, data) => {
        if (err) {
          return res.status(500).json({ error: "Internal error!" });
        }

        const currentActivity = data.filter(
          (element) => element.value.activity_id == activityId
        );
        if (currentActivity.length == 0) {
          return res
            .status(400)
            .json({ error: "There is no one enrolled in this activity" });
        }

        const indexActivity = currentActivity.findIndex((activity) => {
          return activity.value.user == userId;
        });

        if (indexActivity == -1) {
          return res
            .status(400)
            .json({ error: "The user is not in the activity" });
        }

        enrollmentDataBase.del(currentActivity[indexActivity].key, (err) => {
          if (err) {
            return res.status(500).json({ error: "Internal error!" });
          }
          return res
            .status(201)
            .json({ success: "Unenrollment was successfully!" });
        });
      });
    });
  });
}

function enrollActivity(req, res) {
  const userId = req.body.user_id;
  const activityId = req.body.activity_id;

  if (!userId || !activityId) {
    res.status(400).json({ error: "Please enter all data" });
  }

  activityDataBase.get(activityId, (err, activityData) => {
    if (err) {
      return res.status(400).json({ error: "This activity was not found" });
    }

    const participantsMaximum = JSON.parse(activityData).participants_maximum;

    userDataBase.get(userId, (err, userData) => {
      if (err) {
        return res.status(400).json({ error: "This user was not found" });
      }

      enrollmentDataBase.readAllData((err, data) => {
        if (err) {
          return res.status(500).json({ error: "Internal error!" });
        }

        const currentActivity = data.filter(
          (element) => element.value.activity_id == activityId
        );

        if (currentActivity.length >= participantsMaximum) {
          return res
            .status(400)
            .json({ error: "There are no slots available in this activity" });
        }

        if (currentActivity.find((activity) => activity.value.user == userId)) {
          return res
            .status(400)
            .json({ error: "This user already is in the activity" });
        }

        const id = uuidv6();
        enrollmentDataBase.put(
          id,
          JSON.stringify({ activity_id: activityId, user: userId }),
          (err) => {
            if (err) {
              return res.status(500).json({ error: "Internal error!" });
            }
            return res
              .status(201)
              .json({ success: "Enrollment was successfully!" });
          }
        );
      });
    });
  });
}

export { enrollmentDataBase, unenrollActivity, enrollActivity };
