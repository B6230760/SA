package entity

import (
	// "time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func SetupDatabase() {
	database, err := gorm.Open(sqlite.Open("pro1.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	database.AutoMigrate(
		&User{}, 
		&Preorder{}, 
		&Order{}, 
		&Status{},
	)
	db = database

	password, err := bcrypt.GenerateFromPassword([]byte("123456"), 14)

	db.Model(&User{}).Create(&User{
		Name:  "Patnarin",
		Email: "patnarin@gmail.com",
		Password: string(password),
	})
	db.Model(&User{}).Create(&User{
		Name:  "Name",
		Email: "name@example.com",
		Password: string(password),
	})

	var patnarin User
	var name User
	db.Raw("SELECT * FROM users WHERE email = ?", "patnarin@gmail.com").Scan(&patnarin)
	db.Raw("SELECT * FROM users WHERE email = ?", "name@example.com").Scan(&name)
	// Preorder Data
	preorder1 := Preorder{
		User:  patnarin,
		ProductID: 1,
		Amount:20,
	}
	db.Model(&Preorder{}).Create(&preorder1)
	// Preorder Data
	preorder2 := Preorder{
		User:  patnarin,
		ProductID: 3,
		Amount:10,

	}
	db.Model(&Preorder{}).Create(&preorder2)


	preorder3 := Preorder{
		User:  name,
		ProductID: 1,
		Amount:2,
	}
	db.Model(&Preorder{}).Create(&preorder3)

	// Status Data
	status1 := Status{
		Statusorder: "Confirm",
	}
	db.Model(&Status{}).Create(&status1)

	status2 := Status{
		Statusorder: "not sure",
	}
	db.Model(&Status{}).Create(&status2)


	
}