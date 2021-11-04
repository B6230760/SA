import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { OrderListsInterface } from "../models/IOrder";
//import { ProductsInterface } from "../models/IProduct";
import { format } from 'date-fns'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(2),
    },
    table: {
      minWidth: 650,
    },
    tableSpace: {
      marginTop: 20,
    },
  })
);

function OrderLists() {
  const classes = useStyles();
  const [order, setOrders] = useState<OrderListsInterface[]>([]);
  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const getOrder = async () => {
    let uid = localStorage.getItem("uid");
    fetch(`${apiUrl}/order_lists/${uid}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setOrders(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <div>
      <Container className={classes.container} maxWidth="md">
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              ข้อมูลการสั่งซื้อสินค้า
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/order_list/create"
              variant="contained"
              color="primary"
            >
              สร้างข้อมูล
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper} className={classes.tableSpace}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" width="10%">
                  ชื่อสมาชิก
                </TableCell>
                <TableCell align="center" width="20%">
                  Email
                </TableCell>
                <TableCell align="center" width="20%">
                  หมายเลขพรีออเดอร์
                </TableCell>
                <TableCell align="center" width="20%">
                  สินค้า
                </TableCell>
                <TableCell align="center" width="20%">
                  จำนวน
                </TableCell>
                <TableCell align="center" width="20%">
                  สถานะการสั่งซื้อ
                </TableCell>
                <TableCell align="center" width="30%">
                  วันที่และเวลา
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.map((item: OrderListsInterface) => (
                <TableRow key={item.ID}>
                  <TableCell align="center">{item.User.Name}</TableCell>
                  <TableCell align="center">{item.User.Email}</TableCell>
                  <TableCell align="center">{item.Preorder.ID}</TableCell>
                   <TableCell align="center">{item.Preorder.ProductID}</TableCell> 
                  <TableCell align="center">{item.Preorder.Amount}</TableCell>
                  <TableCell align="center">{item.Status.Statusorder}</TableCell>
                  <TableCell align="center">{format((new Date(item.OrderTime)), 'dd MMMM yyyy hh:mm a')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}

export default OrderLists;