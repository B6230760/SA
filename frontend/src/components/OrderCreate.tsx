import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  makeStyles,
  Theme,
  createStyles,
  alpha,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Snackbar from "@material-ui/core/Snackbar";
import Select from "@material-ui/core/Select";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

import { UsersInterface } from "../models/IUser";
import { StatussInterface } from "../models/IStatus";
import { PreorderListsInterface } from "../models/IPreorder";
import { OrderListsInterface } from "../models/IOrder";


import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    container: {
      marginTop: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  })
);

function OrderListCreate() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [users, setUsers] = useState<Partial<UsersInterface>>({});
  const [preorderlists, setPreorderlists] = useState<PreorderListsInterface[]>([]);
  const [statuss, setStatuss] = useState<StatussInterface[]>([]);
  const [orderList, setOrderList] = useState<Partial<OrderListsInterface>>(
    {}
  );

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof orderList;
    setOrderList({
      ...orderList,
      [name]: event.target.value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    console.log(date);
    setSelectedDate(date);
  };

  const getUsers = async () => {
    const uid = Number(localStorage.getItem("uid"));
    fetch(`${apiUrl}/user/${uid}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setUsers(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getPreorderlist = async () => {
    let uid = localStorage.getItem("uid");
    fetch(`${apiUrl}/preorderlists/${uid}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
            setPreorderlists(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getStatus = async () => {
    fetch(`${apiUrl}/statuss`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
            setStatuss(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getUsers();
    getPreorderlist();
    getStatus();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      UserID: convertType(users?.ID),
      PreorderID: convertType(orderList.PreorderID),
      StatusID: convertType(orderList.StatusID),
      OrderTime: selectedDate,
    };

    console.log(data)

    const requestOptionsPost = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(`${apiUrl}/order_lists`, requestOptionsPost)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          console.log("บันทึกได้")
          setSuccess(true);
        } else {
          console.log("บันทึกไม่ได้")
          setError(true);
        }
      });
  }

  return (
    <Container className={classes.container} maxWidth="md">
      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          บันทึกข้อมูลสำเร็จ
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          บันทึกข้อมูลไม่สำเร็จ
        </Alert>
      </Snackbar>
      <Paper className={classes.paper}>
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              บันทึกการสั่งซื้อสินค้า
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={3} className={classes.root}>
        <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ผู้ใช้งาน</p>
              <Select
                native
                disabled 
                value={orderList.UserID}

              >
                <option aria-label="None" value="">
                  {users?.Name}
                </option>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>หมายเลขพรีออเดอร์</p>
              <Select
                native
                value={orderList.PreorderID}
                onChange={handleChange}
                inputProps={{
                  name: "PreorderID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกหมายเลขพรีออเดอร์
                </option>
                {preorderlists.map((item: PreorderListsInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.ID}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ยืนยันการสั่งซื้อ</p>
              <Select
                native
                value={orderList.StatusID}
                onChange={handleChange}
                inputProps={{
                  name: "StatusID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกการยืนยันการสั่งซื้อ
                </option>
                {statuss.map((item: StatussInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Statusorder}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>วันที่และเวลา</p>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  name="OrderTime"
                  value={selectedDate}
                  onChange={handleDateChange}
                  label="กรุณาเลือกวันที่และเวลา"
                  minDate={new Date("2018-01-01T00:00")}
                  format="yyyy/MM/dd hh:mm a"
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              component={RouterLink}
              to="/order_lists"
              variant="contained"
            >
              กลับ
            </Button>
            <Button
              style={{ float: "right" }}
              variant="contained"
              onClick={submit}
              color="primary"
            >
              บันทึก
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default OrderListCreate;