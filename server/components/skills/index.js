// Imports
const express = require("express");

// Router Declaration
const router = express.Router();
const db = require("./skillsModel");

// Routes

router.get("/", (req, res) => {
  db.readSkills()
    .then(skills => {
      res.json(skills);
    })
    .catch(err => res.send({ error: "The skills could not be retrieved." }));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.readSkill(id)
    .then(skill => {
      if (skill) {
        res.status(200).json(skill);
      } else {
        res
          .status(404)
          .json({ message: "The skill with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ error: "The skill couldn't be retrieved" });
    });
});

router.post("/", async (req, res) => {
  if (!req.body.name) {
    return res
      .status(400)
      .json({ message: "Please provide contents for the skill." });
  }
  try {
    let data = await db.createSkill(req.body);
    return res.status(201).json({
      skill_id: data.id,
      prisoner_id: req.body.prisoner_id,
      name: req.body.name
    });
  } catch (err) {
    res.status(500).json({
      error: "There was an error while saving the skill to the database"
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let skill = await db.readSkill(id);
    if (!skill) {
      res
        .status(404)
        .json({ message: "The skill with the specified ID does not exist." });
    }
    await db.destroySkill(id);
    let updatedArray = await db.readSkills();
    return res.status(200).json({
      skills: updatedArray,
      message: "successfully deleted"
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// router.delete("/:id", (req, res) => {
//   const { id } = req.params;
//   db.readSkill(id).then(skill => {
//     if (!skill) {
//       res
//         .status(404)
//         .json({ message: "The skill with the specified ID does not exist." });
//     } else {
//       db.destroySkill(id)
//         .then(skill => {
//           res.status(200).json({ message: "skill was successfully deleted" });
//         })
//         .catch(err => {
//           console.log("Error: ", err);
//           res.status(500).json({ error: "The skill could not be removed" });
//         });
//     }
//   });
// });

//updates the user and returns the updated user object
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, prisoner_id } = req.body;
  const skill = { name, prisoner_id };

  if (!req.body.name) {
    return res.status(400).json({ message: "Can't be empty." });
  } else {
    db.readSkill(id).then(skill => {
      if (!skill) {
        return res
          .status(404)
          .json({ message: "The skill with the specified ID does not exist." });
      }
    });
  }

  db.updateSkill(id, skill)
    .then(res.status(200))
    .catch(err => {
      res.status(500).json({ error: "Didn't work, don't know why." });
    });

  db.readSkill(id).then(skill => {
    if (skill) {
      res.status(200).json(skill);
    }
  });
});

module.exports = router;
