import { Router } from "express";
import {
  find as accountFind,
  findByUser,
  transfer,
} from "./controllers/account.js";
import {
  find as transactionFind,
  findTransByAccount,
} from "./controllers/transaction.js";
import {
  find as userFind,
  validate,
  update as userUpdate,
} from "./controllers/user.js";
import auth from "./middleware/auth.js";
import access from "./middleware/access.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

router.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public/index.html"));
});

// account routes
router.route("/account/find").post(auth, accountFind);
router.route("/accounts/user").post(auth, findByUser);
router.route("/account/transfer").put(auth, transfer);

// transaction routes
router.route("/transaction/find").post(auth, transactionFind);
router.route("/transactions/account").post(auth, findTransByAccount);

// user routes
router.route("/auth").post(access, validate);
router.route("/user/find").post(auth, userFind);
router.route("/user/update").put(auth, userUpdate);

export default router;
