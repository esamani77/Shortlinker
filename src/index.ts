import { app, PORT } from "./server";

import userRoutes from "../routes/user.routes";
import urlRoutes from "../routes/url.routes";

app.use("/api/users", userRoutes);
app.use("/api/url", urlRoutes);

app.listen(PORT, () => {
  console.log("hi from port: ", PORT);
});
