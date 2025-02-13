const express = require("express")
const app = express()

const {initializeDatabase} = require("./db/db.connect")
const Recipe = require("./models/recipe.models")


app.use(express.json())

initializeDatabase()

app.get("/",(req,res)=>{
    res.send("Recipe App")
})

// Create a new recipe 

async function createRecipe(newRecipe){
    try{
        const recipe = new Recipe(newRecipe); 
        const savedRecipe = await recipe.save();
        return savedRecipe;
    }
    catch(error){
        throw error;
    }
}

app.post("/recipes",async (req,res)=>{
    try{
        const savedRecipe = await createRecipe(req.body)
        res.status(200).json({message: "Recipe added successfully.",recipe:savedRecipe})
    }
    catch(error){
        res.status(500).json({error: "Failed to add recipe.",details: error.message})
    }
})
// api to get all the recipes
async function readAllRecipes(){
    try{
        const allRecipes = await Recipe.find()
        return allRecipes 
    }
    catch (error) {
        throw error
    }
  }
  //readAllRecipes()

app.get("/recipes",async (req,res)=>{
    try{
        const recipes = await readAllRecipes()
        if(recipes.length != 0){
            res.json(recipes)
        }
        else{
            res.status(404).json({error: "No Recipes found."})
        }
    }
    catch(error){
        res.status(500).json({error:"Failed to fetch Recipes."})
    }
})
// api to get a recipe details by its title
async function readRecipeByTitle(recipeTitle){
    try{    
        const recipe = await Recipe.findOne({title:recipeTitle})
        return recipe
    }
    catch(error){
        throw error
    }
  }
  //readRecipeByTitle("Classic Chocolate Chip Cookies")
  app.get("/recipes/:recipeTitle",async (req,res)=>{
    try{
        const recipes = await readRecipeByTitle(req.params.recipeTitle)
        if(recipes.length != 0){
            res.json(recipes)
        }
        else{
            res.status(404).json({error: "No Recipes found."})
        }
    }
    catch(error){
        res.status(500).json({error:"Failed to fetch Recipes."})
    }
})

//an API to get details of all the recipes by an author. 
async function readRecipeByAutor(recipeAuthor){
    try{    
        const recipe = await Recipe.find({author:recipeAuthor})
        return recipe
    }
    catch(error){
        throw error
    }
  }
  //readRecipeByAutor("Sanjeev Kapoor")
  app.get("/recipes/author/:recipeAuthor",async (req,res)=>{
    try{
        const recipes = await readRecipeByAutor(req.params.recipeAuthor)
        if(recipes.length != 0){
            res.json(recipes)
        }
        else{
            res.status(404).json({error: "No Recipes found."})
        }
    }
    catch(error){
        res.status(500).json({error:"Failed to fetch Recipes."})
    }
})

//an API to get details of all the recipes by an difficulty. 
async function readRecipeByDifficulty(recipeDifficulty){
    try{    
        const recipe = await Recipe.find({difficulty:recipeDifficulty})
        return recipe
    }
    catch(error){
        throw error
    }
  }
  //readRecipeByDifficulty("Easy")
  app.get("/recipes/difficulty/:recipeDifficulty",async (req,res)=>{
    try{
        const recipes = await readRecipeByDifficulty(req.params.recipeDifficulty)
        if(recipes.length != 0){
            res.json(recipes)
        }
        else{
            res.status(404).json({error: "No Recipes found."})
        }
    }
    catch(error){
        res.status(500).json({error:"Failed to fetch Recipes."})
    }
})
// update  difficulty of "Spaghetti Carbonara" using id in the database

async function updateRecipe(recipeId,dataToUpdate){
    try{
      const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId,dataToUpdate,{new:true})
      return updatedRecipe
    }
    catch(error){
      console.log("Error in updating Recipe")
    }
  }
  app.post("/recipes/:recipeId",async (req,res)=>{
    try{
      const updatedRecipe = await updateRecipe(req.params.recipeId,req.body)
      if(updatedRecipe){
        res.status(200).json({message: "Recipe updated successfully.",updatedRecipe:updatedRecipe})
      }
      else{
        res.status(404).json({error: "Recipe does not exist."})
      }
    }
    catch(error){
      res.status(404).json({error: "Failed to update Recipe."})
    }
  })

  // update prep time and cook time of "Chicken Tikka Masala" with the help of its title
  async function updateRecipeByTitle(recipeTitle,dataToUpdate){
    try{
      const updatedRecipe = await Recipe.findOneAndUpdate({title:recipeTitle},dataToUpdate,{new:true})
      return updatedRecipe
    }
    catch(error){
      console.log("Error in updating Book")
    }
  }
  app.post("/recipes/title/:recipeTitle",async (req,res)=>{
    try{
      const updatedRecipe = await updateRecipeByTitle(req.params.recipeTitle,req.body)
      if(updatedRecipe){
        res.status(200).json({message: "Recipe updated successfully.",updatedRecipe:updatedRecipe})
      }
      else{
        res.status(404).json({error: "Recipe does not exist."})
      }
    }
    catch(error){
        res.status(500).json({ error: "Failed to update Recipe.", details: error.message });
    }
  })
  //  API to delete a recipe with the help of the id 
async function deleteRecipe(bookId){
    try{
        const deletedRecipe = await Recipe.findByIdAndDelete(bookId)
        return deletedRecipe
    }
    catch(error){
        console.log(error)
    }
}
app.delete("/recipes/:recipeId",async (req,res)=>{
    try{
        const deletedRecipe = await deleteRecipe(req.params.recipeId)
        if(deletedRecipe){
            res.status(200).json({message: "Recipe deleted successfully."})
        }
        else{
            res.status(404).json({message: "Recipe not found."})
        }
    }
    catch(error){
        res.status(500).json({error: "Failed to delete Recipe."})
    }
})
const PORT = 3000
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})