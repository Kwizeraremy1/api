const express = require("express");
const Joi = require("joi");
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
  { id: 4, name: "course4" },
];

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course) {
    return res.status(404).send("course with the given id was not found");
  }

  res.send(course);
});

app.post("/api/courses", (req, res) => {
  // const schema = Joi.object({
  //   name: Joi.string().min(3).required(),
  // });

  // const { error } = schema.validate(req.body);
  const errorss = validateCourse(req.params.name);
  console.log(errorss);

  if (errorss) {
    res.status(400).send(`bad request ... ${errorss.details[0].message}`);
    return;
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  (courses.push(course), res.send(courses));
});
app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res
      .status(404)
      .send(`this particular course id ${req.params.id} doesn't exist`);
    return;
  }

  const errorss = validateCourse(req.body);

  if (errorss) {
    res.status(400).send(`error here ...${errorss.details[0].message}`);
    return;
  }
  course.name = req.body.name;
  res.send(courses);
});

function validateCourse(parameter) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  const { error } = schema.validate(parameter);
  return error;
}
app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res
      .status(404)
      .send(`this particular course id ${req.params.id} doesn't exist`);
    return;
  }
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(courses);
});

const gate = process.env.PORT || 3000;

app.listen(gate, () => console.log(`listening on port ${gate}`));
