import { body, validationResult } from "express-validator";

export const validateTeamMember = [
  body("email").isEmail().withMessage("Email must be valid."),
  body("phone").notEmpty().withMessage("Phone number is required."),
  body("name").notEmpty().withMessage("Name is required."),
  body("role").notEmpty().withMessage("Role is required."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
