import { enrollmentDataBase } from "../database/index.js";
import { userDataBase } from "./accountController.js";
import { activityDataBase } from "./activityController.js";

import { v6 as uuidv6 } from "uuid";

function unenrollActivity(req, res) {
  const userId = req.user.id;
  const activityId = req.body.activity_id;

  if (!userId || !activityId) {
    res.status(400).json({ error: "Coloque todos os campos" });
  }

  activityDataBase.get(activityId, (err, activityData) => {
    if (err) {
      return res.status(400).json({ error: "A atividade não foi encontrada" });
    }

    const now = new Date();

    const activityDate = new Date(JSON.parse(activityData).date);

    if (activityDate.getTime() < now.getTime()) {
      return res.status(400).json({ error: "A atividade já foi realizada" });
    }

    userDataBase.get(userId, (err, userData) => {
      if (err) {
        return res.status(400).json({ error: "O usuario não foi encontrado" });
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

        if (indexActivity == -1) {
          return res
            .status(400)
            .json({ error: "O usuário não está na atividade" });
        }

        enrollmentDataBase.del(currentActivity[indexActivity].key, (err) => {
          if (err) {
            return res.status(500).json({ error: "Erro interno no servidor" });
          }
          return res
            .status(201)
            .json({ success: "A desinscrição foi um sucesso" });
        });
      });
    });
  });
}

function enrollActivity(req, res) {
  const userId = req.user.id;
  const activityId = req.body.activity_id;

  const now = new Date();

  if (!userId || !activityId) {
    res.status(400).json({ error: "Coloque todos os campos" });
  }

  activityDataBase.get(activityId, (err, activityData) => {
    if (err) {
      return res.status(400).json({ error: "A atividade não foi encontrada" });
    }

    const now = new Date();

    const activityDate = new Date(JSON.parse(activityData).date);

    if (activityDate.getTime() < now.getTime()) {
      return res.status(400).json({ error: "A atividade já foi realizada" });
    }

    const participantsMaximum = JSON.parse(activityData).participants_maximum;

    userDataBase.get(userId, (err, userData) => {
      if (err) {
        return res.status(400).json({ error: "O usuário não foi encontrado" });
      }

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

        if (currentActivity.find((activity) => activity.value.user == userId)) {
          return res
            .status(400)
            .json({ error: "O usuário já está na atividade" });
        }

        const id = uuidv6();
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
}

function querySearch(req, res) {
  const userId = req.user.id;
  const userAdmin = req.user.admin;
  const userIdQuery = req.query.user_id;
  const activityIdQuery = req.query.activity_id;

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

        dataEnrollment.forEach((enrollment) => {
          const activityId = enrollment.value.activity_id;
          if (enrollment.value.user == userIdQuery) {
            alreadyEnrolled.push(activityId);
          }
        });
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

  if (activityIdQuery && userAdmin) {
    enrollmentDataBase.readAllData((err, dataEnrollment) => {
      if (err) {
        return res.status(500).json({ error: "Erro interno no servidor" });
      }

      const participantsId = [];

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

      userDataBase.readAllData((err, dataUser) => {
        if (err) {
          return res.status(500).json({ error: "Erro interno no servidor" });
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
        return res.status(200).json(participants);
      });
    });
    return;
  }

  res.status(400).json({ error: "Pesquisa não é valida" });
}

export { enrollmentDataBase, unenrollActivity, enrollActivity, querySearch };
