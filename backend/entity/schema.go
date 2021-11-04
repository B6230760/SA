package entity

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name  string
	Email string `gorm:"uniqueIndex"`
	Password string
	// 1 user เป็นเจ้าของได้หลาย preoderlist
	Preorders []Preorder `gorm:"foreignKey:UserID"`
	// 1 user เป็นเจ้าของได้หลาย order
	Orders []Order `gorm:"foreingKey:UserID"`
}
type Preorder struct {
	gorm.Model
	Amount	int
	UserID *uint
	User   User `gorm:"references:id"`
	Product   *uint
	PaymentmethodID *uint
}
type Status struct {
	gorm.Model
	Statusorder  string
	// 1 status มีได้หลาย order
	Orders []Order `gorm:"foreignKey:StatusID"`
}
type Order struct {
	gorm.Model
	OrderTime time.Time
	// USERID ทำหน้าที่เป็น FK
	UserID *uint
	User   User			`gorm:"references:id"`

	// PreorderListID ทำหน้าที่เป็น FK
	PreorderID *uint
	Preorder   Preorder

	// StatusID ทำหน้าที่เป็น FK
	StatusID *uint
	Status   Status		`gorm:"references:id"`
}