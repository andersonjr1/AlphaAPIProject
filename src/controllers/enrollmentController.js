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

export { enrollmentDataBase, unenrollActivity, enrollActivity };
