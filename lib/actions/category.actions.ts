'use server'

import { CreateCategoryParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Category from "../database/models/category.model"


export const createCategory = async ({ categoryName} :CreateCategoryParams) => {
    try {
        // create a connection to the database
        await connectToDatabase()

        // Creacte a new category in the DB and return a JSON object
        const newCategory = await Category.create({name: categoryName});
        return JSON.parse(JSON.stringify(newCategory));

    } catch (error) {
        handleError(error);
    }

}


// Create a GET request end-point to get all the categories
export const getAllCategories = async () => {
    try {
        // create a connection to the database
        await connectToDatabase()

        // Get all categories
        const categories = await Category.find();

        return JSON.parse(JSON.stringify(categories));

    } catch (error) {
        handleError(error);
    }

}