import db from "../../config/db";
import { Student } from "../controllers/students";
import { Pagination } from "../controllers/teachers";

type Find = {
	id: number;
	ip: string;
};

export default {
	all(ip: string, pagination: Pagination, callback: Function) {
		const { page, limit } = pagination;
		const offset = limit * (page - 1);
		const query = `SELECT * , (SELECT count(*) AS total_students FROM students WHERE ip=$1 OR ip='readonly')
		FROM students
		WHERE ip=$1 OR ip='readonly'
		ORDER BY created_at ASC
		LIMIT $2 OFFSET $3
		`;
		db.query(query, [ip, limit, offset], (error, response) => {
			if (error) throw new Error(`Database error on ALL: ${error}`);
			const data = response.rows;
			const totalPages = Math.ceil(
				(Number(response.rows[0]?.total_students) || 0) / limit
			);
			callback(data, totalPages);
		});
	},
	findBy(
		ip: string,
		filter: string,
		pagination: Pagination,
		callback: Function
	) {
		const { page, limit } = pagination;
		const offset = limit * (page - 1);
		const query = `SELECT *,
			(SELECT count(*) AS total_students
				FROM students
				WHERE (ip=$1 OR ip='readonly')
				AND (name ILIKE '%${filter}%'
					OR email ILIKE '%${filter}%'))
			FROM students
			WHERE (ip=$1 OR ip='readonly')
			AND (name ILIKE '%${filter}%' OR email ILIKE '%${filter}%')
			ORDER BY created_at ASC
			LIMIT $2 OFFSET $3
			`;
		db.query(query, [ip, limit, offset], (error, response) => {
			if (error) throw new Error(`Database error on findBy: ${error}`);

			const data = response.rows;
			const totalPages = Math.ceil(
				(Number(response.rows[0]?.total_students) || 0) / limit
			);
			callback(data, totalPages);
		});
	},
	create(student: Student, callback: Function) {
		const {
			avatar_url,
			name,
			birth_date,
			email,
			school_term,
			weekly_load,
			teacher_id,
			ip,
		} = student;
		const query = `INSERT INTO students (
            avatar_url,
            name,
            birth_date,
            email,
            school_term,
			weekly_load,
			teacher_id,
			ip )
            VALUES ( $1, $2, $3, $4, $5, $6, $7, $8 )
            RETURNING id`;
		const data = [
			avatar_url,
			name,
			birth_date,
			email,
			school_term,
			weekly_load,
			teacher_id,
			ip,
		];
		db.query(query, data, (error, response) => {
			if (error) throw new Error(`Database error on CREATE: ${error}`);

			const id = Number(response.rows[0].id);
			callback(id);
		});
	},
	find({ id, ip }: Find, callback: Function) {
		const query = `SELECT students.*, teachers.name AS teacher_name FROM students LEFT JOIN teachers
            ON students.teacher_id=teachers.id WHERE students.id=$1 AND (students.ip=$2 OR students.ip='readonly')`;

		db.query(query, [id, ip], (error, response) => {
			if (error) throw new Error(`Database error on FIND: ${error}`);
			const data = response.rows[0];
			callback(data);
		});
	},
	update(student: Student, callback: Function) {
		const query = `UPDATE students
        SET avatar_url=$1,
			name=$2,
			birth_date=$3,
			email=$4,
			school_term=$5,
			weekly_load=$6,
			teacher_id=$7
		WHERE id=$8
		AND ip=$9`;
		const {
			avatar_url,
			name,
			birth_date,
			email,
			school_term,
			weekly_load,
			teacher_id,
			id,
			ip,
		} = student;

		const data = [
			avatar_url,
			name,
			birth_date,
			email,
			school_term,
			weekly_load,
			teacher_id,
			id,
			ip,
		];
		db.query(query, data, (error, response) => {
			if (error) throw `Database error on UPDATE: ${error}`;
			callback(response.rows);
		});
	},
	delete({ id, ip }: Find, callback: Function) {
		const query = `DELETE FROM students
            WHERE id=$1 AND ip=$2`;

		db.query(query, [id, ip], (error, response) => {
			if (error) throw new Error(`Database error on DELETE: ${error}`);
			const data = response.rows;
			callback(data);
		});
	},
	teacherSelectOptions(ip: string, callback: Function) {
		const query = `SELECT id, name FROM teachers WHERE ip=$1 OR ip='readonly'`;

		db.query(query, [ip], (error, response) => {
			if (error)
				throw new Error(`Database error on teacherSelectOptions: ${error}`);

			callback(response.rows);
		});
	},
};
