import { Router } from "express";
import {
  find as accountFind,
  validate,
  transfer,
} from "./controllers/account.js";
import {
  find as transactionFind,
  findTransByAccount,
} from "./controllers/transaction.js";
import { find as userFind } from "./controllers/user.js";
import auth from "./middleware/auth.js";

const router = Router();
import { join } from "path";

router.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public/index.html"));
});

// account routes
router.route("/account/find").post(auth, accountFind);
router.route("/account/auth").post(validate);
router.route("/account/transfer").post(auth, transfer);

// transaction routes
router.route("/transaction/find").post(auth, transactionFind);
router.route("/transactions/account").post(auth, findTransByAccount);

// user routes
router.route("/user/find").post(auth, userFind);

export default router;
