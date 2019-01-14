
 
DROP DATABASE tema_restaurant;
CREATE DATABASE tema_restaurant;
USE tema_restaurant;

CREATE TABLE users(
	id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
	user char(64) NOT NULL,
	pass char(64),
	name char(64)
);

CREATE TABLE manageri(
	id int PRIMARY KEY NOT NULL,
	userid int,
	nume char(64) NOT NULL,
	prenume char(64),
	data_nasterii datetime,
	data_angajarii datetime,
	FOREIGN KEY (userid) REFERENCES users(id)
);

CREATE TABLE ospatari(
	id int PRIMARY KEY NOT NULL,
	userid int,
	manager_id int,
	nume char(64) NOT NULL,
	prenume char(64),
	data_nasterii datetime,
	data_angajarii datetime,
	FOREIGN KEY (manager_id) REFERENCES manageri(id),
	FOREIGN KEY (userid) REFERENCES users(id)
);

CREATE TABLE mese(
	id int PRIMARY KEY NOT NULL,
	numar int NOT NULL
);

CREATE TABLE comenzi(
	id int PRIMARY KEY NOT NULL,
	ospatar_id int NOT NULL,
	masa_id int NOT NULL,
	FOREIGN KEY (masa_id) REFERENCES mese(id),
	FOREIGN KEY (ospatar_id) REFERENCES ospatari(id)
);

CREATE TABLE produse(
	id int PRIMARY KEY NOT NULL,
	nume char(128) NOT NULL,
	cost int NOT NULL
);

CREATE TABLE comanda_produs(
	produs_id int,
	comanda_id int,
	status char(32) DEFAULT 'nepreluata',
	FOREIGN KEY (produs_id) REFERENCES produse(id),
	FOREIGN KEY (comanda_id) REFERENCES comenzi(id),
	CHECK(status = 'nepreluata' or status = 'preluata'
			or status = 'pregatita' or status = 'finalizata')
);

insert into users (id, user, pass, name) 
	values (0, "root", "123", "root");
insert into manageri (id, userid, nume, prenume) 
	values (0, (SELECT id from users WHERE user='root'), "root", "root");

-- CREATE TABLE AngajatiProiecte (
-- 	AngajatID int,
-- 	ProiectID int,
-- 	NrOreSaptamana int NOT NULL,
-- 	CONSTRAINT AngajatProiectID PRIMARY KEY (AngajatID, ProiectID),
-- 	FOREIGN KEY (AngajatID) REFERENCES angajati(AdminID),
-- 	FOREIGN KEY (ProiectID) REFERENCES proiecte(ProiectID)
-- );

-- -- CREATE TABLE intretinuti (
-- -- 	IntretinutID int PRIMARY KEY AUTO_INCREMENT,
-- -- 	AngajatID int,
-- -- 	Nume char(64) NOT NULL,
-- -- 	Prenume char(64) NOT NULL,
-- -- 	Sex char(1) DEFAULT 'F',
-- -- 	DataNasterii datetime,
-- -- 	FOREIGN KEY (AngajatID) REFERENCES angajati(AdminID),
-- -- 	CHECK (Sex = 'F' or Sex = 'M')
-- -- );

-- -- -- CREATE TABLE proiecte(
-- -- -- 	ProiectID int PRIMARY KEY AUTO_INCREMENT,
-- -- -- 	DepartamentID int, 
-- -- -- 	NumeProiect char(64) NOT NULL,
-- -- -- 	CodProiect int NOT NULL,
-- -- -- 	Buget int,
-- -- -- 	DataLimita datetime,
-- -- -- 	FOREIGN KEY (DepartamentID) REFERENCES departamente(DepartamentID),
-- -- -- 	UNIQUE (CodProiect)
-- -- -- );

-- -- -- -- CREATE TABLE departamente (
-- -- -- -- 	DepartamentID int PRIMARY KEY AUTO_INCREMENT,
-- -- -- -- 	ManagerID int,
-- -- -- -- 	NumeDepartament char(64) NOT NULL,
-- -- -- -- 	CodDepartament char(64) NOT NULL,
-- -- -- -- 	FOREIGN KEY (ManagerID) REFERENCES angajati(AdminID),
-- -- -- -- 	UNIQUE(CodDepartament)
-- -- -- -- );

-- -- -- -- -- CREATE TABLE angajati
-- -- -- -- -- (
-- -- -- -- --     AdminID int NOT NULL PRIMARY KEY,
-- -- -- -- --     SupervizorID int,
-- -- -- -- --     DeparmentID int NOT NULL,
-- -- -- -- --     Nume varchar(50) NOT NULL,
-- -- -- -- --     Prenume varchar(50) NOT NULL,
-- -- -- -- --     CNP char(13),
-- -- -- -- --     Strada varchar(50),
-- -- -- -- --     Numar char (10),
-- -- -- -- --     Oras varchar(50),
-- -- -- -- --     Judet varchar(50),
-- -- -- -- --     Sex char(1),
-- -- -- -- --     DataNasterii datetime,
-- -- -- -- --     DataAngajarii datetime,
-- -- -- -- --     Salariu numeric(8, 2)
-- -- -- -- -- )
