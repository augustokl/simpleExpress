const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let totalReq = 0;

const checkIdProject = (req, res, next) => {
  const project = projects.find(element => element.id == req.params.id);

  if (!project)
    return res.status(404).json({ error: "project does not exist" });

  return next();
};

const countReq = (req, res, next) => {
  totalReq++;
  console.log(totalReq);

  return next();
};

server.post("/projects", countReq, (req, res) => {
  const { id, title, tasks } = req.body;

  const project = {
    id,
    title,
    tasks
  };

  projects.push(project);

  return res.json({ project });
});

server.get("/projects", countReq, (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkIdProject, countReq, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(element => {
    if (element.id == id) {
      element.title = title;
      return element;
    }
  });

  return res.json({ project });
});

server.delete("/projects/:id", checkIdProject, countReq, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(element => element.id == id);
  projects.splice(index, 1);

  return res.json({ projects });
});

server.post("/projects/:id/tasks", checkIdProject, countReq, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(element => {
    if (element.id == id) {
      element.tasks.push(title);
      return element;
    }
  });

  return res.json({ project });
});

server.listen(3000);
