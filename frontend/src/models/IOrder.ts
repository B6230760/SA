import { PreorderListsInterface } from "./IPreorder";
import { StatussInterface } from "./IStatus";
import { UsersInterface } from "./IUser";
export interface OrderListsInterface {
  ID: string,
  OrderTime: Date,
  UserID: number,
  User : UsersInterface
  PreorderID: number,
  Preorder: PreorderListsInterface,
  StatusID: number,
  Status: StatussInterface,
}