import express, { Request, Response } from 'express'
import { IUser } from '../models/user'
import { loginUser, registerUser } from '../controllers/userController'
import auth, { CustomRequest } from '../middlewares/auth'

const router = express.Router()

router.post('/register', async (req: Request, res: Response) => {
    const userData: Partial<IUser> = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }
    const registeredUser = await registerUser(userData)
    if (registeredUser.error) {
        return res.status(400).json({
            error: registeredUser.error,
        })
    }
    return res.status(201).json(registeredUser);
})

router.post('/login', async (req: Request, res: Response) => {
    const userData: Partial<IUser> = {
        email: req.body.email,
        password: req.body.password,
    }
    const loggedInUser = await loginUser(userData)
    if (loggedInUser?.error) {
        return res.status(400).json({
            error: loggedInUser.error,
        })
    }
    return res.status(200).json(loggedInUser)
})

// Fetch logged in user
router.get('/me', auth, async (req: CustomRequest, res: Response) => {
    return res.status(200).json({
        user: req.user,
    })
})

// Logout user
router.post('/logout', auth, async (req: CustomRequest, res: Response) => {
    if (req.user) {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
    }

    return res.status(200).json({
        message: 'User logged out successfully.',
    })
})

// Logout user from all devices
router.post('/logoutall', auth, async (req: CustomRequest, res: Response) => {
    if (req.user) {
        req.user.tokens = []
        await req.user.save()
    }
    return res.status(200).json({
        message: 'User logged out from all devices successfully.',
    })
})

// Add a favorite location
router.post('/add-favorite', auth, async (req: CustomRequest, res: Response) => {
    const location = req.body.location
    if (!location) {
        return res.status(400).json({ error: 'Location is required.' })
    }

    if(req.user && !req.user.favorite_locations.includes(location)) {
        req.user.favorite_locations.push(location);
        await req.user.save();
    }

    return res.status(200).json({
        message: 'Location added to favorites.',
        // favorites: req.user?.favorite_locations,
    });
})

// Delete a favorite location
// router.delete('/favorites', auth, async (req: CustomRequest, res: Response) => {
//     const location = req.body.location
//     if (!location) {
//         return res.status(400).json({ error: 'Location is required.' })
//     }
//
//     req.user.favorite_locations = req.user.favorite_locations.filter(
//         (fav) => fav !== location
//     )
//     await req.user.save()
//
//     return res.status(200).json({
//         message: 'Location removed from favorites.',
//         favorites: req.user.favorite_locations,
//     })
// })
//
// // Get all favorite locations
// router.get('/favorites', auth, async (req: CustomRequest, res: Response) => {
//     return res.status(200).json({
//         favorites: req.user.favorite_locations,
//     })
// })




export default router
