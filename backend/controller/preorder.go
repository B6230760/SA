package controller

import (
	"net/http"

	"github.com/B6230760/sa/entity"
	"github.com/gin-gonic/gin"
)

// POST /preorderlists
func CreatePreorderList(c *gin.Context) {
	var preorder entity.Preorder
	if err := c.ShouldBindJSON(&preorder); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&preorder).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": preorder})
}

// GET /preorderlist/:id
func GetPreorderList(c *gin.Context) {
	var preorder entity.Preorder
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM preorders WHERE id = ?", id).Scan(&preorder).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": preorder})
}

// GET /preorderlists
func ListPreorderLists(c *gin.Context) {
	var preorders []entity.Preorder
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM preorders WHERE user_id = ?", id).Scan(&preorders).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": preorders})
}

// DELETE /preorderlists/:id
func DeletePreorderList(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM preorders WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "preorder not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /preorderlists
func UpdatePreorderList(c *gin.Context) {
	var preorder entity.Preorder
	if err := c.ShouldBindJSON(&preorder); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", preorder.ID).First(&preorder); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "preorder not found"})
		return
	}

	if err := entity.DB().Save(&preorder).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": preorder})
}