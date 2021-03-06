export const getAge = (birthDate: Date) => {
	const age =
		new Date(
			//slice é necessário para remover a hora da string
			Date.parse(new Date().toISOString().slice(0, 10)) -
				Date.parse(new Date(birthDate).toISOString())
		).getFullYear() - 1970;
	return age;
};

export const getGraduation = (degree: string) => {
	switch (degree) {
		case "medio":
			return "Ensino Médio Completo";
		case "superior":
			return "Ensino Superior Completo";
		case "mestrado":
			return "Mestrado";
		case "doutorado":
			return "Doutorado";
		default:
			return "Não informado";
	}
};

export const getLessonType = (lessonType: string) => {
	return lessonType === "D"
		? "à Distância"
		: lessonType === "P"
		? "Presencial"
		: "Não informado";
};

export const getStudentBirth = (birthDate: Date) => {
	const currentYear = new Date().getFullYear().toString();
	const newBirthDate = birthDate.toISOString().substr(4);
	return currentYear + newBirthDate;
};

export const getStudentGrade = (schoolYear: string) => {
	switch (schoolYear) {
		case "fundamental5":
			return "5º ano do ensino fundamental I";
		case "fundamental6":
			return "6º ano do ensino fundamental II";
		case "fundamental7":
			return "7º ano do ensino fundamental II";
		case "fundamental8":
			return "8º ano do ensino fundamental II";
		case "fundamental9":
			return "9º ano do ensino fundamental II";
		case "medio1":
			return "1º ano do ensino médio";
		case "medio2":
			return "2º ano do ensino médio";
		case "medio3":
			return "3º ano do ensino médio";

		default:
			return "Não especificado";
	}
};
