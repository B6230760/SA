package main

import (
	"github.com/B6230760/sa/controller"
	"github.com/B6230760/sa/entity"
	"github.com/B6230760/sa/middlewares"
	"github.com/gin-gonic/gin"
)

func main() {
		entity.SetupDatabase()

		r := gin.Default()
		r.Use(CORSMiddleware())
	
		api := r.Group("")
		{
				protected := api.Use(middlewares.Authorizes())
				{
						// User Routes
						protected.GET("/users/:id", controller.ListUser)
						protected.GET("/users", controller.ListUsers)
						protected.GET("/user/:id", controller.GetUser)
						protected.PATCH("/users", controller.UpdateUser)
						protected.DELETE("/users/:id", controller.DeleteUser)

						// PreorderList Routes
						protected.GET("/preorderlists/:id", controller.ListPreorderLists)
						//protected.GET("/preorderlist", controller.ListPreorderLists)
						protected.GET("/preorderlist/:id", controller.GetPreorderList)
						protected.POST("/preorderlists", controller.CreatePreorderList)
						protected.PATCH("/preorderlists", controller.UpdatePreorderList)
						protected.DELETE("/preorderlists/:id", controller.DeletePreorderList)

						// Status Routes
						protected.GET("/statuss", controller.ListStatuss)
						protected.GET("/status/:id", controller.GetStatus)
						protected.POST("/statuss", controller.CreateStatus)
						protected.PATCH("/statuss", controller.UpdateStatus)
						protected.DELETE("/statuss/:id", controller.DeleteStatus)

						// Order Routes
						protected.GET("/order_lists/:id", controller.ListOrders)
						protected.GET("/order_lists", controller.ListOrder)
						protected.GET("/order/:id", controller.GetOrder)
						protected.POST("/order_lists", controller.CreateOrder)
						protected.PATCH("/order_lists", controller.UpdateOrder)
						protected.DELETE("/order_lists/:id", controller.DeleteOrder)

				}
		}
	
		// User Routes
		r.POST("/users", controller.CreateUser)
	
		// Authentication Routes
		r.POST("/login", controller.Login)
	
		// Run the server
		r.Run()

}
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}