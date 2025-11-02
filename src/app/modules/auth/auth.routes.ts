import ApiError from "errors/ApiError";
import express from "express";
const router = express.Router();

// const throwError = () => (req, res, next) => {
//   next(new ApiError(500, "Something went wrong"));
// };

router.get("/change-password-partner", (req, res) => {
  res.json({ message: "✅ Shipment deleted" });
});



export const AuthRoutes = router;