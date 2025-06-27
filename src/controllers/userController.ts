import User from '../models/user'
import { IUser } from '../models/user'
import asyncHandler from "express-async-handler";
import {NextFunction, Request, Response} from "express";
import LocationModel from "../models/location";

export const registerUser = async (user: Partial<IUser>) => {
    const { name, email, password } = user
    if (!name || !email || !password) {
        return {
            error: 'Please provide all the required fields',
        }
    }
    if (password.length < 8) {
        return { error: 'Password must be at least 8 characters long' };
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return {
            error: 'User with that email already exists.',
        }
    }
    const newUser = new User({ name, email, password })
    await newUser.save()
    const token = await newUser.generateAuthToken()
    return {
        user: newUser,
        token,
    }
}

export const loginUser = async (user: Partial<IUser>) => {
    const { email, password } = user
    if (!email || !password) {
        return {
            error: 'Please provide all the required fields',
        }
    }
    const existingUser = await User.findByCredentials(email, password)
    if (!existingUser) {
        return null
    }
    const token = await existingUser.generateAuthToken()
    return {
        user: existingUser,
        token,
    }
}

export const updateUser = async (userId: string, oldPassword: string | undefined, updates: Partial<IUser>) => {
    const allowedUpdates = ['name', 'email', 'password']
    const updateFields = Object.keys(updates)

    if (oldPassword === ''){
        return {error: 'Please provide password.'}
    }

    const user = await User.findById(userId)
    if (!user) {
        return { error: 'User not found.' }
    }


    if (!await User.findByCredentials(user.email, oldPassword!)) {
        return { error: 'Wrong password' }
    }

    let count = 0

    updateFields.forEach((field) => {
        if (allowedUpdates.includes(field) && (updates as any)[field] != '' && (updates as any)[field] != undefined) {
            (user as any)[field] = (updates as any)[field]
        } else {
            count++;
        }
    })

    if (count > 2) {
        return { error: 'No data found.' }
    }

    await user.save()
    return { user }
}

export const updateRanking = async (userId: string, updates: Partial<IUser>) => {
    const allowedUpdates = ['ranking']
    const updateFields = Object.keys(updates)

    const user = await User.findById(userId)
    if (!user) {
        return { error: 'User not found.' }
    }

    let count = 0

    updateFields.forEach((field) => {
        if (allowedUpdates.includes(field) && (updates as any)[field] != '' && (updates as any)[field] != undefined) {
            (user as any)[field] += (updates as any)[field]
        } else {
            count++;
        }
    })

    if (count > 1) {
        return { error: 'No data found.' }
    }

    await user.save()
    return { user }
}

export const getAllUsersAndRankings = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const allUsers = await User.find({}, 'name ranking -_id')
    res.send(allUsers);
});
