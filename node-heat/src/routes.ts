import { Router } from "express";
import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { CreateMessageController } from "./controllers/CreateMessageControler";
import { Get3LastMessagesController } from "./controllers/GetLast3MessagesController";
import { ProfileUserController } from "./controllers/ProfileUserController";
import { ensureAutenticated } from "./middleware/ensureAuthenticated";

const router = Router();

router.post("/authenticate", new AuthenticateUserController().handle)
router.post("/messages", ensureAutenticated, new CreateMessageController().handle)

router.get("/messages/last3", new Get3LastMessagesController().handle)

router.get("/profile", ensureAutenticated, new ProfileUserController().handle)

export { router }