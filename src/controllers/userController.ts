import User from '../models/user'
import { IUser } from '../models/user'

export const registerUser = async (user: Partial<IUser>) => {
    const { name, email, password } = user
    if (!name || !email || !password) {
        return {
            error: 'Please provide all the required fields',
        }
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

export const updateUser = async (userId: string, updates: Partial<IUser>) => {
    const allowedUpdates = ['name', 'email', 'password']
    const updateFields = Object.keys(updates)

    const user = await User.findById(userId)
    if (!user) {
        return { error: 'User not found.' }
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

