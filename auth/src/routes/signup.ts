import express from 'express';

const router = express.Router();

router.post('/api/users/signup', (req,res) => {
    res.send("HI there!")
});

export { router as signupRouter };