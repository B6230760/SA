import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

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

function Home() {
  const classes = useStyles();

  return (
    <div>
      <Container className={classes.container} maxWidth="md">
        <h1 style={{ textAlign: "center" }}>ระบบการสั่งซื้อสินค้า</h1>
        <h4>Requirements</h4>
        <p>
	      ระบบ Farm Mart เป็นระบบที่ให้ผู้ใช้ระบบที่เป็นสมาชิกสามารถ login เข้าไปในระบบ 
        โดยสมาชิกแต่ละคนสามารถที่จะทำการเลือกซื้อสินค้าได้ผ่านระบบการจองสินค้า 
        และเมื่อสมาชิกได้ทำการกดสั่งซื้อสินค้าหลังจากทำการจองสินค้าจากระบบจองสินค้าจนครบแล้ว 
        สมาชิกทำการเลือกหมายเลข order ที่ต้องการสั่งซื้อ และทำการเลือกการจัดส่งเสร็จแล้ว
        หลังจากนั้นระบบจะทำการบันทึกข้อมูลการสั่งซื้อสินค้า เมื่อสมาชิกได้ทำการเลือกช่องทางชำระเงิน
        และชำระเงินเรียบร้อยแล้วระบบจะทำการบันทึกข้อมูลการสั่งซื้อสินค้าและแสดงว่าบันทึกข้อมูลการสั่งซื้อเสร็จแล้วเรียบร้อย

        </p>
      </Container>
    </div>
  );
}
export default Home;