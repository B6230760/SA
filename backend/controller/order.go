package controller

import (
	"net/http"

	"github.com/B6230760/sa/entity"
	"github.com/gin-gonic/gin"
)

// POST /orders
func CreateOrder(c *gin.Context) {
	var user entity.User
	var order entity.Order
	var preorder entity.Preorder
	var status entity.Status

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", order.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	// 10: ค้นหา preorder ด้วย id
	if tx := entity.DB().Where("id = ?", order.PreorderID).First(&preorder); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "preorder not found"})
		return
	}

	// 11: ค้นหา status ด้วย id
	if tx := entity.DB().Where("id = ?", order.StatusID).First(&status); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "status not found"})
		return
	}
	// 12: สร้าง order
	ol := entity.Order{
		User:  user,             // โยงความสัมพันธ์กับ Entity User
		Preorder:   preorder,    // โยงความสัมพันธ์กับ Entity Preorder
		Status:    status,       // โยงความสัมพันธ์กับ Entity Status
		OrderTime: order.OrderTime, // ตั้งค่าฟิลด์ orderTime
	}

	// 13: บันทึก
	if err := entity.DB().Create(&ol).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": ol})
}

// GET /order/:id
func GetOrder(c *gin.Context) {
	var order entity.Order
	id := c.Param("id")
	if err := entity.DB().Preload("User").Preload("Preorder").Preload("Status").Raw("SELECT * FROM orders WHERE id = ?", id).Find(&order).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": order})
}

// GET /orders
func ListOrders(c *gin.Context) {
	var orders []entity.Order
	id := c.Param("id")
	if err := entity.DB().Preload("User").Preload("Preorder").Preload("Status").Raw("SELECT * FROM orders WHERE user_id = ?", id).Find(&orders).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": orders})
}
func ListOrder(c *gin.Context) {
	var orders []entity.Order
	if err := entity.DB().Preload("User").Preload("Preorder").Preload("Status").Raw("SELECT * FROM orders" ).Find(&orders).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": orders})
}

// DELETE /orders/:id
func DeleteOrder(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM orders WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "order not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /orders
func UpdateOrder(c *gin.Context) {
	var order entity.Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", order.ID).First(&order); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "order not found"})
		return
	}

	if err := entity.DB().Save(&order).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}