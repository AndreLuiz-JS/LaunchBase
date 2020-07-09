import express from "express";
import nunjucks from "nunjucks";

const server = express();

server.use(express.static("public"));
server.set("view engine", "html");

nunjucks.configure("src/views", {
	express: server,
	noCache: true,
	autoescape: false,
});

server.get("/", function (req, res) {
	res.redirect("/teachers");
});

server.get("/teachers", function (req, res) {
	res.render("teachers.njk", {
		teachers: "active",
		cards: [
			{
				name: "Jorge Abadias",
				age: 45,
				degree: "Doutorado",
				lessonType: "à distância",
				subjects: ["Matemática", "Física"],
				imageId: "9328820",
				createdAt: new Date(),
			},
			{
				name: "Sarah Thompsom",
				age: 39,
				degree: "Mestre",
				lessonType: "à distância",
				subjects: ["História", "Geografia"],
				imageId: "1408343",
				createdAt: new Date(new Date().getTime() - 689 * 1000 * 60 * 60 * 24),
			},
		],
	});
});

server.get("/students", function (req, res) {
	res.render("students.njk", { students: "active" });
});

server.use(function (req, res) {
	res.status(404).render("not-found.njk", { route: req.url });
});

server.listen(process.env.PORT || "5000", function () {});
